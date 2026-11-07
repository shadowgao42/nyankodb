"""Bounded HTTPS with OS TLS verification, no redirects and no retries."""
import http.client
import json
import os
from urllib.parse import urlsplit

def request(url, method='GET', payload=None, headers=None):
    u = urlsplit(url)
    if u.scheme != 'https' or u.username or u.port not in (None, 443):
        raise ValueError('HTTPS endpoint required')
    body = payload if isinstance(payload, bytes) else json.dumps(payload).encode() if payload is not None else b''
    h = {'Accept': 'application/json', 'Content-Type': 'application/json', **(headers or {})}
    if os.name == 'nt':
        from windows_transport import WindowsHTTPConnection
        conn = WindowsHTTPConnection(u.hostname, timeout=10)
    else:
        conn = http.client.HTTPSConnection(u.hostname, timeout=20)
    try:
        conn.connect()
        if hasattr(conn, 'sock') and conn.sock:
            conn.sock.settimeout(25)
        conn.request(method, u.path + ('?' + u.query if u.query else ''), body, h)
        response = conn.getresponse()
        data = bytearray()
        while len(data) <= 8 * 1024 * 1024:
            part = response.read1(65536)
            if not part:
                return response.status, bytes(data)
            data.extend(part)
        raise ValueError('Upstream response limit exceeded')
    finally:
        conn.close()
