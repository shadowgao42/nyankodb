"""Resolve explicit native mission map/stage references to existing DB pages."""
from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path


def make_targets(catalog, roots, site):
    search_text = (site / "catalog.js").read_text("utf-8-sig")
    search = json.loads(search_text.split("=", 1)[1].strip().removesuffix(";"))
    stages = {str(e["id"]): e for e in search["entries"] if e["kind"] == "stage"}
    stages_by_href = {e["href"]: e for e in stages.values()}
    rules = json.loads((site / ".github/stage-schedule-maps.json").read_text("utf-8"))["mapBases"]
    # Story of Legend is always present and therefore absent from the timed-schedule bases.
    rules = {"N": 0, **rules}

    def resolve(map_id, stage_index=None):
        if 3000 <= map_id <= 3002:
            # EoC pages combine chapters except the Moon, whose files are 47/49/50.
            file_index = (47, 49, 50)[map_id-3000] if stage_index == 47 else stage_index
            href = f"stage/eoc/{file_index}.html" if file_index is not None else "stage/eoc/index.html"
            entry = stages_by_href.get(href)
            return {key: entry[key] for key in ("id", "name", "href")} if entry and (site / href).is_file() else None
        candidates = [f"{code}{map_id-base:03d}" for code, base in rules.items() if 0 <= map_id-base < 1000]
        if len(candidates) != 1:
            return None
        code = candidates[0] + (f"-{stage_index}" if stage_index is not None else "")
        entry = stages.get(code)
        if entry is None or not (site / entry["href"]).is_file():
            return None
        return {key: entry[key] for key in ("id", "name", "href")}

    result = dict(schemaVersion=1, regions={}, unresolved={}, sourceSHA256={})
    for region, root in roots.items():
        limit_path = root / "DataLocal/Mission_LimitOption.json"
        condition_digest = hashlib.sha256((root / "DataLocal/Mission_Condition.csv").read_bytes()).hexdigest()
        if condition_digest != catalog["regions"][region]["sourceSHA256"]["Mission_Condition.csv"]:
            raise ValueError(f"Mission conditions differ from the catalog: {region}; rebuild the catalog first")
        limits = json.loads(limit_path.read_text("utf-8-sig"))["limitID"]
        result["sourceSHA256"][region] = {"Mission_LimitOption.json": hashlib.sha256(limit_path.read_bytes()).hexdigest(),
            "Mission_Condition.csv": catalog["regions"][region]["sourceSHA256"]["Mission_Condition.csv"]}
        targets, unresolved = {}, []
        for mid, member in catalog["regions"][region]["missions"].items():
            condition = member["condition"]
            kind, values = condition[1], condition[4:]
            references = []
            if kind == 0:
                references = [(value, None) for value in values]
            elif kind == 1:
                references = [divmod(value, 100) for value in values]
            elif kind == 24:
                # Native restriction table supplies target maps and optional stage indices.
                for value in values:
                    option = limits.get(str(value))
                    if option is None:
                        references = []
                        break
                    references.extend((map_id, index) for map_id in option.get("Map", [])
                        for index in option.get("Stage", [None]))
            else:
                # Classification/score/collection formats need independent validation.
                continue
            resolved = [resolve(map_id, index) for map_id, index in references]
            if not resolved or any(entry is None for entry in resolved):
                unresolved.append(dict(missionId=int(mid), conditionType=kind, references=references))
                continue
            targets[mid] = list({entry["href"]: entry for entry in resolved}.values())
        result["regions"][region] = targets
        result["unresolved"][region] = unresolved
    return result


def write_targets(path, value):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text("window.NYANKODB_MISSION_TARGETS = " + json.dumps(value, ensure_ascii=False, separators=(",", ":")) + ";\n", encoding="utf-8")


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--catalog", type=Path, required=True)
    parser.add_argument("--kr-root", type=Path, required=True)
    parser.add_argument("--jp-root", type=Path, required=True)
    parser.add_argument("--site", type=Path, required=True)
    parser.add_argument("--output", type=Path, required=True)
    args = parser.parse_args()
    value = make_targets(json.loads(args.catalog.read_text("utf-8")), dict(kr=args.kr_root, jp=args.jp_root), args.site)
    write_targets(args.output, value)
    print("Mission target pages resolved from native conditions; no APK analysis performed")


if __name__ == "__main__":
    main()
