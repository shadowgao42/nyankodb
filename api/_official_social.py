"""Small, fixed-source preview of the Japanese official shop's new arrivals."""
from html.parser import HTMLParser
import json
import re
import threading
import time
from urllib.parse import urljoin, urlsplit
from urllib.request import HTTPRedirectHandler, Request, build_opener

SOURCE_URL = "https://www.nyanko-daishoten.jp/"
_lock = threading.Lock()
_cached = None


def shop_url(value, image=False):
    if not isinstance(value, str) or len(value) > 4096 or re.search(r"[\x00-\x20\x7f\\]", value):
        return ""
    try:
        url = urljoin(SOURCE_URL, value)
        parsed = urlsplit(url)
        if (parsed.scheme != "https" or parsed.hostname != "www.nyanko-daishoten.jp"
                or parsed.username or parsed.password or parsed.port not in (None, 443)):
            return ""
        if image:
            if not re.fullmatch(r"/Contents/ProductImages/[A-Za-z0-9_./-]+\.(?:jpg|jpeg|png|webp)", parsed.path, re.I):
                return ""
            if ".." in parsed.path.split("/") or parsed.query or parsed.fragment:
                return ""
        elif parsed.path != "/Form/Product/ProductDetail.aspx":
            return ""
        return url
    except ValueError:
        return ""


class ShopParser(HTMLParser):
    """Read only the actual new-arrival section, not rankings or recommendations."""
    def __init__(self):
        super().__init__()
        self.section_depth = 0
        self.row = None
        self.capture = None
        self.parts = []
        self.rows = []

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == "section" and (self.section_depth or attrs.get("data-section-name") == "new-arrival"):
            self.section_depth += 1
        if not self.section_depth:
            return
        if self.capture and tag not in ("img", "br", "hr", "input", "source", "meta", "link"):
            self.capture[1] += 1
        if tag == "a":
            url = shop_url(attrs.get("href", ""))
            self.row = {"url": url, "title": "", "image": "", "price": ""} if url else None
        if not self.row:
            return
        if tag == "img" and attrs.get("id") == "imgProductImage":
            self.row["image"] = shop_url(attrs.get("src", ""), image=True)
        classes = attrs.get("class", "").split()
        field = "title" if "product__item--name" in classes else "price" if "product__item--price" in classes else None
        if field:
            self.capture = [field, 1]
            self.parts = []

    def handle_data(self, text):
        if self.capture:
            self.parts.append(text)

    def handle_endtag(self, tag):
        if self.capture:
            self.capture[1] -= 1
            if not self.capture[1]:
                if self.row:
                    self.row[self.capture[0]] = " ".join("".join(self.parts).split())[:500]
                self.capture = None
        if tag == "a" and self.row:
            if self.row["title"] and self.row["image"]:
                self.rows.append(self.row)
            self.row = None
            self.capture = None
        if tag == "section" and self.section_depth:
            self.section_depth -= 1

    def items(self):
        seen, rows = set(), []
        for row in self.rows:
            if row["url"] in seen:
                continue
            seen.add(row["url"])
            rows.append(row)
        return rows[:6]


class NoRedirect(HTTPRedirectHandler):
    def redirect_request(self, *args, **kwargs):
        raise ValueError("unexpected official shop redirect")


def get_shop_updates():
    global _cached
    with _lock:
        if _cached and _cached[0] > time.monotonic():
            return json.loads(json.dumps(_cached[1]))
        result = {"status": "error", "items": [], "sourceUrl": SOURCE_URL}
        try:
            request = Request(SOURCE_URL, headers={"User-Agent": "Mozilla/5.0", "Accept-Encoding": "identity"})
            started = time.monotonic()
            with build_opener(NoRedirect()).open(request, timeout=8) as response:
                if response.status != 200:
                    raise ValueError("official shop unavailable")
                chunks, size = [], 0
                while True:
                    if time.monotonic() - started > 12:
                        raise ValueError("official shop deadline")
                    chunk = response.read(65536)
                    if not chunk:
                        break
                    size += len(chunk)
                    if size > 2_000_000:
                        raise ValueError("official shop too large")
                    chunks.append(chunk)
            parser = ShopParser()
            parser.feed(b"".join(chunks).decode("utf-8"))
            rows = parser.items()
            if not rows:
                raise ValueError("official shop format unavailable")
            result.update(status="ok", items=rows)
        except Exception:
            pass
        _cached = (time.monotonic() + (600 if result["status"] == "ok" else 30), result)
        return json.loads(json.dumps(result))
