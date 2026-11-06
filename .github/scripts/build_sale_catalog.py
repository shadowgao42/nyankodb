"""Build KR-first pack/login metadata without replacing existing image assets."""
from __future__ import annotations

import argparse
import csv
import hashlib
import json
from pathlib import Path
import re
import shutil
import struct

from update_gacha_schedule import unit_name


def read_text(path: Path) -> str:
    return path.read_text("utf-8-sig")


def localized(root: Path) -> dict[str, str]:
    return dict(line.split("\t", 1) for line in read_text(root / "resLocal/localizable.tsv").splitlines() if "\t" in line)


def reward(category: int, item: int, quantity: int, region: str, catalog: dict) -> dict | None:
    if category == -1:
        return None
    if category in (0, 3):
        local = catalog["regions"][region]["items"].get(str(item))
        if local is None:
            raise ValueError(f"Missing game item metadata: {region}:{item}")
        value = dict(local)
        value["name"] = catalog["regions"]["kr"]["items"].get(str(item), local)["name"]
        value.pop("rarity", None)
    elif category in (1, 2):
        form = 3 if category == 2 else 1
        value = dict(kind="unit", id=item, name=unit_name(item, region, catalog),
                     icon=f"../img/u/{item:03}_f{form - 1:02}.png",
                     href=f"../unit/unit{item:03}.html?form={form}", form=form)
    else:
        raise ValueError(f"Unsupported native reward category: {category}")
    value.update(quantity=quantity, sourceType=category)
    return value


def make_catalog(roots: dict[str, Path], gacha: dict, labels: dict, asset_root: Path) -> dict:
    texts = {region: localized(root) for region, root in roots.items()}
    native_items = {}
    for region, root in roots.items():
        native_items[region] = [line.split("|", 1)[0] if "|" in line else next(csv.reader([line]))[0]
                                for line in read_text(root / "resLocal/GatyaitemName.csv").splitlines()]
    site = asset_root.parent.parent
    for region in roots:
        for item, local_name in enumerate(native_items[region]):
            if str(item) in gacha["regions"][region]["items"]:
                continue
            korean = native_items["kr"][item] if item < len(native_items["kr"]) else ""
            name = korean or local_name
            if not name:
                continue
            gacha["regions"][region]["items"][str(item)] = dict(kind="item", id=item, name=name,
                icon=f"../img/r/{item}.png" if (site / f"img/r/{item}.png").is_file() else None,
                href=f"../item/item{item:03}.html" if (site / f"item/item{item:03}.html").is_file() else None,
                quantity=1, isExperience=item == 6)
    output = dict(schemaVersion=1, sourceGameVersions={r: gacha["regions"][r]["gameVersion"] for r in roots},
                  assetPolicy=dict(preserveExisting=True, sourcePriority=["existing", "kr", "jp"], crossRegionOverwrite=False),
                  regions={})
    korean_titles = texts["kr"]
    for region, root in roots.items():
        packs: dict[str, dict] = {}
        pack_file = root / "DataLocal/itemPack.tsv"
        stamp_file = root / "DataLocal/DailyLoginEventData.csv"
        for row in csv.DictReader(read_text(pack_file).splitlines(), delimiter="\t"):
            server = int(row["server"])
            if server < 0 or int(row["enable"]) != 1:
                continue
            key = f"item_pack_name_{row['id']}"
            title = korean_titles.get(key) or texts[region].get(key)
            product = row["productName"]
            if not title and re.fullmatch(r"chara_\d+", product):
                title = unit_name(int(product[6:]), region, gacha)
            title = re.sub(r"\s*구입$", "", title or labels.get(str(server)) or "").strip()
            rewards = []
            slots = sorted(int(k[8:]) for k in row if re.fullmatch(r"Quantity\d+", k))
            for index in slots:
                amount = row.get(f"Quantity{index}")
                if not amount:
                    continue
                item = row.get(f"ItemID{index}")
                if not item and product.startswith("chara_"):
                    item = product[6:]
                if not item:
                    raise ValueError(f"Missing item ID in pack {region}:{row['id']}")
                value = reward(int(row[f"ItemCategory{index}"]), int(item), int(amount), region, gacha)
                if value:
                    rewards.append(value)
            title = title or (rewards[0]["name"] if len(rewards) == 1 else "기간 한정 팩")
            family = packs.setdefault(str(server), dict(name=labels.get(str(server)) or title, variants=[]))
            family["variants"].append(dict(id=int(row["id"]), name=title, product=product, rewards=rewards,
                userRank=int(row.get("userrank") or 0), nativeConditions={k: row.get(k) for k in ("display", "server set", "limitid", "limitid2", "day")}))
        for server, pack in packs.items():
            if len(pack["variants"]) == 1:
                pack["name"] = pack["variants"][0]["name"]
            path = asset_root / f"itemPack_bnr_{server}.png"
            pack["banner"] = None
            if path.is_file():
                header = path.read_bytes()[:24]
                if header[:8] != b"\x89PNG\r\n\x1a\n" or header[12:16] != b"IHDR":
                    raise ValueError(f"Invalid pack banner PNG: {path.name}")
                width, height = struct.unpack(">II", header[16:24])
                pack["banner"] = dict(src=f"../img/sale/{path.name}", width=width, height=height)
        stamps = {}
        for line in read_text(stamp_file).splitlines():
            if not line.strip():
                continue
            values = list(map(int, line.rstrip(",").split(",")))
            if len(values) < 7:
                raise ValueError("Invalid login stamp header")
            pos, days = 7, []
            while pos < len(values):
                count, display_id = values[pos:pos + 2]
                if count < 0 or count > 100:
                    raise ValueError("Invalid login reward count")
                pos += 2
                rewards = []
                for _ in range(count):
                    category, item, amount = values[pos:pos + 3]
                    pos += 3
                    value = reward(category, item, amount, region, gacha)
                    if value:
                        rewards.append(value)
                days.append(dict(day=len(days) + 1, displayId=display_id, rewards=rewards))
            if pos != len(values):
                raise ValueError("Invalid login reward payload")
            stamps[str(values[0])] = dict(id=values[0], name=labels.get(str(values[0])), nativeHeader=values[:7], days=days)
        output["regions"][region] = dict(gameVersion=gacha["regions"][region]["gameVersion"], packs=packs, stamps=stamps,
            sourceSHA256={p.name: hashlib.sha256(p.read_bytes()).hexdigest() for p in (pack_file, stamp_file, root / "resLocal/localizable.tsv", root / "resLocal/GatyaitemName.csv")})
    return output


def copy_missing_assets(source_roots: dict[str, Path], destination: Path) -> list[str]:
    """First existing asset wins; a Japanese update never overwrites a KR file."""
    destination.mkdir(parents=True, exist_ok=True)
    copied = []
    for region in ("kr", "jp"):
        source = source_roots.get(region)
        if source is None:
            continue
        for path in sorted(source.glob("itemPack_bnr_*.png")):
            target = destination / path.name
            if target.exists():
                continue
            shutil.copyfile(path, target)
            copied.append(path.name)
    return copied


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--kr-root", type=Path, required=True)
    parser.add_argument("--jp-root", type=Path, required=True)
    parser.add_argument("--gacha-catalog", type=Path, required=True)
    parser.add_argument("--labels", type=Path, required=True)
    parser.add_argument("--assets", type=Path, required=True)
    parser.add_argument("--output", type=Path, required=True)
    args = parser.parse_args()
    gacha = json.loads(read_text(args.gacha_catalog))
    labels = json.loads(read_text(args.labels))
    labels = labels.get("labels", labels)
    value = make_catalog({"kr": args.kr_root, "jp": args.jp_root}, gacha, labels, args.assets)
    args.output.parent.mkdir(parents=True, exist_ok=True)
    pending = args.output.with_suffix(".pending.json")
    pending.write_text(json.dumps(value, ensure_ascii=False, separators=(",", ":")) + "\n", encoding="utf-8")
    pending.replace(args.output)
    print("Pack and login stamp catalog exported; existing assets preserved")


if __name__ == "__main__":
    main()
