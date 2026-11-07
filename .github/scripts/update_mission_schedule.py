"""Reuse the stage sale.tsv snapshot to export official mission schedules."""
from __future__ import annotations

import argparse
from copy import deepcopy
from datetime import datetime, timedelta
import hashlib
import json
import os
from pathlib import Path

from update_stage_schedule import REGIONS, KST, ScheduleError, expand_windows, iso, parse_sale

ROOT = Path(__file__).resolve().parents[2]
CATALOG = ROOT / ".github/mission-catalog.json"
# Native comeback objectives; excluded from the public event calendar by request.
EXCLUDED_MISSION_IDS = frozenset(range(9599, 9607))


def mission_kind(value):
    if value in EXCLUDED_MISSION_IDS:
        return None
    if 8000 <= value < 9000:
        return "weekly"
    if 9000 <= value < 10000:
        return "limited"
    return None


def make_feed(content, region, fetched_at, catalog):
    local = catalog["regions"][region]
    events, missing = [], []
    records = parse_sale(content)
    for record in records:
        ids = [mid for mid in record["mapIds"] if mission_kind(mid)]
        if not ids:
            continue
        # Use one calendar entry for a source mission set, with all objectives always visible.
        for kind in dict.fromkeys(mission_kind(mid) for mid in ids):
            source_ids = [mid for mid in ids if mission_kind(mid) == kind]
            members = []
            candidate_ids = [mid - 15000 if mid >= 15000 else mid for mid in source_ids]
            for mid in candidate_ids:
                member = local["missions"].get(str(mid))
                if member is None:
                    missing.append(dict(sourceRow=record["row"], missionId=mid, minVersion=record["minVersion"]))
                    members.append(dict(id=mid, name=str(mid), rewards=[], metadataMissing=True))
                else:
                    members.append(deepcopy(member))
            start, end = record["start"], record["end"]
            origin = start - timedelta(days=1)
            windows, _ = expand_windows([record], source_ids[0], origin, REGIONS[region]["gameVersion"], max(1, (end-origin).days+1))
            name = members[0]["name"]
            events.append(dict(key=f"mission:{kind}:{record['row']}", kind=kind, sourceRow=record["row"],
                missionIds=source_ids, name=name, start=iso(start), end=iso(end), windows=windows,
                sections=record["sections"], minVersion=record["minVersion"], maxVersion=record["maxVersion"],
                members=members))
    return dict(schemaVersion=1, kind="mission", region=region, fetchedAt=iso(fetched_at),
        gameVersion=REGIONS[region]["gameVersion"], catalogGameVersion=local["gameVersion"],
        source=dict(url=REGIONS[region]["source"], sha256=hashlib.sha256(content).hexdigest(), recordCount=len(records)),
        events=events, unmapped=missing)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--region", choices=REGIONS, required=True)
    parser.add_argument("--source-file", type=Path, required=True)
    parser.add_argument("--fetched-at", required=True)
    parser.add_argument("--output", type=Path, required=True)
    args = parser.parse_args()
    try:
        feed = make_feed(args.source_file.read_bytes(), args.region, datetime.fromisoformat(args.fetched_at), json.loads(CATALOG.read_text("utf-8")))
        if feed["unmapped"]:
            # Keep the known feed but expose every missing ID for the next game-data update.
            print(f"Mission metadata unavailable: {len(feed['unmapped'])} records; unknown rewards were not invented")
        args.output.parent.mkdir(parents=True, exist_ok=True)
        pending = args.output.with_suffix(".pending.json")
        pending.write_text(json.dumps(feed, ensure_ascii=False, separators=(",", ":")) + "\n", encoding="utf-8")
        os.replace(pending, args.output)
        print(f"{args.region.upper()} mission feed exported: {len(feed['events'])} schedules")
        return 0
    except (ScheduleError, OSError, ValueError, KeyError):
        print("Mission export failed; previous feed preserved")
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
