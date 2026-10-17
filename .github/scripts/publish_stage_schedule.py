"""Update exactly one public JSON file on the dedicated data branch."""
import base64
import json
import os
from pathlib import Path
import re
import sys
import urllib.error
import urllib.request

BRANCH = "event-schedule-data"
FILENAME = "stage-schedule-kr.json"


def main():
    content = Path(sys.argv[1]).read_bytes()
    feed = json.loads(content)
    if feed.get("schemaVersion") != 1 or feed.get("region") != "kr":
        raise RuntimeError("Invalid calendar export")
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
    previous = api(f"contents/{FILENAME}?ref={BRANCH}", allow_missing=True)
    body = {"message": "Update official Korean stage schedule", "branch": BRANCH,
            "content": base64.b64encode(content).decode()}
    if previous:
        body["sha"] = previous["sha"]
    api("contents/" + FILENAME, body)
    print("Published official schedule JSON on " + BRANCH)


if __name__ == "__main__":
    main()
