"""Build KR-first mission names, conditions and rewards from native game data."""
from __future__ import annotations

import argparse
import csv
import hashlib
from html import unescape
import json
from pathlib import Path
import re

from build_sale_catalog import reward
from build_mission_targets import make_targets, write_targets


def text(path):
    return path.read_text("utf-8-sig")


def mission_names(root, previous_root=None):
    # JP updates may append popup copy after the objective CSV column. Keep
    # unchanged legacy labels stable and parse only native new/changed rows.
    previous = {}
    if previous_root is not None:
        previous = {line.partition(",")[0]: line for line in text(previous_root / "resLocal/Mission_Name.csv").splitlines() if line.strip()}
    result = {}
    for line in text(root / "resLocal/Mission_Name.csv").splitlines():
        if not line.strip():
            continue
        separator = "|" if "|" in line and line.split("|", 1)[0].isdigit() else ","
        key, _, value = line.partition(separator)
        if key.isdigit():
            if previous_root is not None and separator == "," and previous.get(key) != line:
                columns = next(csv.reader([line]))
                value = columns[1] if len(columns) > 1 else ""
            result[int(key)] = value.split("|", 1)[0].strip()
    return result


def make_catalog(roots, game, site, previous_jp_root=None):
    names = {r: mission_names(root, previous_jp_root if r == "jp" else None) for r, root in roots.items()}
    enemies = {r: text(root / "resLocal/Enemyname.tsv").splitlines() for r, root in roots.items()}
    search = json.loads(text(site / "catalog.js").split("=", 1)[1].strip().removesuffix(";"))
    stages = {e["id"]: e for e in search["entries"] if e["kind"] == "stage"}
    result = dict(schemaVersion=1, regions={}, assetPolicy=dict(preserveExisting=True, sourcePriority=["existing", "kr", "jp"]))
    for region, root in roots.items():
        conditions = {int(row[0]): list(map(int, row[1:])) for row in csv.reader(text(root / "DataLocal/Mission_Condition.csv").splitlines()[1:]) if row}
        missions, unnamed = {}, []
        for row in csv.DictReader(text(root / "DataLocal/Mission_Data.csv").splitlines()):
            mid = int(row["mission_id"])
            condition = conditions[mid]
            goal = condition[3]
            raw = names["kr"].get(mid) or names[region].get(mid)
            if not raw:
                unnamed.append(mid)
                continue
            # Progress is personal save state. Keep the objective, never fabricate a current counter.
            label = re.sub(r"[（(](?:진행도|進行度).*?[)）]", "", raw)
            label = re.sub(r"%\d*\$?d", str(goal), label)
            if "%@" in label:
                if condition[1] != 22 or len(condition) < 7:
                    raise ValueError(f"Unsupported mission name parameter: {region}:{mid}")
                eid = condition[6]
                korean = enemies["kr"][eid] if 0 <= eid < len(enemies["kr"]) else ""
                enemy = korean or enemies[region][eid]
                label = label.replace("%@", enemy.split("\t")[0])
            label = unescape(re.sub(r"<br\s*/?>", "\n", label, flags=re.I))
            label = re.sub(r"<[^>]+>", "", label).strip()
            if re.search(r"%[@ds]", label):
                raise ValueError(f"Unresolved mission name: {region}:{mid}")
            category, item, amount = (int(row[k]) for k in ("item_category", "item", "item_count"))
            if category == 4:
                # Category 4 unlocks a map; it is not a medal or a zero-quantity item.
                code = "G" + str(item - 37000).zfill(3) if 37000 <= item < 38000 else None
                entry = stages.get(code)
                if entry is None:
                    raise ValueError(f"Unmapped mission map unlock: {region}:{item}")
                value = dict(kind="unlock", id=item, name=entry["name"], icon="../img/ui/gnb/stage.png",
                             href="../" + entry["href"], quantity=1, sourceType=category)
            else:
                value = reward(category, item, amount if category == 0 else max(1, amount), region, game)
                if value is None or value["quantity"] <= 0:
                    raise ValueError(f"Invalid mission reward: {region}:{mid}")
            missions[str(mid)] = dict(id=mid, name=label, priority=int(row["priority"]),
                rewards=[value], condition=condition, unlockConditionId=int(row["unlock_condition_id"]))
        groups = {row[0]: [int(x) for x in row[1:]] for row in csv.reader(text(root / "DataLocal/Mission_Group.csv").splitlines()[1:]) if row}
        monthly = [list(map(int, row)) for row in csv.reader(text(root / "DataLocal/Mission_Monthly.csv").splitlines()[1:]) if row]
        medals = text(root / "resLocal/medalname.tsv").splitlines()
        medal_definitions = json.loads(text(root / "DataLocal/medallist.json"))["iconID"]
        files = [root / p for p in ["DataLocal/Mission_Data.csv", "DataLocal/Mission_Condition.csv", "DataLocal/Mission_Group.csv", "DataLocal/Mission_Monthly.csv", "DataLocal/Mission_Unlock_Condition.csv", "resLocal/Mission_Name.csv", "DataLocal/medallist.json", "resLocal/medalname.tsv"]]
        result["regions"][region] = dict(gameVersion=game["regions"][region]["gameVersion"], missions=missions,
            unnamedMissionIds=unnamed,
            monthlyGroups=groups, monthlyRules=monthly,
            medals=dict(names=len(medals), definitions=len(medal_definitions),
                        missingIcons=[i for i in range(len(medals)) if not (site / f"img/medal/medal_{i:03}.png").is_file()]),
            sourceSHA256={p.name: hashlib.sha256(p.read_bytes()).hexdigest() for p in files})
    return result


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--kr-root", type=Path, required=True)
    parser.add_argument("--jp-root", type=Path, required=True)
    parser.add_argument("--previous-jp-root", type=Path, help="Preserve unchanged JP labels; parse new/changed native CSV objectives without popup copy")
    parser.add_argument("--gacha-catalog", type=Path, required=True)
    parser.add_argument("--site", type=Path, required=True)
    parser.add_argument("--output", type=Path, required=True)
    args = parser.parse_args()
    value = make_catalog(dict(kr=args.kr_root, jp=args.jp_root), json.loads(text(args.gacha_catalog)), args.site, args.previous_jp_root)
    targets = make_targets(value, dict(kr=args.kr_root, jp=args.jp_root), args.site, args.previous_jp_root)
    args.output.write_text(json.dumps(value, ensure_ascii=False, separators=(",", ":")) + "\n", encoding="utf-8")
    write_targets(args.site / "event/mission-targets.js", targets)
    print("Mission and medal metadata exported; no existing image was replaced")


if __name__ == "__main__":
    main()
