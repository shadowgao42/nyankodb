"""Bounded GitHub API retries; ambiguous writes are reconciled by callers."""
import json
import os
import re
import sys
import time
import urllib.error
import urllib.request


class GitHubError(RuntimeError):
    def __init__(self, status, transient=False, retry_after=0):
        self.status, self.transient, self.retry_after = status, transient, retry_after
        super().__init__(f"GitHub request failed (HTTP {status})")


class GitHubAPI:
    def __init__(self):
        repo = os.environ["GITHUB_REPOSITORY"]
        if not re.fullmatch(r"[\w.-]+/[\w.-]+", repo):
            raise RuntimeError("Invalid repository")
        self.base = f"https://api.github.com/repos/{repo}"
        self.token = os.environ["GH_TOKEN"]

    def __call__(self, path, data=None, allow_missing=False, method=None):
        method = method or ("GET" if data is None else "POST")
        # A write may already have succeeded when its response is lost.
        attempts = 4 if method == "GET" else 1
        for attempt in range(attempts):
            request = urllib.request.Request(self.base + ("/" + path if path else ""),
                data=None if data is None else json.dumps(data).encode(), method=method,
                headers={"Authorization": "Bearer " + self.token,
                         "Accept": "application/vnd.github+json", "Content-Type": "application/json",
                         "User-Agent": "NyankoDB-stage-schedule", "X-GitHub-Api-Version": "2022-11-28"})
            try:
                with urllib.request.urlopen(request, timeout=30) as response:
                    raw = response.read()
                if not raw and method != "GET":
                    return None  # Successful workflow dispatch returns HTTP 204.
                try:
                    return json.loads(raw)
                except (ValueError, UnicodeError):
                    raise GitHubError(502, True) from None
            except urllib.error.HTTPError as error:
                if allow_missing and error.code == 404:
                    return None
                try:
                    retry_after = min(60, max(0, int(error.headers.get("Retry-After", 0))))
                except (TypeError, ValueError):
                    retry_after = 0
                limited = error.code == 403 and (retry_after > 0 or error.headers.get("X-RateLimit-Remaining") == "0")
                failure = GitHubError(error.code, limited or error.code in (408, 429, 500, 502, 503, 504), retry_after)
            except (urllib.error.URLError, TimeoutError, ConnectionError, OSError):
                failure = GitHubError(0, True)
            except GitHubError as error:
                failure = error
            if not failure.transient or attempt + 1 == attempts:
                raise failure
            print(f"GitHub {method}: HTTP {failure.status}; retrying ({attempt + 1}/{attempts - 1})", file=sys.stderr)
            time.sleep(max((2, 5, 10)[attempt], failure.retry_after))
