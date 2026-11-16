"""Discover recent official X posts in a public index; verify content with X oEmbed."""
from concurrent.futures import ThreadPoolExecutor
from html.parser import HTMLParser
import json
import re
import threading
import time
from urllib.parse import urlencode, urlsplit
from urllib.request import HTTPRedirectHandler, Request, build_opener

SOURCE_URL = "https://x.com/PONOS_GAME"
DISCOVERY_URL = "https://search.yahoo.co.jp/realtime/search?" + urlencode({"p": "id:PONOS_GAME", "ei": "UTF-8", "md": "t"})
_POST_ID = re.compile(r"[1-9][0-9]{14,21}")
_lock = threading.Lock()
_cached = None


class _PostText(HTMLParser):
    def __init__(self, post_id):
        super().__init__()
        self.paragraph = False
        self.parts = []
        self.date = []
        self.date_anchor = False
        self.post_id = post_id

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == "p": self.paragraph = True
        if tag == "br" and self.paragraph: self.parts.append("\n")
        if tag == "a" and not self.paragraph:
            self.date_anchor = _official_url(attrs.get("href", ""), "/ponos_game/status/" + self.post_id, query=True)

    def handle_endtag(self, tag):
        if tag == "p": self.paragraph = False
        if tag == "a": self.date_anchor = False

    def handle_data(self, value):
        if self.paragraph: self.parts.append(value)
        elif self.date_anchor: self.date.append(value)


def _official_url(value, path, query=False):
    if not isinstance(value, str) or len(value) > 4096 or re.search(r"[\x00-\x20\x7f\\]", value): return False
    try:
        parsed = urlsplit(value)
        return (parsed.scheme == "https" and parsed.hostname in ("x.com", "twitter.com")
                and not parsed.username and not parsed.password and parsed.port in (None, 443)
                and parsed.path.rstrip("/").lower() == path and not parsed.fragment
                and (query or not parsed.query))
    except ValueError:
        return False


def parse_post(data, post_id):
    if not isinstance(data, dict) or not isinstance(post_id, str) or not _POST_ID.fullmatch(post_id): return None
    if not _official_url(data.get("author_url"), "/ponos_game"): return None
    if not _official_url(data.get("url"), "/ponos_game/status/" + post_id): return None
    html = data.get("html")
    if not isinstance(html, str) or len(html) > 100_000: return None
    parser = _PostText(post_id)
    parser.feed(html)
    text = "\n".join(line.strip() for line in "".join(parser.parts).splitlines()).strip()
    date = " ".join("".join(parser.date).split())
    name = data.get("author_name")
    if not text or not date or not isinstance(name, str) or not name.strip(): return None
    return {"id": post_id, "url": "https://x.com/PONOS_GAME/status/" + post_id,
            "author": name.strip()[:200], "authorUrl": SOURCE_URL,
            "text": text[:20_000], "date": date[:100]}


class _NoRedirect(HTTPRedirectHandler):
    def redirect_request(self, *args, **kwargs):
        raise ValueError("unexpected provider redirect")


class _NextData(HTMLParser):
    def __init__(self):
        super().__init__()
        self.active = False
        self.parts = []

    def handle_starttag(self, tag, attrs):
        if tag == "script" and dict(attrs).get("id") == "__NEXT_DATA__": self.active = True

    def handle_endtag(self, tag):
        if tag == "script": self.active = False

    def handle_data(self, value):
        if self.active: self.parts.append(value)


def parse_discovery(html):
    """Only the requested account's timeline entries, never popular sidebars."""
    parser = _NextData()
    parser.feed(html)
    data = json.loads("".join(parser.parts))["props"]["pageProps"]["pageData"]
    if str(data.get("query", "")).lower() != "id:ponos_game" or data.get("sort", {}).get("type") != "t":
        return []
    entries = data.get("timeline", {}).get("entry")
    if not isinstance(entries, list): return []
    found = set()
    for row in entries:
        if not isinstance(row, dict) or str(row.get("screenName", "")).lower() != "ponos_game": continue
        post_id = row.get("id")
        if not isinstance(post_id, str) or not _POST_ID.fullmatch(post_id): continue
        if not _official_url(row.get("userUrl"), "/ponos_game", query=True): continue
        if not _official_url(row.get("url"), "/ponos_game/status/" + post_id, query=True): continue
        found.add(post_id)
    return sorted(found, key=int, reverse=True)[:6]


def _read_provider(url, deadline, limit):
    parsed = urlsplit(url)
    if (parsed.scheme != "https" or parsed.username or parsed.password or parsed.port not in (None, 443)
            or (parsed.hostname, parsed.path) not in (("search.yahoo.co.jp", "/realtime/search"), ("publish.x.com", "/oembed"))):
        raise ValueError("provider not allowed")
    remaining = deadline - time.monotonic()
    if remaining <= 0: raise ValueError("provider deadline")
    request = Request(url, headers={"User-Agent": "Mozilla/5.0", "Accept-Encoding": "identity"})
    with build_opener(_NoRedirect()).open(request, timeout=min(4, remaining)) as response:
        if response.status != 200: raise ValueError("provider unavailable")
        chunks, size = [], 0
        while True:
            if time.monotonic() >= deadline: raise ValueError("provider deadline")
            chunk = response.read1(32768)
            if not chunk: break
            size += len(chunk)
            if size > limit: raise ValueError("provider too large")
            chunks.append(chunk)
    return b"".join(chunks).decode("utf-8")


def _fetch_post(post_id, deadline):
    try:
        params = {"url": SOURCE_URL + "/status/" + post_id, "omit_script": "true", "dnt": "true"}
        data = _read_provider("https://publish.x.com/oembed?" + urlencode(params), deadline, 1_000_000)
        return parse_post(json.loads(data), post_id)
    except Exception:
        return None


def get_x_posts():
    global _cached
    with _lock:
        if _cached and _cached[0] > time.monotonic(): return json.loads(json.dumps(_cached[1]))
        rows = []
        try:
            deadline = time.monotonic() + 12
            candidates = parse_discovery(_read_provider(DISCOVERY_URL, deadline, 2_000_000))
            with ThreadPoolExecutor(max_workers=3) as executor:
                for start in range(0, len(candidates), 3):
                    if len(rows) >= 3 or time.monotonic() >= deadline: break
                    rows.extend(row for row in executor.map(lambda post_id: _fetch_post(post_id, deadline), candidates[start:start + 3]) if row)
                rows = rows[:3]
        except Exception:
            pass
        result = {"status": "ok" if rows else "error", "items": rows,
                  "sourceUrl": SOURCE_URL, "selection": "recent", "discoveryUrl": DISCOVERY_URL,
                  "checkedAt": int(time.time())}
        _cached = (time.monotonic() + (600 if rows else 30), result)
        return json.loads(json.dumps(result))
