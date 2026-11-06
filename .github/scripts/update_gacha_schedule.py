"""Export official KR/JP gatya.tsv with the existing NyankoDB pool rules."""
from __future__ import annotations

import argparse
from collections import Counter
from datetime import datetime, timedelta
from html import unescape
import json
import os
from pathlib import Path
import re
import sys

from update_stage_schedule import (FRESHNESS_SECONDS, KST, REGIONS, ScheduleError,
                                   _request, fetch_sale, iso, stamp)
from gacha_discounts import make_discounts

CATALOG = Path(__file__).resolve().parents[1] / "gacha-catalog.json"
KINDS = {0: "N", 1: "R", 4: "E"}


def parse_gatya(content: bytes) -> list[dict]:
    try:
        lines = content.decode("utf-8-sig").strip().splitlines()
        if lines[0] != "[start]" or lines[-1] != "[end]":
            raise ValueError
        records = []
        for line_number, line in enumerate(lines[1:-1], 2):
            if not line.strip():
                continue
            cells = line.split("\t")
            if int(cells[6]) != 0:
                raise ValueError
            pos = 8
            sections = int(cells[7])
            for _ in range(sections):
                count = int(cells[pos]); pos += 1 + count * 4
                count = int(cells[pos]); pos += 1 + count
                pos += 1
                count = int(cells[pos]); pos += 1 + count * 2
            kind, count = map(int, cells[pos:pos + 2]); pos += 2
            if kind in KINDS and sections:
                raise ScheduleError("Unsupported recurring gacha sections; previous feed preserved")
            entries = []
            width = 17 if kind == 4 else 15
            for slot in range(count):
                entry = cells[pos:pos + width]
                if len(entry) != width:
                    raise ValueError
                entries.append(dict(slot=slot, id=int(entry[0]), mask=int(entry[3]),
                    weights=[int(entry[4 + 2 * r]) for r in range(5)],
                    guarantees=[int(entry[5 + 2 * r]) for r in range(5)], message=entry[14]))
                pos += width
            start, end = stamp(int(cells[0]), int(cells[1])), stamp(int(cells[2]), int(cells[3]))
            if end <= start or int(cells[4]) > int(cells[5]):
                raise ValueError
            records.append(dict(line=line_number, type=kind, entries=entries,
                start=iso(start), end=iso(end), minimum=int(cells[4]), maximum=int(cells[5])))
        return records
    except (ValueError, IndexError, UnicodeError):
        raise ScheduleError("Invalid official gatya.tsv; previous feed preserved") from None


def official_url(kind: str, gid: int, region: str) -> str:
    folder = {"R": "rare", "N": "normal", "E": "event"}[kind]
    locale = "kr/" if region == "kr" else ""
    return f"https://ponosgames.com/information/appli/battlecats/gacha/{folder}/{locale}{kind}{gid:03}.html"


def catalog_name(kind: str, gid: int, region: str, catalog: dict) -> str | None:
    """Use NyankoDB's Korean family name before regional source labels."""
    key = f"{kind}:{gid}"
    local = catalog["regions"][region]
    korean = catalog["regions"]["kr"]
    if kind == "R":
        option = local["tables"][kind]["options"].get(str(gid), {})
        image_id = int(option.get("imgID", -1))
        image_id = gid if image_id < 0 else image_id
        canonical = catalog["bannerNames"].get(str(image_id))
        if canonical:
            return canonical
    return (korean["displayNames"].get(key) or korean["names"].get(key)
            or local["displayNames"].get(key))


def unit_name(cid: int, region: str, catalog: dict) -> str:
    korean = catalog["regions"]["kr"]["units"].get(str(cid), {})
    local = catalog["regions"][region]["units"][str(cid)]
    return (korean.get("displayName") or korean.get("name")
            or local.get("displayName") or local["name"])


def resolve_name(kind: str, gid: int, region: str, catalog: dict, cache: dict) -> tuple[str, str]:
    key = f"{kind}:{gid}"
    local = catalog["regions"][region]
    preferred = catalog_name(kind, gid, region, catalog)
    known = local["names"].get(key)
    if preferred:
        return known or preferred, preferred
    if key not in cache:
        for locale in (("kr",) if known else ("kr", "jp")):
            try:
                content, _ = _request(official_url(kind, gid, locale))
                match = re.search(r"<h2[^>]*>(.*?)</h2>", content.decode("utf-8-sig"), re.S)
                name = unescape(re.sub(r"<[^>]+>", "", match[1])).strip() if match else ""
                if name:
                    cache[key] = name
                    break
            except (ScheduleError, UnicodeError):
                continue
        if key not in cache and known:
            cache[key] = known
        if key not in cache:
            raise ScheduleError("Official gacha name unavailable; previous feed preserved")
    return known or cache[key], cache[key]


def make_feed(content: bytes, region: str, fetched_at: datetime, catalog: dict) -> dict:
    local = catalog["regions"][region]
    events, banners, display_names, names, resolved_names = [], {}, {}, {}, {}
    for rec in parse_gatya(content):
        kind = KINDS.get(rec["type"])
        if not kind:
            continue  # Preserve the previous interpretation of source types 2/3.
        table = local["tables"][kind]
        for entry in rec["entries"]:
            gid = entry["id"]
            if gid < (1 if kind == "R" else 0):
                continue
            try:
                option = table["options"][str(gid)]
                pools = [pool[gid] for pool in table["pools"]]
                if sum(entry["weights"]) != 10000 or min(entry["weights"]) < 0:
                    raise ValueError
                raw_name, display_name = resolve_name(kind, gid, region, catalog, names)
                resolved_names[f"{kind}:{gid}"] = display_name
                event = dict(key=f'{rec["line"]}:{entry["slot"]}:{gid}' if kind == "R"
                    else f'{kind}:{rec["line"]}:{entry["slot"]}:{gid}', id=gid,
                    sourceRow=rec["line"], slot=entry["slot"], name=raw_name,
                    officialUrl=official_url(kind, gid, region if kind == "R" else "kr"),
                    start=rec["start"], end=rec["end"], minVersion=rec["minimum"],
                    maxVersion=rec["maximum"], message=entry["message"], weights=entry["weights"],
                    guarantees=entry["guarantees"], mask=entry["mask"], badges=[], characters=[], bonus=None)
                if kind == "R":
                    ids = pools[0]
                    counts = Counter(ids)
                    rarities = Counter(local["units"][str(cid)]["rarity"] for cid in ids)
                    if entry["weights"][0]:
                        raise ValueError
                    for cid, copies in counts.items():
                        unit = local["units"][str(cid)]
                        rarity = unit["rarity"]
                        if rarity not in (2, 3, 4, 5):
                            raise ValueError
                        event["characters"].append(dict(id=cid, name=unit_name(cid, region, catalog), rarity=rarity,
                            copies=copies, percent=entry["weights"][rarity - 1] / 100 * copies / rarities[rarity]))
                    if abs(sum(c["percent"] for c in event["characters"]) - 100) > 1e-8:
                        raise ValueError
                    present = set(ids)
                    support = {443, 444, 445, 446, 447} <= present
                    flags = [entry["guarantees"][3] == 1, bool(entry["mask"] & 32768), support,
                        bool(entry["mask"] & 4216), {129, 131, 144, 200, 237, 238, 239} <= present,
                        support, bool(entry["mask"] & 16384), bool(entry["mask"] & 4)]
                    event["badges"] = [badge["code"] for badge, enabled in zip(catalog["badges"], flags) if enabled]
                    bonus = int(option.get("CharaID", -1))
                    if bonus >= 0:
                        if bonus in ids:
                            raise ValueError
                        event["bonus"] = dict(id=bonus, name=unit_name(bonus, region, catalog))
                    raw_image = int(option.get("imgID", -1))
                    image_id = gid if raw_image < 0 else raw_image
                    banner = catalog["banners"].get(f"gatya_bnr{image_id}.png")
                    banners[str(gid)] = dict(banner, imageId=image_id, rawImageId=raw_image) if banner else None
                    display_names[str(gid)] = display_name
                else:
                    event["type"] = "normal" if kind == "N" else "event"
                    pool_entries = [("unit", cid, local["units"][str(cid)]["rarity"]) for cid in pools[0]]
                    for index, pool in enumerate(pools[1:], 1):
                        for raw_id in pool:
                            item_id = raw_id + 60 if index == 1 else raw_id
                            item = local["items"][str(item_id)]
                            pool_entries.append(("item", item_id, item["rarity"]))
                    counts = Counter(pool_entries)
                    rarities = Counter(rarity for _, _, rarity in pool_entries)
                    rewards = []
                    for (reward_kind, reward_id, rarity), copies in counts.items():
                        weight = entry["weights"][rarity]
                        if not weight:
                            continue
                        reward = dict(kind="unit", id=reward_id, name=unit_name(reward_id, region, catalog)) if reward_kind == "unit" else dict(local["items"][str(reward_id)])
                        if reward_kind == "item":
                            reward["name"] = catalog["regions"]["kr"]["items"].get(str(reward_id), {}).get("name") or reward["name"]
                        reward.update(rarity=rarity, copies=copies, percent=weight / 100 * copies / rarities[rarity])
                        rewards.append(reward)
                    unassigned = sum(weight for rarity, weight in enumerate(entry["weights"]) if not rarities[rarity]) / 100
                    special_source = local["specials"].get(str(gid)) if kind == "E" else None
                    if abs(sum(r["percent"] for r in rewards) + unassigned - 100) > 1e-8 or (unassigned and not special_source):
                        raise ValueError
                    specials = []
                    for special in special_source["data"] if special_source else []:
                        if special["type"] != 2:
                            raise ValueError
                        reward = dict(local["items"][str(special["id"])])
                        reward["name"] = catalog["regions"]["kr"]["items"].get(str(special["id"]), {}).get("name") or reward["name"]
                        reward.pop("rarity", None)
                        reward.update(quantity=special["value"], maxCount=special["weight"], special=True)
                        specials.append(reward)
                    image = int(option.get("seriesID", -1)) if kind == "N" else int(option.get("imgID", -1))
                    image = gid if image < 0 else image
                    filename = f"gatya_n_btn{image:02}.png" if kind == "N" else f"gatya_e_bnr{image:02}.png"
                    event.update(rewards=rewards, specialRewards=specials, specialSource=special_source,
                        specialSlotPercent=unassigned, banner=catalog["banners"].get(filename))
                events.append(event)
            except (KeyError, IndexError, ValueError):
                raise ScheduleError("Gacha catalog/probability mismatch; update the game catalog. Previous feed preserved") from None
    events.sort(key=lambda event: 0 if "type" not in event else 1)
    if not events:
        raise ScheduleError("Official gacha feed contains no supported events")
    return dict(schemaVersion=1, kind="gacha", region=region, fetchedAt=iso(fetched_at),
        validUntil=iso(fetched_at + timedelta(seconds=FRESHNESS_SECONDS)),
        source=REGIONS[region]["source"].replace("sale.tsv", "gatya.tsv"),
        gameVersion=REGIONS[region]["gameVersion"], badges=catalog["badges"], events=events,
        assets=dict(banners=banners, displayNames=display_names, names=resolved_names))


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--region", choices=REGIONS, default="kr")
    parser.add_argument("--output", type=Path, required=True)
    parser.add_argument("--auth-file", type=Path)
    parser.add_argument("--source-file", type=Path)
    parser.add_argument("--discount-source-file", type=Path)
    args = parser.parse_args()
    try:
        if args.auth_file and args.auth_file.resolve().is_relative_to(Path(__file__).resolve().parents[2]):
            raise ScheduleError("Private authentication must stay outside the published site")
        if args.source_file:
            content = args.source_file.read_bytes()
            item_content = args.discount_source_file.read_bytes() if args.discount_source_file else None
        else:
            auth_text = args.auth_file.read_text("utf-8") if args.auth_file else os.environ.get("PONOS_EVENT_AUTH", "")
            if not auth_text:
                raise ScheduleError("PONOS_EVENT_AUTH or a private --auth-file is required")
            content, _ = fetch_sale(json.loads(auth_text), region=args.region, resource="gatya.tsv")
            item_content, _ = fetch_sale(json.loads(auth_text), region=args.region, resource="item.tsv")
        fetched_at = datetime.now(KST)
        feed = make_feed(content, args.region, fetched_at, json.loads(CATALOG.read_text("utf-8")))
        if item_content is not None:
            feed["discounts"] = make_discounts(item_content, args.region, fetched_at)
        args.output.parent.mkdir(parents=True, exist_ok=True)
        pending = args.output.with_suffix(".pending.json")
        pending.write_text(json.dumps(feed, ensure_ascii=False, separators=(",", ":")) + "\n", encoding="utf-8")
        os.replace(pending, args.output)
        print(f"Official {args.region.upper()} gacha feed updated: {len(feed['events'])} events")
        return 0
    except ScheduleError as error:
        print(str(error), file=sys.stderr)
    except (OSError, ValueError):
        print("Gacha refresh failed; previous public feed preserved", file=sys.stderr)
    return 1


if __name__ == "__main__":
    raise SystemExit(main())
