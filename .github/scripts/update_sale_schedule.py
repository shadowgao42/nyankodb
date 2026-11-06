"""Export pack, login-stamp and reward schedules from official item.tsv."""
from __future__ import annotations

import argparse
from datetime import datetime, timedelta
from html import unescape
import json
import os
from pathlib import Path
import re

from update_stage_schedule import KST, REGIONS, ScheduleError, expand_windows, fetch_sale, iso, parse_sale

ROOT = Path(__file__).resolve().parents[2]
CATALOG = ROOT / ".github/sale-catalog.json"
GACHA_CATALOG = ROOT / ".github/gacha-catalog.json"
GRANT_ITEMS = {**{i: i for i in range(6)}, 200: 22, 201: 6, 202: 20, 203: 21, 220: 105}


def plain(value: str) -> str:
    return unescape(re.sub(r"<[^>]*>", " ", value)).strip()


def parse_items(content: bytes) -> list[dict]:
    try:
        lines = content.decode("utf-8-sig").strip().splitlines()
        if not lines or lines[0] != "[start]" or lines[-1] != "[end]":
            raise ValueError("markers")
        result = []
        for row, line in enumerate(lines[1:-1], 2):
            if not line.strip():
                continue
            cells = line.split("\t")
            pos = 8
            for _ in range(int(cells[7])):
                for width in (4, 1):
                    count = int(cells[pos])
                    if count < 0 or count > len(cells):
                        raise ValueError("count")
                    pos += 1 + count * width
                pos += 1
                count = int(cells[pos])
                if count < 0 or count > len(cells):
                    raise ValueError("time count")
                pos += 1 + count * 2
            category, item, amount = map(int, cells[pos:pos + 3])
            header = "\t".join(cells[:pos] + ["1", str(item)])
            value = parse_sale(("[start]\n" + header + "\n[end]\n").encode())[0]
            value.update(row=row, categoryId=category, itemId=item, amount=amount,
                         title=plain(cells[pos + 3]), message=plain(cells[pos + 4].replace("<br>", "\n")),
                         eocClear=int(cells[pos + 5]), nativeFlag=int(cells[pos + 6]),
                         nativeEveryday=int(cells[pos + 7]))
            result.append(value)
        return result
    except (ValueError, IndexError, UnicodeError) as error:
        raise ScheduleError("Invalid official item.tsv; previous sale feed preserved") from error


def make_feed(content: bytes, region: str, fetched_at: datetime, catalog: dict,
              items: dict, korean_content: bytes | None = None) -> dict:
    records = parse_items(content)
    korean = parse_items(korean_content) if korean_content else records if region == "kr" else []
    stamp_names = {r["itemId"]: r["title"] for r in korean
                   if r["title"] and (900 <= r["itemId"] < 1000 or 35000 <= r["itemId"] < 36000)}
    titles = {(r["categoryId"], r["itemId"], r["amount"]): r["title"] for r in korean if r["title"]}
    local = catalog["regions"][region]
    events, ignored = [], []
    for record in records:
        item = record["itemId"]
        if item in (301, 302):
            ignored.append(dict(row=record["row"], itemId=item, reason="gacha-discount-reset"))
            continue
        pack = local["packs"].get(str(item))
        stamp = local["stamps"].get(str(item))
        game_item = GRANT_ITEMS.get(item)
        kind = "pack" if pack else "stamp" if stamp else "reward"
        if (800 <= item < 900 and not pack) or ((900 <= item < 1000 or 35000 <= item < 36000) and not stamp):
            raise ScheduleError(f"Sale {region}:{item} requires new pack/login metadata; previous feed preserved")
        if 0 <= item < 300 and game_item is None:
            raise ScheduleError(f"Sale grant {region}:{item} requires a mapping update; previous feed preserved")
        if not pack and not stamp and game_item is None and not 11000 <= item < 12000:
            # Notice/pop-up and unlock-control entries are not item rewards.
            ignored.append(dict(row=record["row"], itemId=item, reason="not-a-pack-stamp-or-fixed-reward"))
            continue
        if game_item is not None and record["amount"] <= 0:
            raise ScheduleError("Invalid fixed reward quantity; previous sale feed preserved")
        if pack:
            name = catalog["regions"]["kr"]["packs"].get(str(item), pack)["name"]
        elif stamp:
            name = stamp_names.get(item) or catalog["regions"]["kr"]["stamps"].get(str(item), {}).get("name") or record["title"] or "로그인 스탬프"
        elif game_item is not None:
            name = titles.get((record["categoryId"], item, record["amount"])) or record["title"] or items["regions"]["kr"]["items"][str(game_item)]["name"]
        else:
            name = record["title"] or "랭킹 도장 보상"
        start, end = record["start"], record["end"]
        # Expand the complete source validity period once, not the selected month.
        # The stage calendar's existing parser/recurrence rules remain authoritative.
        origin = start - timedelta(days=1)
        horizon = max(1, (end - origin).days + 1)
        windows, _ = expand_windows([record], item, origin, REGIONS[region]["gameVersion"], horizon)
        event = dict(key=f"{record['categoryId']}:{record['row']}:{item}", kind=kind, name=name,
            sourceRow=record["row"], categoryId=record["categoryId"], itemId=item,
            start=iso(start), end=iso(end), windows=windows, sections=record["sections"],
            minVersion=record["minVersion"], maxVersion=record["maxVersion"],
            permanent=(end - start).days >= 365, description=record["message"],
            everyday=record["nativeEveryday"] == 1 and kind != "pack",
            sourceConditions={k: record[k] for k in ("eocClear", "nativeFlag", "nativeEveryday")})
        if pack:
            event.update(banner=pack["banner"], variants=pack["variants"])
        elif stamp:
            event["days"] = stamp["days"]
        elif game_item is not None:
            reward = dict(items["regions"]["kr"]["items"][str(game_item)])
            reward.pop("rarity", None)
            reward["quantity"] = record["amount"]
            event["rewards"] = [reward]
        else:
            code = f"R{item - 11000:03}"
            target = ROOT / f"stage/{code}/index.html"
            event.update(rewards=[], href=f"../stage/{code}/index.html" if target.is_file() else None)
        events.append(event)
    return dict(schemaVersion=1, kind="sale", region=region, fetchedAt=iso(fetched_at),
        source=REGIONS[region]["source"].replace("sale.tsv", "item.tsv"),
        gameVersion=REGIONS[region]["gameVersion"], events=events, ignored=ignored)


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--region", choices=REGIONS, default="kr")
    parser.add_argument("--source-file", type=Path)
    parser.add_argument("--korean-source-file", type=Path)
    parser.add_argument("--auth-file", type=Path)
    parser.add_argument("--fetched-at")
    parser.add_argument("--output", type=Path, required=True)
    args = parser.parse_args()
    try:
        if args.auth_file and args.auth_file.resolve().is_relative_to(ROOT):
            raise ScheduleError("Private authentication must stay outside the published site")
        if args.source_file:
            content = args.source_file.read_bytes()
            fetched = datetime.fromisoformat(args.fetched_at) if args.fetched_at else datetime.fromtimestamp(args.source_file.stat().st_mtime, KST)
            korean = args.korean_source_file.read_bytes() if args.korean_source_file else None
        else:
            secret = args.auth_file.read_text("utf-8") if args.auth_file else os.environ.get("PONOS_EVENT_AUTH", "")
            if not secret:
                raise ScheduleError("Dedicated reader authentication is required")
            auth = json.loads(secret)
            content, _ = fetch_sale(auth, region=args.region, resource="item.tsv")
            korean = fetch_sale(auth, region="kr", resource="item.tsv")[0] if args.region == "jp" else content
            fetched = datetime.now(KST)
        value = make_feed(content, args.region, fetched, json.loads(CATALOG.read_text("utf-8")),
                          json.loads(GACHA_CATALOG.read_text("utf-8")), korean)
        args.output.parent.mkdir(parents=True, exist_ok=True)
        pending = args.output.with_suffix(".pending.json")
        pending.write_text(json.dumps(value, ensure_ascii=False, separators=(",", ":")) + "\n", encoding="utf-8")
        os.replace(pending, args.output)
        print(f"{args.region.upper()} sale feed exported: {len(value['events'])} schedules")
        return 0
    except ScheduleError as error:
        print(str(error))
        return 1
    except (OSError, ValueError, KeyError, TypeError):
        print("Sale export failed; previous feed preserved")
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
