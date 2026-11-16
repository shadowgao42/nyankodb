"""Local search adapters, with optional server-only SerpApi Google credentials."""
from __future__ import annotations

from collections import OrderedDict, deque
from concurrent.futures import ThreadPoolExecutor
from html import unescape
from html.parser import HTMLParser
import ipaddress
import json
import os
from pathlib import Path
import re
import threading
import time
import unicodedata
from urllib.error import HTTPError
from urllib.parse import parse_qs, unquote, urlencode, urljoin, urlsplit
from urllib.request import HTTPRedirectHandler, Request, build_opener

MAX_QUERY = 200
MAX_BYTES = 4_000_000
TIMEOUT = 8
RESULT_LIMITS = {"web": 20, "images": 8, "videos": 8}
COLLECTION_LIMIT = 80
PROVIDERS = {"web": "DuckDuckGo", "images": "NAVER", "videos": "YouTube"}
_HOSTS = {"html.duckduckgo.com", "search.naver.com", "s.search.naver.com", "www.youtube.com", "serpapi.com"}
_DC_HOST = "gall.dcinside.com"
_DC_ID = "yavetwarch"
_DC_BUDGET = 1.5
_cache: OrderedDict = OrderedDict()
_lock = threading.Lock()
_slots = threading.BoundedSemaphore(4)
_requests = deque()
_inflight = {}
BLOCKED_WORDS = ("배열", "핵", "에딧", "에디터", "버그판", "seed", "rolls", "mod")
BLOCKED_MESSAGE = "이용약관 위반 가능성이 있어 제한된 검색입니다."
# Same whitespace characters as JavaScript /\s/u; do not remove punctuation.
_QUERY_WHITESPACE = re.compile(r"[\u0009-\u000d\u0020\u00a0\u1680\u2000-\u200a\u2028\u2029\u202f\u205f\u3000\ufeff]+")


def restricted_query(query):
    normalized = _QUERY_WHITESPACE.sub("", unicodedata.normalize("NFC", query)).lower()
    return any(word in normalized for word in BLOCKED_WORDS)


def restricted_result(item):
    # Match each displayed field independently, including the decoded destination.
    # Opaque thumbnail/original asset keys are not searchable result text.
    return any(restricted_query(str(item.get(field) or ""))
               for field in ("title", "description", "source")) or restricted_query(unquote(str(item.get("url") or "")))


class ProviderError(Exception):
    pass


def _serpapi_key():
    value = os.environ.get("SERPAPI_API_KEY", "").strip()
    if value: return value
    try:
        data = json.loads((Path.home() / ".nyankodb-private" / "serpapi.json").read_text(encoding="utf-8-sig"))
        value = data.get("api_key") if isinstance(data, dict) else None
        return value.strip() if isinstance(value, str) else ""
    except (OSError, ValueError):
        return ""


def safe_url(value, *, image=False):
    """Accept public HTTP(S) destinations, never credentials/local/IP or executable URLs."""
    if not isinstance(value, str) or len(value) > 4096 or re.search(r"[\x00-\x20\x7f\\]", value):
        return ""
    try:
        parsed = urlsplit(value)
        host = (parsed.hostname or "").lower().rstrip(".")
        if parsed.scheme not in (("https",) if image else ("http", "https")):
            return ""
        if not host or parsed.username or parsed.password or parsed.port not in (None, 80, 443):
            return ""
        if (host == "localhost" or "." not in host or host.endswith((".local", ".localhost", ".internal"))
                or re.fullmatch(r"(?:0x[0-9a-f]+|[0-9]+)(?:\.(?:0x[0-9a-f]+|[0-9]+))*", host)):
            return ""
        try:
            ipaddress.ip_address(host)
            return ""
        except ValueError:
            pass
        if not re.fullmatch(r"[a-z0-9.-]+", host):
            return ""
        if image and not (host in ("search.pstatic.net", "i.ytimg.com")
                          or re.fullmatch(r"encrypted-(?:tbn|vtbn)[0-9]+\.gstatic\.com", host)
                          or (host == "serpapi.com" and parsed.path.startswith("/searches/")
                              and "/images/" in parsed.path and not parsed.query)):
            return ""
        return value
    except (ValueError, TypeError):
        return ""


def original_image_url(value):
    """Try the provider's original over HTTPS; the browser falls back on failure."""
    value = safe_url(value)
    if not value or "api_key" in parse_qs(urlsplit(value).query): return ""
    # Preserve host/path/query; never proxy images or guess a different image host.
    if value.startswith("http://"): value = "https://" + value[len("http://"):]
    return value if urlsplit(value).scheme == "https" else ""


class _Text(HTMLParser):
    def __init__(self): super().__init__(); self.parts = []
    def handle_data(self, value): self.parts.append(value)


def clean_text(value, limit=500):
    parser = _Text()
    parser.feed(str(value or ""))
    return re.sub(r"\s+", " ", "".join(parser.parts)).strip()[:limit]


class WebParser(HTMLParser):
    def __init__(self):
        super().__init__(); self.rows = []; self.capture = None; self.parts = []; self.row = None

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        classes = attrs.get("class", "").split()
        if tag == "a" and "result__a" in classes:
            href = attrs.get("href", "")
            if href.startswith("//"): href = "https:" + href
            parsed = urlsplit(href)
            if parsed.hostname in ("duckduckgo.com", "html.duckduckgo.com"):
                href = parse_qs(parsed.query).get("uddg", [""])[0]
            self.row = {"url": safe_url(href), "title": "", "description": ""}
            self.rows.append(self.row)
            self.capture = "title"; self.parts = []
        elif tag in ("a", "div") and "result__snippet" in classes and self.row is not None:
            self.capture = "description"; self.parts = []

    def handle_data(self, value):
        if self.capture: self.parts.append(value)

    def handle_endtag(self, tag):
        if self.capture and tag in ("a", "div"):
            self.row[self.capture] = clean_text("".join(self.parts))
            self.capture = None


def _image_identity(row):
    if row.get("original"): return row["original"]
    thumbnail = row.get("thumbnail", "")
    parsed = urlsplit(thumbnail)
    if parsed.hostname == "search.pstatic.net":
        original = original_image_url(parse_qs(parsed.query).get("src", [""])[0])
        if original: return original
    return thumbnail


def _unique(rows, limit, *, images=False):
    output = []; seen = set()
    for row in rows:
        if not row.get("url") or not row.get("title"): continue
        identity = (row["url"], _image_identity(row)) if images else row.get("videoId") or row["url"]
        if identity in seen: continue
        if (urlsplit(row["url"]).hostname or "").lower() in ("nyanko.wiki", "www.nyanko.wiki"): continue
        seen.add(identity); output.append(row)
        if len(output) >= limit: break
    return output


def parse_web(html):
    parser = WebParser(); parser.feed(html)
    if not parser.rows and not re.search(r"no-results|No results found", html, re.I):
        raise ProviderError("web_markup_unavailable")
    for row in parser.rows:
        row["source"] = urlsplit(row["url"]).hostname or ""
    return _unique(parser.rows, COLLECTION_LIMIT)


def _dc_post_url(value):
    value = safe_url(value)
    if not value: return ""
    parsed = urlsplit(value)
    params = parse_qs(parsed.query)
    if (parsed.hostname != _DC_HOST or parsed.path != "/mgallery/board/view/"
            or params.get("id") != [_DC_ID] or len(params.get("no", [])) != 1
            or not re.fullmatch(r"[0-9]{1,12}", params["no"][0])):
        return ""
    return "https://" + _DC_HOST + "/mgallery/board/view/?" + urlencode({"id": _DC_ID, "no": str(int(params["no"][0]))})


def _dc_search_url(value, expected_query):
    value = safe_url(value)
    if not value: return ""
    parsed = urlsplit(value); params = parse_qs(parsed.query)
    if (parsed.scheme != "https" or parsed.hostname != _DC_HOST
            or parsed.path != "/mgallery/board/lists/" or parsed.fragment
            or set(params) != {"id", "s_type", "s_keyword"}
            or params != {"id": [_DC_ID], "s_type": ["search_subject_memo"], "s_keyword": [expected_query]}):
        return ""
    return value


class DCGalleryParser(HTMLParser):
    """Only normal posts in the fixed gallery; never writer, ad, or reply anchors."""
    def __init__(self):
        super().__init__(); self.rows = []; self.row = None; self.cell = ""; self.capture = False; self.parts = []; self.has_list = False

    def handle_starttag(self, tag, attrs):
        a = dict(attrs); classes = a.get("class", "").split()
        if tag == "div" and "gall_listwrap" in classes: self.has_list = True
        if tag == "tr":
            self.row = {"no": a.get("data-no"), "title": "", "url": "", "description": "", "source": "디시인사이드 · 냥코 갤러리"} if "us-post" in classes else None
        if self.row is None: return
        if tag == "td":
            self.cell = "title" if "gall_tit" in classes else ""
            if "gall_date" in classes:
                date = a.get("title", "")
                if re.fullmatch(r"[0-9]{4}-[0-9]{2}-[0-9]{2} [0-9]{2}:[0-9]{2}:[0-9]{2}", date): self.row["description"] = date
        if tag == "a" and self.cell == "title" and not self.row["url"] and "reply_numbox" not in classes:
            url = _dc_post_url(urljoin("https://" + _DC_HOST, a.get("href", "")))
            if url and parse_qs(urlsplit(url).query)["no"] == [self.row["no"]]:
                self.row["url"] = url; self.capture = True; self.parts = []

    def handle_data(self, text):
        if self.capture: self.parts.append(text)

    def handle_endtag(self, tag):
        if tag == "a" and self.capture:
            self.row["title"] = clean_text("".join(self.parts)); self.capture = False
        if tag == "td": self.cell = ""
        if tag == "tr":
            if self.row and self.row["url"] and self.row["title"]:
                self.row.pop("no"); self.rows.append(self.row)
            self.row = None; self.capture = False


def fetch_dc_gallery(query):
    url = "https://" + _DC_HOST + "/mgallery/board/lists/?" + urlencode({"id": _DC_ID, "s_type": "search_subject_memo", "s_keyword": query})
    parser = DCGalleryParser()
    parser.feed(fetch_provider(url, timeout=2, read_budget=2))
    if not parser.has_list: raise ProviderError("gallery_markup_unavailable")
    return _unique(parser.rows, 20)


def _web_relevance(query, row):
    def terms(text):
        return re.findall(r"[^\W_]+", unicodedata.normalize("NFC", str(text or "")).casefold())

    query_terms = list(dict.fromkeys(terms(query)))
    phrase = "".join(terms(query))
    title = "".join(terms(row.get("title")))
    description = "".join(terms(row.get("description")))
    title_matches = {term for term in query_terms if term in title}
    description_matches = {term for term in query_terms if term in description}
    # Compare the same visible fields for every source. Never boost the gallery
    # label, URL, timestamp recency, or an invented/remote relevance score.
    return (len(title_matches | description_matches), bool(phrase and phrase in title),
            len(title_matches), bool(phrase and phrase in description), len(description_matches))


def _merge_web(portal, gallery, query):
    # Stable sorting keeps supplier order for equal visible-field relevance.
    rows = sorted(list(portal) + list(gallery), key=lambda row: _web_relevance(query, row), reverse=True)
    seen = set(); output = []
    for row in rows:
        if not game_related(row) or restricted_result(row): continue
        identity = _web_identity(row.get("url", ""))
        if not identity or identity in seen: continue
        seen.add(identity); output.append(row)
        if len(output) >= COLLECTION_LIMIT: break
    return output


def _web_identity(value):
    canonical = _dc_post_url(value)
    if canonical: return canonical
    safe = safe_url(value)
    if not safe: return ""
    parsed = urlsplit(safe); params = parse_qs(parsed.query)
    number = ""
    if parsed.hostname == "m.dcinside.com":
        match = re.fullmatch(r"/board/" + _DC_ID + r"/([0-9]{1,12})/?", parsed.path)
        if match: number = match[1]
    elif parsed.hostname == _DC_HOST and parsed.path == "/board/view/" and params.get("id") == [_DC_ID]:
        values = params.get("no", [])
        if len(values) == 1 and re.fullmatch(r"[0-9]{1,12}", values[0]): number = values[0]
    if number:
        return "https://" + _DC_HOST + "/mgallery/board/view/?" + urlencode({"id": _DC_ID, "no": str(int(number))})
    return safe


def fetch_web_collection(query, api_key):
    started = time.monotonic(); gallery = None; pool = None; portal = []; succeeded = False
    if _reserve_request():
        pool = ThreadPoolExecutor(max_workers=1)
        gallery = pool.submit(fetch_dc_gallery, query)
    try:
        try:
            portal = fetch_google_api(query, "web", api_key) if api_key else parse_web(fetch_provider(
                "https://html.duckduckgo.com/html/?" + urlencode({"q": context_query(query), "kl": "kr-kr"})))
            succeeded = True
        except Exception:
            pass
        posts = []
        if gallery is not None:
            try:
                posts = gallery.result(timeout=max(0, _DC_BUDGET - (time.monotonic() - started))); succeeded = True
            except Exception:
                gallery.cancel()
        if not succeeded: raise ProviderError("web_providers_unavailable")
        return _merge_web(portal, posts, query)
    finally:
        if pool is not None: pool.shutdown(wait=False, cancel_futures=True)


def _naver_image_data(html):
    marker = re.search(r"(?:var\s+)?imageSearchTabData\s*=", html)
    if not marker: raise ProviderError("image_markup_unavailable")
    content = html.find("content:", marker.end())
    marker = re.search(r"\bitems\s*:\s*", html[content:]) if content >= 0 else None
    if not marker: raise ProviderError("image_items_unavailable")
    try:
        rows, _ = json.JSONDecoder().raw_decode(html[content + marker.end():])
    except (ValueError, TypeError) as exc:
        raise ProviderError("image_json_invalid") from exc
    if not isinstance(rows, list): raise ProviderError("image_shape_invalid")
    prefix = html[content:content + marker.start()]
    next_match = re.search(r'\burl\s*:\s*("(?:[^"\\]|\\.)*")', prefix)
    try: next_url = json.loads(next_match[1]) if next_match else ""
    except ValueError: next_url = ""
    return rows, next_url


def _image_rows(rows):
    output = []
    for item in rows:
        if not isinstance(item, dict) or item.get("type") != "image": continue
        thumbnail = safe_url(item.get("thumb332") or item.get("thumb280"), image=True)
        url = safe_url(item.get("link"))
        if thumbnail and url:
            output.append({"title": clean_text(item.get("title")), "url": url,
                           "source": clean_text(item.get("writerTitle")) or urlsplit(url).hostname, "thumbnail": thumbnail,
                           "original": original_image_url(item.get("originalUrl"))})
    return output


def parse_images(html):
    rows, _ = _naver_image_data(html)
    return _unique(_image_rows(rows), COLLECTION_LIMIT, images=True)


def _naver_more_url(value, expected_query):
    if (not isinstance(expected_query, str) or not 1 <= len(expected_query) <= MAX_QUERY + 20
            or re.search(r"[\x00-\x1f\x7f]", expected_query)):
        return ""
    value = safe_url(value)
    if not value: return ""
    parsed = urlsplit(value)
    if (parsed.scheme != "https" or parsed.hostname != "s.search.naver.com" or parsed.fragment
            or not re.fullmatch(r"/p/c/image/[0-9]+/search\.naver", parsed.path)):
        return ""
    params = parse_qs(parsed.query, keep_blank_values=True)
    allowed = {"ac", "api_type", "aq", "display", "logStart", "mode", "nqx_theme", "nso", "nx_search_query",
               "qdt", "query", "section", "sm", "ssc", "start", "where"}
    if set(params) - allowed or any(len(values) != 1 for values in params.values()): return ""
    one = {key: values[0] for key, values in params.items()}
    if (one.get("query") != expected_query or one.get("nx_search_query") != expected_query
            or one.get("api_type") != "pc_tab_more" or one.get("where") != "image"
            or one.get("section", "image") != "image"):
        return ""
    for field, maximum in (("start", 160), ("display", 100)):
        if not re.fullmatch(r"[0-9]{1,3}", one.get(field, "")) or not 1 <= int(one[field]) <= maximum: return ""
    if "logStart" in one and one["logStart"] != one["start"]: return ""
    return value


def _reserve_request():
    now = time.monotonic()
    with _lock:
        while _requests and _requests[0] < now - 60: _requests.popleft()
        if len(_requests) >= 30: return False
        _requests.append(now)
    return True


def fetch_naver_images(query):
    started = time.monotonic()
    scoped = context_query(query)
    html = fetch_provider("https://search.naver.com/search.naver?" + urlencode({"where": "image", "query": scoped}))
    rows, next_url = _naver_image_data(html)
    items = _unique(_image_rows(rows), COLLECTION_LIMIT, images=True)
    next_url = _naver_more_url(next_url, scoped)
    # A single bounded continuation matches native initial scrolling without crawling the feed.
    if next_url and len(items) < COLLECTION_LIMIT and time.monotonic() - started <= 10 and _reserve_request():
        try:
            data = json.loads(fetch_provider(next_url, timeout=4, read_budget=4))
            if isinstance(data, dict) and isinstance(data.get("items"), list):
                items = _unique(items + _image_rows(data["items"][:100]), COLLECTION_LIMIT, images=True)
        except Exception:
            pass  # Keep the valid initial response when optional scrolling fails.
    return items


def _youtube_text(value):
    if not isinstance(value, dict): return ""
    runs = value.get("runs", [])
    if not isinstance(runs, list): runs = []
    return clean_text(value.get("simpleText") or "".join(str(x.get("text", "")) for x in runs if isinstance(x, dict)))


def _video_description(item):
    snippets = [_youtube_text(item.get("descriptionSnippet"))]
    detailed = item.get("detailedMetadataSnippets", [])
    if isinstance(detailed, list):
        snippets.extend(_youtube_text(value.get("snippetText")) for value in detailed if isinstance(value, dict))
    return " ".join(dict.fromkeys(value for value in snippets if value))[:500]


def _nested(value, *keys):
    for key in keys:
        if not isinstance(value, dict): return None
        value = value.get(key)
    return value


def _shorts_video(item):
    if not isinstance(item, dict): return None
    command = _nested(item, "onTap", "innertubeCommand")
    video_id = _nested(command, "reelWatchEndpoint", "videoId")
    if not isinstance(video_id, str) or not re.fullmatch(r"[A-Za-z0-9_-]{11}", video_id): return None
    path = _nested(command, "commandMetadata", "webCommandMetadata", "url")
    if not isinstance(path, str) or not path.startswith("/shorts/") or re.search(r"[\x00-\x20\x7f\\]", path): return None
    parsed = urlsplit(path)
    if parsed.scheme or parsed.netloc or parsed.fragment or parsed.path != "/shorts/" + video_id: return None
    title = clean_text(_nested(item, "overlayMetadata", "primaryText", "content"))
    sources = _nested(item, "thumbnailViewModel", "thumbnailViewModel", "image", "sources")
    if not isinstance(sources, list): return None
    thumbnail = next((safe_url(value.get("url"), image=True) for value in sources
                      if isinstance(value, dict) and safe_url(value.get("url"), image=True)), "")
    if not title or not thumbnail: return None
    return {"title": title, "url": "https://www.youtube.com/shorts/" + video_id,
            "source": "YouTube", "thumbnail": thumbnail, "videoId": video_id,
            "description": clean_text(item.get("accessibilityText"))}


def parse_videos(html):
    marker = re.search(r"(?:var\s+)?ytInitialData\s*=\s*", html)
    if not marker: raise ProviderError("video_markup_unavailable")
    try: data, _ = json.JSONDecoder().raw_decode(html[marker.end():])
    except ValueError as exc: raise ProviderError("video_json_invalid") from exc
    rows = []

    def walk(value, depth=0):
        if depth > 60 or len(rows) >= COLLECTION_LIMIT: return
        if isinstance(value, dict):
            if "videoRenderer" in value:
                item = value["videoRenderer"]
                video_id = item.get("videoId", "")
                if not re.fullmatch(r"[A-Za-z0-9_-]{11}", str(video_id)): return
                thumbnails = item.get("thumbnail", {}).get("thumbnails", [])
                thumbnail = next((safe_url(x.get("url"), image=True) for x in thumbnails if safe_url(x.get("url"), image=True)), "")
                if not thumbnail: return
                channel = _youtube_text(item.get("ownerText"))
                rows.append({"title": _youtube_text(item.get("title")),
                             "url": "https://www.youtube.com/watch?v=" + video_id,
                             "source": (channel + " · " if channel else "") + "YouTube",
                             "thumbnail": thumbnail, "videoId": video_id,
                             "description": _video_description(item),
                             "duration": _youtube_text(item.get("lengthText"))})
            elif "shortsLockupViewModel" in value:
                row = _shorts_video(value["shortsLockupViewModel"])
                if row: rows.append(row)
            else:
                for child in value.values(): walk(child, depth + 1)
        elif isinstance(value, list):
            for child in value: walk(child, depth + 1)

    # Search results only: skip unrelated sidebar/recommendation trees.
    contents = data.get("contents", {}).get("twoColumnSearchResultsRenderer", {}).get("primaryContents")
    if not isinstance(contents, dict): raise ProviderError("video_results_unavailable")
    walk(contents)
    if not rows and not re.search(r"검색결과가 없습니다|검색 결과가 없습니다|No results found", json.dumps(contents, ensure_ascii=False), re.I):
        raise ProviderError("video_rows_unavailable")
    return _unique(rows, COLLECTION_LIMIT)


class _FixedRedirect(HTTPRedirectHandler):
    def redirect_request(self, request, fp, code, msg, headers, newurl):
        # API credentials must never follow redirects, including same-host ones.
        if urlsplit(request.full_url).hostname == "serpapi.com":
            raise ProviderError("api_redirect_blocked")
        origin = urlsplit(request.full_url)
        if origin.hostname == _DC_HOST:
            expected = parse_qs(origin.query).get("s_keyword", [""])[0]
            if not _dc_search_url(newurl, expected): raise ProviderError("provider_redirect_blocked")
            return super().redirect_request(request, fp, code, msg, headers, newurl)
        if urlsplit(newurl).hostname == _DC_HOST: raise ProviderError("provider_redirect_blocked")
        if origin.hostname == "s.search.naver.com":
            expected = parse_qs(origin.query).get("query", [""])[0]
            if not _naver_more_url(newurl, expected): raise ProviderError("provider_redirect_blocked")
        elif urlsplit(newurl).hostname == "s.search.naver.com":
            raise ProviderError("provider_redirect_blocked")
        if urlsplit(newurl).scheme != "https" or urlsplit(newurl).hostname not in _HOSTS:
            raise ProviderError("provider_redirect_blocked")
        return super().redirect_request(request, fp, code, msg, headers, newurl)


def fetch_provider(url, *, timeout=TIMEOUT, read_budget=15):
    host = urlsplit(url).hostname
    if host == _DC_HOST:
        expected = parse_qs(urlsplit(url).query).get("s_keyword", [""])[0]
        if not expected or not _dc_search_url(url, expected): raise ProviderError("provider_not_allowed")
    elif urlsplit(url).scheme != "https" or host not in _HOSTS:
        raise ProviderError("provider_not_allowed")
    if urlsplit(url).hostname == "s.search.naver.com":
        expected = parse_qs(urlsplit(url).query).get("query", [""])[0]
        if not _naver_more_url(url, expected): raise ProviderError("provider_not_allowed")
    request = Request(url, headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/131.0.0.0 Safari/537.36",
                                    "Accept-Language": "ko-KR,ko;q=0.9", "Accept-Encoding": "identity"})
    started = time.monotonic()
    with build_opener(_FixedRedirect()).open(request, timeout=timeout) as response:
        if response.status != 200: raise ProviderError("provider_status")
        length = response.headers.get("Content-Length")
        if length and int(length) > MAX_BYTES: raise ProviderError("provider_too_large")
        chunks = []; size = 0
        while True:
            if time.monotonic() - started > read_budget: raise ProviderError("provider_deadline")
            chunk = response.read(64 * 1024)
            if not chunk: break
            size += len(chunk)
            if size > MAX_BYTES: raise ProviderError("provider_too_large")
            chunks.append(chunk)
    html = b"".join(chunks).decode("utf-8", "replace")
    if re.search(r"anomaly-modal|g-recaptcha|unusual traffic|보안 확인을 완료", html, re.I):
        raise ProviderError("provider_challenge")
    return html


def validate_query(query):
    if not isinstance(query, str): raise ValueError("invalid_query")
    query = query.strip()
    if not query or len(query) > MAX_QUERY or re.search(r"[\x00-\x1f\x7f]", query):
        raise ValueError("invalid_query")
    return query


def parse_google_api(data, kind):
    """Only emit display fields; SerpApi metadata and credential-bearing URLs stay server-side."""
    if not isinstance(data, dict) or data.get("error"):
        raise ProviderError("google_api_unavailable")
    field = {"web": "organic_results", "images": "images_results", "videos": "video_results"}[kind]
    rows = data.get(field)
    if rows is None and data.get("search_metadata", {}).get("status") == "Success":
        return []
    if not isinstance(rows, list): raise ProviderError("google_api_shape_invalid")
    output = []
    for item in rows:
        if not isinstance(item, dict): continue
        url = safe_url(item.get("link"))
        if not url or "api_key" in parse_qs(urlsplit(url).query): continue
        row = {"url": url, "title": clean_text(item.get("title")),
               "source": clean_text(item.get("source") or urlsplit(url).hostname),
               "description": clean_text(item.get("snippet"))}
        if kind != "web":
            row["thumbnail"] = safe_url(item.get("thumbnail"), image=True)
            if not row["thumbnail"]: continue
        if kind == "images":
            row["original"] = original_image_url(item.get("original"))
        if kind == "videos":
            parsed = urlsplit(url)
            video_id = ""
            if parsed.hostname in ("youtube.com", "www.youtube.com", "m.youtube.com"):
                video_id = parse_qs(parsed.query).get("v", [""])[0] if parsed.path == "/watch" else parsed.path.rsplit("/", 1)[-1]
            elif parsed.hostname == "youtu.be": video_id = parsed.path.strip("/")
            if re.fullmatch(r"[A-Za-z0-9_-]{11}", video_id): row["videoId"] = video_id
            row["duration"] = clean_text(item.get("duration") or item.get("length"), 40)
        output.append(row)
    return _unique(output, COLLECTION_LIMIT, images=kind == "images")


def fetch_google_api(query, kind, api_key):
    params = {"engine": {"web": "google", "images": "google_images", "videos": "google_videos"}[kind],
              "q": context_query(query), "hl": "ko", "gl": "kr", "api_key": api_key}
    # Use one provider response per cache entry, like the public adapters. Do not
    # prefetch provider continuation pages or silently spend additional credits.
    data = json.loads(fetch_provider("https://serpapi.com/search.json?" + urlencode(params)))
    return parse_google_api(data, kind)


def _search_collection(query, kind):
    query = validate_query(query)
    if kind not in PROVIDERS: raise ValueError("invalid_kind")
    if restricted_query(query):
        return {"query": query, "kind": kind, "provider": "", "status": "blocked",
                "message": BLOCKED_MESSAGE, "items": [], "pageCount": 0,
                "itemCount": 0, "hasNext": False}
    api_key = _serpapi_key()
    provider = "Google · SerpApi" if api_key else PROVIDERS[kind]
    if kind == "web": provider += " · 디시인사이드 냥코 갤러리"
    key = (query, kind, provider); now = time.monotonic()
    with _lock:
        cached = _cache.get(key)
        if cached and cached[0] > now:
            _cache.move_to_end(key)
            return json.loads(json.dumps(cached[1], ensure_ascii=False))
        event = _inflight.get(key)
        if event is None:
            event = threading.Event(); _inflight[key] = event; owner = True
        else: owner = False
    if not owner:
        if event.wait(20): return _search_collection(query, kind)
        return {"query": query, "kind": kind, "provider": provider, "status": "error", "items": [], "error": "busy"}
    result = {"query": query, "kind": kind, "provider": provider, "status": "error", "items": []}
    acquired = False
    try:
        if not _reserve_request(): raise ProviderError("rate_limited")
        acquired = _slots.acquire(timeout=1)
        if not acquired: raise ProviderError("busy")
        if kind == "web":
            raw_items = fetch_web_collection(query, api_key)
        elif api_key:
            raw_items = fetch_google_api(query, kind, api_key)
        elif kind == "images":
            raw_items = fetch_naver_images(query)
        else:
            url = "https://www.youtube.com/results?" + urlencode({"search_query": context_query(query), "hl": "ko", "gl": "KR"})
            parser = parse_videos
        if not api_key and kind == "videos": raw_items = parser(fetch_provider(url))
        items = [item for item in raw_items if game_related(item) and not restricted_result(item)]
        result.update(status="ok" if items else "empty", items=items)
    except Exception:
        # Provider bodies/URLs and exception details never leak to the browser.
        result["error"] = "provider_unavailable"
    finally:
        if acquired: _slots.release()
        with _lock:
            _cache[key] = (time.monotonic() + (30 if result["status"] == "error" else 600), result)
            _cache.move_to_end(key)
            while len(_cache) > 128: _cache.popitem(last=False)
            _inflight.pop(key, None); event.set()
    return json.loads(json.dumps(result, ensure_ascii=False))



_GAME_CONTEXT = re.compile(r"냥코|にゃんこ|battle\s*cats|battlecats|nyanko", re.I)


def context_query(query):
    """Scope external ambiguity to the game without changing the user's DB query."""
    return query if _GAME_CONTEXT.search(query) else "냥코 대전쟁 " + query


def game_related(item):
    # A game mention in title/snippet or a game-specific source path is evidence;
    # names such as Sakura alone are not. Keep the supplier's relative order.
    evidence = " ".join(str(item.get(key, "")) for key in ("title", "description", "url", "source"))
    from urllib.parse import unquote
    return bool(_GAME_CONTEXT.search(unquote(evidence)))


def search_section(query, kind, page=1):
    if isinstance(page, bool) or not isinstance(page, int) or not 1 <= page <= 100:
        raise ValueError("invalid_page")
    result = _search_collection(query, kind)
    if result["status"] == "blocked":
        result.update(page=page, searchQuery=result["query"])
        return result
    items = result["items"]
    size = RESULT_LIMITS[kind]
    offset = (page - 1) * size
    result.update(page=page, searchQuery=context_query(result["query"]),
                  hasNext=len(items) > offset + size, items=items[offset:offset + size])
    if result["status"] != "error":
        result.update(itemCount=len(items), pageCount=max(1, (len(items) + size - 1) // size))
    if result["status"] != "error": result["status"] = "ok" if result["items"] else "empty"
    return result


def search_all(query, page=1):
    query = validate_query(query)
    with ThreadPoolExecutor(max_workers=3) as executor:
        futures = {kind: executor.submit(search_section, query, kind, page) for kind in PROVIDERS}
        return {"query": query, "sections": {kind: future.result() for kind, future in futures.items()}}
