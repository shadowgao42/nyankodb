"""Fetch Korean PONOS sale.tsv and export stage windows (no third party feed).

Published maps are discovered from stage page folders using compact family rules. Authentication stays in a private file or
the PONOS_EVENT_AUTH Actions secret; the exported JSON never contains a JWT.
Protocol reference: battlecatsultimate/PackPack's EventFileGrabber/StageSchedule.
"""
from __future__ import annotations

import argparse
from datetime import date, datetime, time as day_time, timedelta, timezone
import hashlib
import hmac
import json
import os
from pathlib import Path
import re
import secrets
import sys
import urllib.error
import urllib.parse
import urllib.request

KST = timezone(timedelta(hours=9))
SOURCE = "https://nyanko-events.ponosgames.com/battlecatskr_production/sale.tsv"
AUTH_BASE = "https://nyanko-auth.ponosgames.com/v1/"
MAP_RULES = Path(__file__).resolve().parents[1] / "stage-schedule-maps.json"
STAGE_ROOT = Path(__file__).resolve().parents[2] / "stage"
MAX_WINDOWS_PER_MAP = 32
GAME_VERSION = 150601  # This site's Korean source: 15.6.1.
FRESHNESS_SECONDS = 1800
REGULAR_MINIMUM_DAYS = 365


class ScheduleError(Exception):
    pass


def iso(value: datetime) -> str:
    return value.astimezone(KST).isoformat(timespec="seconds")


def _request(url: str, data: dict | None = None, account: str = "") -> tuple[bytes, dict]:
    body = json.dumps(data, separators=(",", ":")).encode() if data is not None else None
    headers = {"User-Agent": "Dalvik/2.1.0 (Linux; U; Android 13; XQ-BC52)"}
    if body is not None:
        nonce = secrets.token_hex(32)
        headers.update({
            "Content-Type": "application/json",
            "Nyanko-Signature": nonce + hmac.new((account + nonce).encode(), body, hashlib.sha256).hexdigest(),
            "Nyanko-Signature-Version": "1", "Nyanko-Signature-Algorithm": "HMACSHA256",
            "Nyanko-Timestamp": str(int(datetime.now(timezone.utc).timestamp())),
        })
    try:
        with urllib.request.urlopen(urllib.request.Request(url, data=body, headers=headers), timeout=30) as response:
            # A feed is about 33 KB. Reject accidental HTML/error/oversized responses.
            content = response.read(2_000_001)
            if len(content) > 2_000_000:
                raise ScheduleError("Official response exceeded size limit")
            return content, dict(response.headers)
    except urllib.error.HTTPError as error:
        # Never log a request URL: it can contain the authentication JWT.
        raise ScheduleError(f"PONOS request failed (HTTP {error.code})") from None
    except (urllib.error.URLError, TimeoutError):
        raise ScheduleError("PONOS connection failed or timed out") from None


def _json_request(url: str, data: dict | None = None, account: str = "") -> dict:
    content, _ = _request(url, data, account)
    try:
        value = json.loads(content)
        if not isinstance(value, dict):
            raise ValueError
        return value
    except (ValueError, UnicodeError):
        raise ScheduleError("Invalid PONOS authentication response") from None


def bootstrap_auth() -> dict:
    """Create one dedicated anonymous reader; never use the player's save/account."""
    response = _json_request("https://nyanko-backups.ponosgames.com/?action=createAccount&referenceId=")
    account = response.get("accountId")
    if not response.get("success") or not isinstance(account, str) or not account:
        raise ScheduleError("PONOS anonymous reader creation failed")
    result = _json_request(AUTH_BASE + "users", {
        "accountCode": account, "accountCreatedAt": str(int(datetime.now(timezone.utc).timestamp())),
        "nonce": secrets.token_hex(16),
    }, account).get("payload", {})
    if not result.get("password"):
        raise ScheduleError("PONOS anonymous reader registration failed")
    return {"accountCode": account, "password": result["password"]}


def fetch_sale(auth: dict, game_version: int = GAME_VERSION) -> tuple[bytes, dict]:
    account, password = auth.get("accountCode"), auth.get("password")
    if not isinstance(account, str) or not account or not isinstance(password, str) or not password:
        raise ScheduleError("PONOS_EVENT_AUTH requires accountCode and password")
    result = _json_request(AUTH_BASE + "tokens", {
        "accountCode": account, "password": password, "nonce": secrets.token_hex(16),
        "clientInfo": {"client": {"countryCode": "kr", "version": str(game_version)},
                       "device": {"model": "XQ-BC52"}, "os": {"type": "android", "version": "13"}},
    }, account).get("payload", {})
    token = result.get("token")
    if not isinstance(token, str) or not token:
        raise ScheduleError("PONOS reader authentication failed; renew the private reader secret")
    return _request(SOURCE + "?jwt=" + urllib.parse.quote(token, safe=""))


def minutes(value: int) -> int:
    if value == 2400:
        return 1440
    hour, minute = divmod(value, 100)
    if hour not in range(24) or minute not in range(60):
        raise ScheduleError(f"Unsupported event time: {value}")
    return hour * 60 + minute


def stamp(value: int, clock: int, year: int | None = None) -> datetime:
    if value < 10000:
        if year is None:
            raise ScheduleError("Annual date requires a year")
        month, day = divmod(value, 100)
    else:
        year, rest = divmod(value, 10000)
        month, day = divmod(rest, 100)
    return datetime(year, month, day, tzinfo=KST) + timedelta(minutes=minutes(clock))


def parse_sale(content: bytes) -> list[dict]:
    try:
        lines = content.decode("utf-8-sig").strip().splitlines()
    except UnicodeError:
        raise ScheduleError("Official sale.tsv is not UTF-8") from None
    if not lines or lines[0].strip() != "[start]" or lines[-1].strip() != "[end]":
        raise ScheduleError("Official sale.tsv markers are missing")
    records = []
    for number, line in enumerate(lines[1:-1], 2):
        if not line.strip():
            continue
        try:
            values = [int(cell) for cell in line.split("\t")]
            cursor = 0

            def take() -> int:
                nonlocal cursor
                result = values[cursor]
                cursor += 1
                return result

            def count() -> int:
                value = take()
                if value < 0 or value > len(values):
                    raise ValueError("invalid count")
                return value

            start_date, start_time, end_date, end_time = [take() for _ in range(4)]
            start, end = stamp(start_date, start_time), stamp(end_date, end_time)
            minimum, maximum, flag = take(), take(), take()
            if flag != 0 or end <= start or minimum > maximum:
                raise ValueError("unsupported record header")
            sections = []
            for _ in range(count()):
                ranges = [[take() for _ in range(4)] for _ in range(count())]
                days = [take() for _ in range(count())]
                week_mask = take()
                times = [[take(), take()] for _ in range(count())]
                if any(day not in range(1, 32) for day in days) or week_mask not in range(128):
                    raise ValueError("unsupported date filter")
                for first, last in times:
                    minutes(first), minutes(last)
                    if first == last:
                        raise ValueError("ambiguous zero-length time window")
                for first, first_time, last, last_time in ranges:
                    # Yearless MMDD is an annual range; full YYYYMMDD is absolute.
                    stamp(first, first_time, 2000), stamp(last, last_time, 2000)
                    if (first < 10000) != (last < 10000):
                        raise ValueError("mixed date range")
                sections.append({"dateRanges": ranges, "monthDays": days,
                                 "weekMask": week_mask, "times": times})
            ids = [take() for _ in range(count())]
            # Preserve the observed optional zero without assigning it a meaning.
            # PackPack also stops at map count; this is never an extra map ID.
            if values[cursor:] not in ([], [0]):
                raise ValueError("unsupported trailing fields")
            records.append({"row": number, "start": start, "end": end, "minVersion": minimum,
                            "maxVersion": maximum, "sections": sections, "mapIds": ids,
                            "unparsedTrailingValues": values[cursor:]})
        except (ValueError, IndexError, OverflowError, ScheduleError):
            # Fail the whole refresh rather than publish a partial calendar.
            raise ScheduleError(f"Unsupported official sale.tsv row {number}") from None
    if not records:
        raise ScheduleError("Official sale.tsv contains no records")
    return records


def _range_windows(ranges: list[list[int]], day: date) -> list[tuple[datetime, datetime]]:
    result = []
    for first, first_time, last, last_time in ranges:
        for year in ([day.year - 1, day.year] if first < 10000 else [None]):
            try:
                start, end = stamp(first, first_time, year), stamp(last, last_time, year)
                if first < 10000 and end <= start:
                    end = stamp(last, last_time, year + 1)
                if end > start:
                    result.append((start, end))
            except ValueError:  # A February 29 range is absent in a non-leap year.
                continue
    return result


def expand_windows(records: list[dict], map_id: int, now: datetime, game_version: int,
                   horizon_days: int = 400) -> tuple[list[list[str]], list[int]]:
    if now.tzinfo is None:
        raise ValueError("now must have an explicit timezone")
    now = now.astimezone(KST)
    horizon = now + timedelta(days=horizon_days)
    intervals = []
    rows = []
    for record in records:
        if map_id not in record["mapIds"] or not record["minVersion"] <= game_version <= record["maxVersion"]:
            continue
        rows.append(record["row"])
        start, end = record["start"], record["end"]
        if end <= now or start >= horizon:
            continue
        if not record["sections"]:
            intervals.append((start, end))
            continue
        sections = record["sections"]
        def full_day(section):
            return not section["times"] or section["times"] == [[0, 2400]]
        unconditional = any(
            not section["dateRanges"] and not section["monthDays"]
            and section["weekMask"] in (0, 127) and full_day(section)
            for section in sections
        )
        if unconditional:
            intervals.append((start, end))
            continue
        daily_sections = []
        for section in sections:
            if section["dateRanges"] and not section["monthDays"] and section["weekMask"] == 0 and full_day(section):
                # A search horizon limits which occurrence we find, never its true end.
                for year in range(now.year, horizon.year + 1):
                    for mask_start, mask_end in _range_windows(section["dateRanges"], date(year, 1, 1)):
                        lo, hi = max(start, mask_start), min(end, mask_end)
                        if lo < hi and hi > now and lo < horizon:
                            intervals.append((lo, hi))
            else:
                daily_sections.append(section)
        day = max((now - timedelta(days=1)).date(), start.date())
        last_day = min(end.date(), horizon.date())
        while day <= last_day:
            midnight = datetime.combine(day, day_time(), KST)
            for section in daily_sections:
                # Sunday is bit 0; Saturday is bit 6. Weekend 65 is both bits.
                weekday_bit = 1 << ((day.weekday() + 1) % 7)
                if section["monthDays"] and day.day not in section["monthDays"]:
                    continue
                if section["weekMask"] and not section["weekMask"] & weekday_bit:
                    continue
                masks = _range_windows(section["dateRanges"], day) if section["dateRanges"] else [(start, end)]
                for first, last in section["times"] or [[0, 2400]]:
                    a = midnight + timedelta(minutes=minutes(first))
                    b = midnight + timedelta(minutes=minutes(last))
                    if b <= a:
                        b += timedelta(days=1)
                    for mask_start, mask_end in masks:
                        lo, hi = max(a, start, mask_start), min(b, end, mask_end)
                        if lo < hi and hi > now and lo < horizon:
                            intervals.append((lo, hi))
            day += timedelta(days=1)
    merged = []
    for start, end in sorted(set(intervals)):
        if merged and start <= merged[-1][1]:
            merged[-1] = (merged[-1][0], max(merged[-1][1], end))
        else:
            merged.append((start, end))
    return [[iso(start), iso(end)] for start, end in merged], rows


def load_site_map_ids() -> dict[str, int]:
    value = json.loads(MAP_RULES.read_text("utf-8"))
    if not isinstance(value, dict):
        raise ScheduleError("Invalid stage family rules")
    bases = value.get("mapBases")
    if value.get("schemaVersion") != 2 or not isinstance(bases, dict) or not bases:
        raise ScheduleError("Invalid stage family rules")
    if any(not isinstance(code, str) or not re.fullmatch(r"[A-Z]+", code)
           or type(base) is not int or base < 1000 or base % 1000
           for code, base in bases.items()):
        raise ScheduleError("Invalid stage family identifier")
    if not STAGE_ROOT.is_dir():
        raise ScheduleError("Published stage directory is missing")
    maps = {}
    # A map index or a child battle is enough; future maps need no ID-list edit.
    for page in STAGE_ROOT.glob("*/*.html"):
        code = page.parent.name
        match = re.fullmatch(r"([A-Z]+)(\d{3})", code)
        if match and match[1] in bases and page.is_file():
            maps[code] = bases[match[1]] + int(match[2])
    if not maps:
        raise ScheduleError("No published event-stage pages found")
    return dict(sorted(maps.items()))


def is_regular_record(record: dict) -> bool:
    """Calendar policy: yearlong or longer schedules are regular/permanent.

    This is a display policy, not a flag supplied by PONOS. Short campaigns
    keep their own rows even when the same map also has a regular schedule.
    """
    return record["end"] - record["start"] >= timedelta(days=REGULAR_MINIMUM_DAYS)


def is_recurring_record(record: dict) -> bool:
    """Split the existing long-term group by explicit scheduling conditions."""
    if not is_regular_record(record) or not record["sections"]:
        return False
    # Sections are alternatives: one unrestricted section makes the row continuous.
    return not any(
        not section["dateRanges"] and not section["monthDays"]
        and section["weekMask"] in (0, 127)
        and (not section["times"] or section["times"] == [[0, 2400]])
        for section in record["sections"]
    )


def make_feed(content: bytes, headers: dict, now: datetime, game_version: int = GAME_VERSION) -> dict:
    records = parse_sale(content)
    maps = {}
    event_maps = {}
    day_maps = {}
    recurring_maps = {}
    # Include completed slots in the visible month's leading week as well.
    day_start = now.astimezone(KST).replace(day=1, hour=0, minute=0, second=0, microsecond=0) - timedelta(days=7)
    day_horizon = 400 + (now.astimezone(KST).date() - day_start.date()).days
    event_records = [record for record in records if not is_regular_record(record)]
    recurring_records = [record for record in records if is_recurring_record(record)]
    for code, map_id in load_site_map_ids().items():
        windows, rows = expand_windows(records, map_id, now, game_version)
        if windows:
            maps[code] = {"eventMapId": map_id, "sourceRows": rows, "windows": windows[:MAX_WINDOWS_PER_MAP]}
        windows, rows = expand_windows(event_records, map_id, now, game_version)
        if windows:
            event_maps[code] = {"eventMapId": map_id, "sourceRows": rows, "windows": windows}
        windows, rows = expand_windows(records, map_id, day_start, game_version, day_horizon)
        if windows:
            day_maps[code] = {"eventMapId": map_id, "sourceRows": rows, "windows": windows}
        # Priority is used only for currently active rows. One day covers the
        # entire freshness interval without duplicating the 400-day daily feed.
        windows, rows = expand_windows(recurring_records, map_id, now, game_version, 1)
        if windows:
            recurring_maps[code] = {"eventMapId": map_id, "sourceRows": rows, "windows": windows}
    return {
        "schemaVersion": 1, "region": "kr", "timezone": "Asia/Seoul", "gameVersion": game_version,
        "fetchedAt": iso(now), "validUntil": iso(now + timedelta(seconds=FRESHNESS_SECONDS)),
        "source": {"url": SOURCE, "sha256": hashlib.sha256(content).hexdigest(),
                   "lastModified": headers.get("Last-Modified"), "recordCount": len(records)},
        "maps": maps,
        "eventCalendar": {
            "schemaVersion": 1,
            "regularMinimumDays": REGULAR_MINIMUM_DAYS,
            "excludedSourceRows": [record["row"] for record in records if is_regular_record(record)],
            "maps": event_maps,
        },
        "dayCalendar": {
            "schemaVersion": 1,
            "rangeStart": iso(day_start),
            "rangeEnd": iso(day_start + timedelta(days=day_horizon)),
            "maps": day_maps,
        },
        "recurringCalendar": {
            "schemaVersion": 1,
            "rangeStart": iso(now),
            "rangeEnd": iso(now + timedelta(days=1)),
            "maps": recurring_maps,
        },
    }


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--output", type=Path, default=Path("stage-schedule-kr.json"))
    parser.add_argument("--auth-file", type=Path)
    parser.add_argument("--bootstrap-auth", action="store_true")
    parser.add_argument("--game-version", type=int, default=GAME_VERSION)
    args = parser.parse_args()
    try:
        if args.auth_file:
            site_root = Path(__file__).resolve().parents[2]
            if args.auth_file.resolve().is_relative_to(site_root):
                raise ScheduleError("The private auth file must be outside the published site")
        if args.bootstrap_auth:
            if not args.auth_file or args.auth_file.exists():
                raise ScheduleError("Provide a new private --auth-file outside the site")
            auth = bootstrap_auth()
            args.auth_file.parent.mkdir(parents=True, exist_ok=True)
            args.auth_file.write_text(json.dumps(auth), encoding="utf-8")
            print("Dedicated reader created in the private auth file. Keep its contents secret.")
            return 0
        auth_text = args.auth_file.read_text("utf-8") if args.auth_file else os.environ.get("PONOS_EVENT_AUTH", "")
        if not auth_text:
            raise ScheduleError("Set the PONOS_EVENT_AUTH secret or a private --auth-file")
        content, headers = fetch_sale(json.loads(auth_text), args.game_version)
        feed = make_feed(content, headers, datetime.now(KST), args.game_version)
        args.output.parent.mkdir(parents=True, exist_ok=True)
        pending = args.output.with_suffix(".pending.json")
        pending.write_text(json.dumps(feed, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        os.replace(pending, args.output)
        print(f"Official KR feed updated: {feed['source']['recordCount']} rows; {len(feed['maps'])} map calendars")
        return 0
    except ScheduleError as error:
        print(f"Stage schedule refresh failed: {error}. Existing public feed was preserved.", file=sys.stderr)
        return 1
    except (OSError, ValueError):
        # A safe fixed error avoids exposing auth values/URLs through tracebacks.
        print("Stage schedule refresh failed; existing public feed was preserved. Check PONOS connectivity, reader authentication and TSV schema.", file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
