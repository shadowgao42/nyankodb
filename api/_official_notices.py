"""Fixed-source official notice metadata for the local homepage preview."""
from html.parser import HTMLParser
from collections import OrderedDict
import json
import threading
import time
from urllib.parse import parse_qs, urljoin, urlsplit
from urllib.request import Request, HTTPRedirectHandler, build_opener

NOTICE_URL = 'https://nyanko-announcement.ponosgames.com/v1/notices?platform=google&clientVersion=100300&countryCode=ko&clearedStageJapan=100&clearedStageFuture=100&clearedUniverse=100&timeDifference=700'
_lock = threading.Lock()
_cached = None
_titles = OrderedDict()


def official_url(value, image=False):
    if not isinstance(value, str): return ''
    url = urljoin(NOTICE_URL, value)
    parsed = urlsplit(url)
    host = 'nyanko-webview.ponosgames.com' if image else 'nyanko-announcement.ponosgames.com'
    prefix = '/information/img/battlecats/slider/large/kr/' if image else '/v1/notices/'
    if (parsed.scheme != 'https' or parsed.hostname != host or parsed.username or parsed.password
            or parsed.port not in (None, 443) or not parsed.path.startswith(prefix)):
        return ''
    return url


class NoticeParser(HTMLParser):
    def __init__(self):
        super().__init__(); self.anchor = ''; self.title = None; self.titles = {}; self.images = []; self.slider_depth = 0

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == 'ul' and (self.slider_depth or 'slide_box' in attrs.get('class', '').split()): self.slider_depth += 1
        if tag == 'a': self.anchor = official_url(attrs.get('href', ''))
        if tag == 'img' and self.anchor and self.slider_depth:
            image = official_url(attrs.get('src', ''), True)
            if image: self.images.append((self.anchor, image))
        if tag == 'p' and 'newstitle' in attrs.get('class', '').split(): self.title = []

    def handle_data(self, text):
        if self.title is not None: self.title.append(text)

    def handle_endtag(self, tag):
        if tag == 'ul' and self.slider_depth: self.slider_depth -= 1
        if tag == 'p' and self.title is not None:
            if self.anchor: self.titles[urlsplit(self.anchor).path] = ' '.join(''.join(self.title).split())[:500]
            self.title = None
        if tag == 'a': self.anchor = ''

    def items(self):
        rows = []
        for url, image in self.images:
            rows.append({'url': url, 'image': image, 'title': self.titles.get(urlsplit(url).path, '')})
        return rows


class DetailTitle(HTMLParser):
    def __init__(self): super().__init__(); self.active = False; self.parts = []
    def handle_starttag(self, tag, attrs):
        if tag == 'h1': self.active = True
    def handle_endtag(self, tag):
        if tag == 'h1': self.active = False
    def handle_data(self, text):
        if self.active: self.parts.append(text)


def enrich_titles(rows, deadline):
    # Missing titles must never remove a banner. Cache text separately from 30s image URLs.
    for row in rows:
        if row['title']: continue
        key = urlsplit(row['url']).path
        cached = _titles.get(key)
        if cached and cached[0] > time.monotonic():
            row['title'] = cached[1]
            continue
        title = ''
        remaining = deadline - time.monotonic()
        if remaining > 0:
            try:
                request = Request(row['url'], headers={'User-Agent': 'Mozilla/5.0', 'Accept-Encoding': 'identity'})
                with build_opener(NoRedirect()).open(request, timeout=min(2, remaining)) as response:
                    if response.status != 200: raise ValueError('detail unavailable')
                    chunks = []; size = 0
                    while True:
                        if time.monotonic() >= deadline: raise ValueError('detail deadline')
                        chunk = response.read(65536)
                        if not chunk: break
                        size += len(chunk)
                        if size > 256_000: raise ValueError('detail too large')
                        chunks.append(chunk)
                    raw = b''.join(chunks)
                parser = DetailTitle(); parser.feed(raw.decode('utf-8'))
                title = ' '.join(''.join(parser.parts).split())[:500]
            except Exception:
                pass
        row['title'] = title or '공식 공지'
        _titles[key] = (time.monotonic() + (21600 if title else 60), row['title'])
        _titles.move_to_end(key)
        while len(_titles) > 256: _titles.popitem(last=False)


class NoRedirect(HTTPRedirectHandler):
    def redirect_request(self, *args, **kwargs):
        raise ValueError('unexpected official source redirect')


def get_notices():
    global _cached
    with _lock:
        if _cached and _cached[0] > time.monotonic(): return json.loads(json.dumps(_cached[1]))
        try:
            request = Request(NOTICE_URL, headers={'User-Agent': 'Mozilla/5.0', 'Accept-Encoding': 'identity'})
            started = time.monotonic()
            with build_opener(NoRedirect()).open(request, timeout=8) as response:
                if response.status != 200: raise ValueError('official source unavailable')
                chunks = []; size = 0
                while True:
                    if time.monotonic() - started > 12: raise ValueError('official source deadline')
                    chunk = response.read(65536)
                    if not chunk: break
                    size += len(chunk)
                    if size > 4_000_000: raise ValueError('official source too large')
                    chunks.append(chunk)
            parser = NoticeParser(); parser.feed(b''.join(chunks).decode('utf-8'))
            rows = parser.items()
            if not rows: raise ValueError('official source format unavailable')
            enrich_titles(rows, min(started + 12, time.monotonic() + 6))
            expires = min(int(parse_qs(urlsplit(row['image']).query)['Expires'][0]) for row in rows)
            if expires <= time.time() + 5: raise ValueError('official image signature expired')
            result = {'status': 'ok', 'items': rows, 'expiresAt': expires}
        except Exception:
            result = {'status': 'error', 'items': []}
        ttl = max(0, min(300, result['expiresAt'] - time.time() - 5)) if result['status'] == 'ok' else 30
        _cached = (time.monotonic() + ttl, result)
        return json.loads(json.dumps(result))
