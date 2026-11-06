"""Update exactly one public JSON file on the dedicated data branch."""
import base64
from bisect import bisect_left
from copy import deepcopy
from datetime import datetime
import hashlib
import json
import os
from pathlib import Path
import re
import sys
import urllib.error
import urllib.request

BRANCH = "event-schedule-data"


def instant(value):
    try:
        result = datetime.fromisoformat(value.replace("Z", "+00:00"))
        return result if result.tzinfo else None
    except (AttributeError, TypeError, ValueError):
        return None


def bundled_history(kind, region):
    """Only use records actually captured for the same region and calendar."""
    root = Path(__file__).resolve().parents[2]
    path = root / (f"stage-schedule-{region}.json" if kind == "stage" else f"event/{kind}-data.json")
    if not path.is_file():
        return None
    data = json.loads(path.read_text(encoding="utf-8"))
    result = deepcopy(data if kind == "stage" else data.get("regions", {}).get(region, {}))
    if not result:
        return None
    if kind == "gacha":
        result.update(schemaVersion=1, kind="gacha")
        for filename, field in (("gacha-extra-data.json", "events"),
                                ("gacha-assets.json", "assets"),
                                ("gacha-discounts-data.json", "discounts")):
            extra_path = root / "event" / filename
            if extra_path.is_file():
                extra = json.loads(extra_path.read_text(encoding="utf-8")).get("regions", {}).get(region, {})
                if field == "events":
                    result.setdefault("events", []).extend(extra.get("events", []))
                else:
                    result[field] = extra
    return result


def event_group(event, kind):
    if kind == "gacha":
        return (event.get("type", "rare"), event.get("name"), event.get("start"))
    return (event.get("kind"), event.get("categoryId"), event.get("itemId"), event.get("start"))


def merge_events(current, histories, kind, cutoff):
    events = current.setdefault("events", [])
    live = list(events)
    seen = {event_group(event, kind) for event in events}
    keys = {event.get("key") for event in events if event.get("key") is not None}
    for history in histories:
        groups = {}
        for event in history.get("events", []):
            start, end = instant(event.get("start")), instant(event.get("end"))
            if start is None or end is None or start >= end:
                continue
            ended = end <= cutoff
            # The frontend already splits superseded, open-ended pools. Preserve
            # their original interval only when a known successor covers its tail.
            if not ended and kind == "gacha" and start <= cutoff:
                ended = any(
                    successor.get("type", "rare") == event.get("type", "rare")
                    and successor.get("name") == event.get("name")
                    and instant(successor.get("start")) is not None
                    and start < instant(successor["start"]) <= cutoff
                    and instant(successor.get("end")) is not None
                    and instant(successor["end"]) >= end
                    for successor in live)
            if ended:
                groups.setdefault(event_group(event, kind), []).append(event)
        for group, records in groups.items():
            if group in seen:
                continue
            seen.add(group)
            for position, record in enumerate(records):
                archived = deepcopy(record)
                key = archived.get("key")
                if key is not None and key in keys:
                    identity = json.dumps([kind, current["region"], group, key, position], ensure_ascii=False)
                    archived["key"] = "history:" + hashlib.sha256(identity.encode()).hexdigest()
                if archived.get("key") is not None:
                    keys.add(archived["key"])
                events.append(archived)


def merge_stage(current, histories, cutoff):
    def intervals(windows):
        ranges = [(instant(a), instant(b)) for a, b in windows]
        return [a for a, _ in ranges], ranges

    def overlaps(start, end, indexed):
        starts, ranges = indexed
        index = bisect_left(starts, end) - 1
        return index >= 0 and ranges[index][1] > start

    for section in (None, "eventCalendar", "dayCalendar", "regularCalendar", "recurringCalendar"):
        target = current if section is None else current.get(section)
        if not isinstance(target, dict) or not isinstance(target.get("maps"), dict):
            continue
        maps = target["maps"]
        original = deepcopy(maps)
        for history in histories:
            source = history if section is None else history.get(section, {})
            for code, old in source.get("maps", {}).items():
                present = maps.get(code)
                if present and present.get("eventMapId") != old.get("eventMapId"):
                    continue
                windows = present.get("windows", []) if present else []
                latest = original.get(code, {}).get("windows", [])
                latest_ranges, stored_ranges = intervals(latest), intervals(windows)
                additions = []
                for window in old.get("windows", []):
                    start, end = map(instant, window)
                    if start is None or end is None or start >= end or end > cutoff:
                        continue
                    # A corrected current interval is authoritative; do not restore
                    # an old duration that starts at or overlaps that interval.
                    if overlaps(start, end, latest_ranges):
                        continue
                    if overlaps(start, end, stored_ranges):
                        continue
                    additions.append(list(window))
                if not additions:
                    continue
                merged = []
                for window in sorted(windows + additions, key=lambda w: instant(w[0])):
                    if merged and instant(window[0]) <= instant(merged[-1][1]):
                        if instant(window[1]) > instant(merged[-1][1]):
                            merged[-1][1] = window[1]
                    else:
                        merged.append(list(window))
                if present is None:
                    present = maps[code] = deepcopy(old)
                present["windows"] = merged


def retain_history(feed, histories):
    """Keep known ended records; never restore removed current/future events."""
    cutoff = instant(feed.get("fetchedAt"))
    if cutoff is None:
        return feed
    kind = feed.get("kind") or "stage"
    histories = [history for history in histories if isinstance(history, dict)
                 and history.get("schemaVersion") == 1 and history.get("region") == feed["region"]
                 and (history.get("kind") or "stage") == kind]
    result = deepcopy(feed)
    if kind == "stage":
        merge_stage(result, histories, cutoff)
    else:
        merge_events(result, histories, kind, cutoff)
    if kind == "gacha":
        # Archived banner assets are fallbacks; fresh assets always win.
        for history in histories:
            for field, values in history.get("assets", {}).items():
                if isinstance(values, dict):
                    destination = result.setdefault("assets", {}).setdefault(field, {})
                    for key, value in values.items():
                        destination.setdefault(key, deepcopy(value))
        discounts = result.get("discounts")
        if isinstance(discounts, dict):
            markers = discounts.setdefault("events", [])
            seen = {(e.get("categoryId"), e.get("itemId"), e.get("start")) for e in markers}
            for history in histories:
                for marker in history.get("discounts", {}).get("events", []):
                    key = (marker.get("categoryId"), marker.get("itemId"), marker.get("start"))
                    start = instant(marker.get("start"))
                    # Discount reset markers appear only on their start date.
                    if key not in seen and start is not None and start <= cutoff:
                        markers.append(deepcopy(marker))
                        seen.add(key)
    return result


def main():
    content = Path(sys.argv[1]).read_bytes()
    feed = json.loads(content)
    if feed.get("schemaVersion") != 1 or feed.get("region") not in ("kr", "jp"):
        raise RuntimeError("Invalid calendar export")
    kind = feed.get("kind") or "stage"
    if feed.get("kind") not in (None, "gacha", "sale"):
        raise RuntimeError("Invalid schedule kind")
    filename = f"{kind}-schedule-{feed['region']}.json"
    repo = os.environ["GITHUB_REPOSITORY"]
    if not re.fullmatch(r"[\w.-]+/[\w.-]+", repo):
        raise RuntimeError("Invalid repository")
    base = f"https://api.github.com/repos/{repo}"

    def api(path, data=None, allow_missing=False):
        request = urllib.request.Request(base + ("/" + path if path else ""),
            data=None if data is None else json.dumps(data).encode(),
            headers={"Authorization": "Bearer " + os.environ["GH_TOKEN"],
                     "Accept": "application/vnd.github+json", "User-Agent": "NyankoDB-stage-schedule",
                     "Content-Type": "application/json", "X-GitHub-Api-Version": "2022-11-28"})
        if data is not None:
            request.method = "PUT" if path.startswith("contents/") else "POST"
        try:
            with urllib.request.urlopen(request, timeout=30) as response:
                return json.load(response)
        except urllib.error.HTTPError as error:
            if allow_missing and error.code == 404:
                return None
            raise RuntimeError(f"GitHub data publication failed (HTTP {error.code})") from None

    # Contents API changes only this file and preserves every other remote path.
    if api("git/ref/heads/" + BRANCH, allow_missing=True) is None:
        default = api("")["default_branch"]
        head = api("git/ref/heads/" + default)["object"]["sha"]
        api("git/refs", {"ref": "refs/heads/" + BRANCH, "sha": head})
    previous = api(f"contents/{filename}?ref={BRANCH}", allow_missing=True)
    if instant(feed.get("fetchedAt")) is not None:
        history = None
        if previous:
            blob = previous
            if not blob.get("content") and blob.get("size", 0) > 1000000:
                blob = api("git/blobs/" + previous["sha"])
            if blob.get("content"):
                history = json.loads(base64.b64decode(blob["content"]))
        merged = retain_history(feed, [history, bundled_history(kind, feed["region"])])
        if merged != feed:
            content = (json.dumps(merged, ensure_ascii=False, separators=(",", ":")) + "\n").encode()
    body = {"message": f"Update official {feed['region'].upper()} {kind} schedule", "branch": BRANCH,
            "content": base64.b64encode(content).decode()}
    if previous:
        body["sha"] = previous["sha"]
    api("contents/" + filename, body)
    print("Published official schedule JSON on " + BRANCH)


if __name__ == "__main__":
    main()
