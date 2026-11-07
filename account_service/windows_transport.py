"""Windows WinHTTP adapter. Uses OS proxy/TLS policy; never disables TLS checks."""
from __future__ import annotations
import ctypes as C
from ctypes import wintypes as W


class WindowsHTTPConnection:
    def __init__(self, host, timeout=15, context=None):
        self.host = host
        self.timeout = timeout
        self.read_timeout = 90
        self.session = self.connection = self.handle = None
        self.sock = self
        self.dll = C.WinDLL("winhttp", use_last_error=True)
        handle = W.HANDLE
        dwordp = C.POINTER(W.DWORD)
        signatures = {
            "WinHttpOpen": (handle, [W.LPCWSTR, W.DWORD, W.LPCWSTR, W.LPCWSTR, W.DWORD]),
            "WinHttpConnect": (handle, [handle, W.LPCWSTR, W.WORD, W.DWORD]),
            "WinHttpOpenRequest": (handle, [handle, W.LPCWSTR, W.LPCWSTR, W.LPCWSTR, W.LPCWSTR, C.c_void_p, W.DWORD]),
            "WinHttpSetTimeouts": (W.BOOL, [handle, C.c_int, C.c_int, C.c_int, C.c_int]),
            "WinHttpSetOption": (W.BOOL, [handle, W.DWORD, C.c_void_p, W.DWORD]),
            "WinHttpSendRequest": (W.BOOL, [handle, W.LPCWSTR, W.DWORD, C.c_void_p, W.DWORD, W.DWORD, C.c_size_t]),
            "WinHttpReceiveResponse": (W.BOOL, [handle, C.c_void_p]),
            "WinHttpQueryHeaders": (W.BOOL, [handle, W.DWORD, W.LPCWSTR, C.c_void_p, dwordp, dwordp]),
            "WinHttpReadData": (W.BOOL, [handle, C.c_void_p, W.DWORD, dwordp]),
            "WinHttpCloseHandle": (W.BOOL, [handle]),
        }
        for name, (result, args) in signatures.items():
            function = getattr(self.dll, name)
            function.restype, function.argtypes = result, args

    @staticmethod
    def check(value, operation):
        if not value:
            code = C.get_last_error()
            raise OSError(code, operation + ": " + C.FormatError(code).strip())
        return value

    def connect(self):
        # Automatic OS proxy configuration; no registry or global setting writes.
        self.session = self.check(self.dll.WinHttpOpen("NyankoRawViewer/0.2", 4, None, None, 0), "WinHttpOpen")
        self.check(self.dll.WinHttpSetTimeouts(self.session, int(self.timeout*1000), int(self.timeout*1000), 90000, 90000), "WinHttpSetTimeouts")
        self.connection = self.check(self.dll.WinHttpConnect(self.session, self.host, 443, 0), "WinHttpConnect")

    def settimeout(self, timeout):
        self.read_timeout = timeout

    def request(self, method, path, body, headers):
        self.handle = self.check(self.dll.WinHttpOpenRequest(self.connection, method, path, "HTTP/1.1", None, None, 0x00800000), "WinHttpOpenRequest")
        # WINHTTP_OPTION_DISABLE_FEATURE: redirects (2), cookies (1).
        features = W.DWORD(3)
        self.check(self.dll.WinHttpSetOption(self.handle, 63, C.byref(features), C.sizeof(features)), "Disable redirects/cookies")
        # WINHTTP_OPTION_AUTOLOGON_POLICY: HIGH (2); do not send Windows credentials.
        autologon = W.DWORD(2)
        self.check(self.dll.WinHttpSetOption(self.handle, 77, C.byref(autologon), C.sizeof(autologon)), "Disable automatic logon")
        self.check(self.dll.WinHttpSetTimeouts(self.handle, int(self.timeout*1000), int(self.timeout*1000), 90000, int(self.read_timeout*1000)), "WinHttpSetTimeouts")
        text = "".join(f"{name}: {value}\r\n" for name, value in headers.items())
        buffer = C.create_string_buffer(body)
        # One call only. No ERROR_WINHTTP_RESEND_REQUEST retry loop.
        self.check(self.dll.WinHttpSendRequest(self.handle, text, len(text), buffer, len(body), len(body), 0), "WinHttpSendRequest")

    def getresponse(self):
        self.check(self.dll.WinHttpReceiveResponse(self.handle, None), "WinHttpReceiveResponse")
        length = W.DWORD(0)
        self.dll.WinHttpQueryHeaders(self.handle, 22, None, None, C.byref(length), None)
        if C.get_last_error() != 122:
            raise OSError(C.get_last_error(), "WinHttpQueryHeaders size failed")
        buffer = C.create_unicode_buffer(length.value // C.sizeof(C.c_wchar) + 1)
        self.check(self.dll.WinHttpQueryHeaders(self.handle, 22, None, buffer, C.byref(length), None), "WinHttpQueryHeaders")
        return WindowsHTTPResponse(self, buffer.value)

    def close(self):
        for name in ("handle", "connection", "session"):
            handle = getattr(self, name)
            if handle:
                self.dll.WinHttpCloseHandle(handle)
                setattr(self, name, None)


class WindowsHTTPResponse:
    def __init__(self, connection, raw_headers):
        self.connection = connection
        lines = raw_headers.split("\r\n")
        status = lines[0].split(" ", 2)
        self.status = int(status[1])
        self.reason = status[2] if len(status) == 3 else ""
        self.headers = tuple((key.strip(), value.strip()) for line in lines[1:] if ":" in line for key,value in [line.split(":",1)])
        length = self.getheader("Content-Length")
        self.remaining = int(length) if length.isdigit() else None

    def getheaders(self):
        return self.headers

    def getheader(self, name, default=""):
        return next((value for key,value in self.headers if key.lower()==name.lower()), default)

    def read1(self, count):
        if self.remaining == 0:
            return b""
        if self.remaining is not None:
            count = min(count, self.remaining)
        buffer = C.create_string_buffer(count)
        received = W.DWORD(0)
        self.connection.check(self.connection.dll.WinHttpReadData(self.connection.handle, buffer, count, C.byref(received)), "WinHttpReadData")
        data = buffer.raw[:received.value]
        if self.remaining is not None:
            self.remaining -= len(data)
        return data
