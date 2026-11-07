"""Single-request KR transfer reception and lossless body inspection.

Protocol fields come from the user's KR 15.7 APK investigation. This module
does not import or execute third-party save editors or modify a save file.
"""
from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime, timezone
import gzip
import hashlib
import http.client
import io
import json
import re
import secrets
import ssl
import time
from urllib.parse import quote

HOST = "nyanko-save.ponosgames.com"
COUNTRY = "kr"
MAX_BYTES = 64 * 1024 * 1024
PAGE_BYTES = 4096
TIMEOUT_SECONDS = 90
CONNECT_TIMEOUT_SECONDS = 15


@dataclass(frozen=True)
class TransferInput:
    code: str
    pin: str
    version: str = "15.7.0"

    def validated(self) -> "TransferInput":
        code, pin, version = self.code.strip(), self.pin.strip(), self.version.strip()
        if not re.fullmatch(r"[A-Za-z0-9_-]{1,128}", code):
            raise ValueError("이어하기 코드는 영문·숫자·하이픈·밑줄로 입력해 주세요.")
        if not re.fullmatch(r"[0-9]{1,32}", pin):
            raise ValueError("인증번호는 숫자로 입력해 주세요. 앞의 0도 그대로 입력합니다.")
        version_number(version)
        return TransferInput(code, pin, version)


def version_number(version: str) -> int:
    match = re.fullmatch(r"([0-9]{1,2})\.([0-9]{1,2})\.([0-9]{1,2})", version)
    if not match or int(match[1]) < 1:
        raise ValueError("게임 버전을 15.7.0 형식으로 입력해 주세요.")
    major, minor, patch = map(int, match.groups())
    return major * 10000 + minor * 100 + patch


@dataclass(frozen=True)
class RawResponse:
    status: int
    reason: str
    headers: tuple[tuple[str, str], ...]
    body: bytes
    version: str
    received_at: str
    elapsed_seconds: float
    content_decoded: bool = False
    complete: bool = True
    failure: dict | None = None
    wire_bytes: int = 0
    body_representation: str = "decoded_http_body"

    def header(self, name: str, default: str = "") -> str:
        return next((v for k, v in self.headers if k.lower() == name.lower()), default)

    @property
    def is_save(self) -> bool:
        media = self.header("Content-Type").split(";", 1)[0].strip().lower()
        return self.complete and self.failure is None and 200 <= self.status < 300 and media == "application/octet-stream" and bool(self.body)

    @property
    def sha256(self) -> str:
        return hashlib.sha256(self.body).hexdigest()


class ReceiveError(Exception):
    """A response could not be retained; server-side effects remain unknown."""

    def __init__(self, message: str, diagnostics: dict | None = None):
        super().__init__(message)
        self.diagnostics = diagnostics or {}


def make_request(value: TransferInput) -> tuple[str, bytes, dict[str, str]]:
    value = value.validated()
    payload = {
        "clientInfo": {
            "client": {"countryCode": COUNTRY, "version": version_number(value.version)},
            "device": {"model": "SM-G955F"},
            "os": {"type": "android", "version": "9"},
        },
        "nonce": secrets.token_hex(16),
        "pin": value.pin,
    }
    path = "/v2/transfers/" + quote(value.code, safe="") + "/reception"
    body = json.dumps(payload, ensure_ascii=True, separators=(",", ":")).encode("utf-8")
    headers = {
        "Content-Type": "application/json",
        "Accept-Encoding": "gzip",
        "Connection": "close",
        "User-Agent": "Dalvik/2.1.0 (Linux; U; Android 9; SM-G955F Build/N2G48B)",
    }
    return path, body, headers


def fetch_raw(value: TransferInput, progress=None, connection_factory=None) -> RawResponse:
    """Send exactly one HTTPS POST. No redirects, retries, ACK or DELETE."""
    value = value.validated()
    path, body, headers = make_request(value)
    connection = None
    response = None
    response_headers = ()
    wire_body = bytearray()
    raw_body = b""
    decoded = False
    phase = "connect_tls"
    attempted = False
    started = time.monotonic()
    def update(stage, count=0):
        nonlocal phase
        phase = stage
        if progress is not None:
            progress({"phase": stage, "received_bytes": count})

    def finish(complete=True, failure=None, representation="decoded_http_body"):
        return RawResponse(
            response.status, response.reason, response_headers, raw_body, value.version,
            datetime.now(timezone.utc).isoformat(timespec="seconds"),
            round(time.monotonic() - started, 3), decoded, complete, failure,
            len(wire_body), representation,
        )

    try:
        update("connect_tls")
        context = ssl.create_default_context()
        context.set_alpn_protocols(["http/1.1"])
        factory = connection_factory or http.client.HTTPSConnection
        connection = factory(
            HOST, timeout=CONNECT_TIMEOUT_SECONDS, context=context
        )
        connection.connect()
        connection.sock.settimeout(TIMEOUT_SECONDS)
        update("send_request")
        attempted = True
        connection.request("POST", path, body=body, headers=headers)
        update("response_headers")
        response = connection.getresponse()
        response_headers = tuple(response.getheaders())
        update("response_body")
        while True:
            chunk = response.read1(min(65536, MAX_BYTES + 1 - len(wire_body)))
            if not chunk:
                break
            wire_body.extend(chunk)
            update("response_body", len(wire_body))
            if len(wire_body) > MAX_BYTES:
                raise ReceiveError("응답이 64 MiB를 초과했습니다. 받은 부분만 보관했습니다.")
        declared = response.getheader("Content-Length", "")
        if declared.isdigit() and len(wire_body) != int(declared):
            raise ReceiveError("응답이 Content-Length보다 짧게 종료되었습니다. 받은 부분을 보관했습니다.")
        update("decode_body", len(wire_body))
        encoding = response.getheader("Content-Encoding", "").strip().lower()
        decoded = encoding == "gzip"
        if decoded:
            with gzip.GzipFile(fileobj=io.BytesIO(bytes(wire_body))) as stream:
                raw_body = stream.read(MAX_BYTES + 1)
            if len(raw_body) > MAX_BYTES:
                raise ReceiveError("압축 해제한 응답이 64 MiB를 초과해 보관하지 못했습니다.")
        elif encoding in ("", "identity"):
            raw_body = bytes(wire_body)
        else:
            raise ReceiveError("지원하지 않는 응답 압축 형식입니다: " + encoding[:40])
        update("complete", len(wire_body))
        return finish()
    except Exception as error:
        if isinstance(error, http.client.IncompleteRead):
            wire_body.extend(error.partial)
        detail = str(error).replace(value.code, "[이어하기 코드 가림]").replace(value.pin, "[인증번호 가림]")[:1200]
        failure = {"phase": phase, "exception_type": type(error).__name__, "detail": detail,
                   "transport": "winhttp" if connection_factory else "python_https",
                   "request_attempted": attempted, "account_post_count": int(attempted),
                   "received_wire_bytes": len(wire_body),
                   "elapsed_seconds": round(time.monotonic() - started, 3),
                   "automatic_retry": False}
        message = f"{phase} 단계에서 {type(error).__name__}: {detail}\n서버 처리 여부는 미확인입니다. 자동 재시도하지 않았습니다."
        if response is not None:
            raw_body = bytes(wire_body)
            decoded = False
            return finish(False, failure, "wire_body_unverified")
        raise ReceiveError(message, failure) from None
    finally:
        if connection is not None:
            connection.close()


def fetch_raw_windows(value: TransferInput, progress=None) -> RawResponse:
    from windows_transport import WindowsHTTPConnection
    return fetch_raw(value, progress, connection_factory=WindowsHTTPConnection)


def is_secret_header(name: str) -> bool:
    name = name.lower()
    return name.startswith("nyanko-password") or name in {
        "authorization", "proxy-authorization", "cookie", "set-cookie", "location"
    }


def response_metadata(response: RawResponse, reveal: bool = False) -> dict:
    """Never include the request's transfer code or PIN in diagnostics."""
    return {
        "http_status": response.status,
        "http_reason": response.reason,
        "save_content_type_received": response.is_save,
        "body_bytes": len(response.body),
        "body_sha256": response.sha256,
        "region": COUNTRY,
        "requested_game_version": response.version,
        "requested_game_version_number": version_number(response.version),
        "received_at_utc": response.received_at,
        "elapsed_seconds": response.elapsed_seconds,
        "http_content_encoding_decoded": response.content_decoded,
        "response_complete": response.complete,
        "body_representation": response.body_representation,
        "wire_bytes": response.wire_bytes,
        "failure": response.failure,
        "headers": [
            {"name": k, "value": v if reveal or not is_secret_header(k) else "[가림]"}
            for k, v in response.headers
        ],
    }


def hex_page(body: bytes, page: int = 0) -> str:
    start = page * PAGE_BYTES
    rows = []
    for offset in range(start, min(start + PAGE_BYTES, len(body)), 16):
        chunk = body[offset:offset + 16]
        left = " ".join(f"{byte:02X}" for byte in chunk[:8])
        right = " ".join(f"{byte:02X}" for byte in chunk[8:])
        ascii_text = "".join(chr(byte) if 32 <= byte < 127 else "." for byte in chunk)
        rows.append(f"{offset:08X}  {left:<23}  {right:<23}  |{ascii_text}|")
    return "\n".join(rows)


def text_page(body: bytes, page: int = 0, encoding: str = "utf-8") -> str:
    chunk = body[page * PAGE_BYTES:(page + 1) * PAGE_BYTES]
    text = chunk.decode(encoding, errors="replace")
    # Tk Text cannot reliably show embedded NULs; show explicit escapes instead.
    return "".join(ch if ch in "\r\n\t" or ord(ch) >= 32 else f"\\x{ord(ch):02x}" for ch in text)
