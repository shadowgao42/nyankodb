"""Queue, independently recover, and verify the official schedule automation."""
import argparse
import base64
from datetime import datetime, timedelta, timezone
import json
import os
from pathlib import Path
import sys
import time

from schedule_github_api import GitHubAPI, GitHubError

TIMER = "stage-schedule-timer.yml"
ACTIVE_LIMIT = timedelta(minutes=35)


def instant(value):
    result = datetime.fromisoformat(value.replace("Z", "+00:00"))
    if result.tzinfo is None:
        raise ValueError("A timezone is required")
    return result


def runs(api, workflow=TIMER):
    return api(f"actions/workflows/{workflow}/runs?per_page=100")["workflow_runs"]


def queue_next(api, parent):
    title = f"KR schedule refresh (after {parent})"
    for attempt in range(6):
        try:
            # Dispatch may have succeeded even if its HTTP response was lost.
            if any(run.get("display_title") == title for run in runs(api)):
                print("Next refresh already queued after " + parent)
                return
            api(f"actions/workflows/{TIMER}/dispatches",
                {"ref": "main", "inputs": {"previous_run_id": parent}})
            for check in range(4):
                if any(run.get("display_title") == title for run in runs(api)):
                    print("Confirmed next automatic refresh after " + parent)
                    return
                if check < 3:
                    time.sleep(3)
            raise GitHubError(502, True)
        except GitHubError as error:
            if attempt == 5 or not error.transient:
                raise
            print(f"Queue attempt {attempt + 1}/6 failed (HTTP {error.status}); reconciling before retry", file=sys.stderr)
            time.sleep(max((5, 10, 20, 40, 60)[attempt], error.retry_after))


def verify(api, since=None):
    cutoff = instant(since) if since else datetime.now(timezone.utc) - timedelta(minutes=20)
    failures, rows = [], ["| Feed | Fetched at | State |", "| --- | --- | --- |"]
    for kind in ("stage", "gacha", "sale", "mission"):
        for region in ("kr", "jp"):
            name = f"{kind}-schedule-{region}.json"
            try:
                info = api(f"contents/{name}?ref=event-schedule-data")
                if not info.get("content"):
                    info = api("git/blobs/" + info["sha"])
                feed = json.loads(base64.b64decode(info["content"]))
                fetched = instant(feed["fetchedAt"])
                valid = (feed.get("schemaVersion") == 1 and feed.get("region") == region
                         and (feed.get("kind") or "stage") == kind
                         and cutoff <= fetched <= datetime.now(timezone.utc) + timedelta(minutes=5))
                state = "fresh" if valid else "STALE / invalid"
                stamp = feed["fetchedAt"]
            except (GitHubError, ValueError, KeyError, TypeError):
                valid, state, stamp = False, "unavailable", "-"
            rows.append(f"| {name} | {stamp} | {state} |")
            print(f"{name}: {state} ({stamp})")
            if not valid:
                failures.append(name)
    summary = os.environ.get("GITHUB_STEP_SUMMARY")
    if summary:
        with Path(summary).open("a", encoding="utf-8") as target:
            target.write("\n### Official schedule publication check\n\n" + "\n".join(rows) + "\n")
    if failures:
        raise RuntimeError("Unverified schedule publication: " + ", ".join(failures))


def recover(api):
    now = datetime.now(timezone.utc)
    active = [run for workflow in (TIMER, "update-stage-schedule.yml") for run in runs(api, workflow)
              if run["status"] != "completed"]
    healthy = [run for run in active if now - instant(run["created_at"]) < ACTIVE_LIMIT]
    if healthy:
        print("Schedule automation is active: " + ", ".join(str(run["id"]) for run in healthy))
        return
    for run in active:
        # Only our two schedule workflows, after more than their maximum lifetime.
        api(f"actions/runs/{run['id']}/cancel", {}, method="POST")
        print("Cancelled stalled schedule run " + str(run["id"]))
    queue_next(api, "recovery-" + os.environ["GITHUB_RUN_ID"])
    print("::notice::Recovered the stopped official schedule automation")


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("mode", choices=("queue", "recover", "verify"))
    parser.add_argument("--since")
    args = parser.parse_args()
    api = GitHubAPI()
    if args.mode == "queue":
        queue_next(api, os.environ["GITHUB_RUN_ID"])
    elif args.mode == "recover":
        recover(api)
    else:
        verify(api, args.since)


if __name__ == "__main__":
    try:
        main()
    except (GitHubError, RuntimeError, ValueError, KeyError) as error:
        print("::error::" + str(error), file=sys.stderr)
        raise SystemExit(1)
