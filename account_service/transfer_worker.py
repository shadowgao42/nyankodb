"""Ephemeral single transfer reception. Input only via stdin; no saved secrets."""
import json
import os
import sys

def main():
    credentials = response = None
    try:
        import raw_viewer_core as core
        core.MAX_BYTES = 4 * 1024 * 1024
        credentials = json.loads(sys.stdin.buffer.read(4097))
        fetch = core.fetch_raw_windows if os.name == 'nt' else core.fetch_raw
        response = fetch(core.TransferInput(credentials['code'], credentials['pin']))
        credentials.clear()
        if len(response.body) > core.MAX_BYTES:
            return 23
        if not response.is_save:
            return 22
        sys.stdout.buffer.write(response.body)
        sys.stdout.buffer.flush()
        return 0
    except Exception:
        # Never forward an exception, request URL, headers or credentials.
        return 24
    finally:
        if isinstance(credentials, dict):
            credentials.clear()
        credentials = response = None

if __name__ == '__main__':
    sys.exit(main())
