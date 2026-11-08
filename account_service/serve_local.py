"""Serve the public site and the existing account API on one loopback origin."""
import argparse
import json
import logging
import os
from pathlib import Path
import sys


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--config', required=True, type=Path)
    parser.add_argument('--site', type=Path, default=Path(__file__).resolve().parents[1])
    parser.add_argument('--port', type=int, default=8877)
    parser.add_argument('--check', action='store_true')
    args = parser.parse_args()
    if not 1024 <= args.port <= 65535:
        parser.error('Use an unprivileged local port.')
    site = args.site.resolve(strict=True)
    config = json.loads(args.config.resolve(strict=True).read_text(encoding='utf-8'))
    for key in ('SUPABASE_URL', 'SUPABASE_PUBLISHABLE_KEY', 'SUPABASE_SECRET_KEY', 'ACCOUNT_ENCRYPTION_KEY'):
        if not isinstance(config.get(key), str) or not config[key]:
            parser.error('Required private account configuration is missing.')
        os.environ[key] = config[key]
    config.clear()
    os.environ['APP_ORIGIN'] = f'http://127.0.0.1:{args.port}'
    os.environ['NYANKODB_SITE_ROOT'] = str(site)
    sys.dont_write_bytecode = True
    sys.path.insert(0, str(Path(__file__).resolve().parent))
    from flask import request
    import server

    @server.app.before_request
    def local_static_rewrites():
        # Match the production signup rewrite; signup remains unavailable.
        if request.method == 'GET' and request.path == '/mypage/signup.html':
            return server.static('mypage/working.html')

    def public_static_headers(response):
        # Production static files come from the CDN, outside the account API.
        # Keep account/API frame protection while allowing the event page's
        # existing same-origin schedule iframes locally.
        if not request.path.startswith(('/api/', '/mypage/')):
            response.headers.pop('X-Frame-Options', None)
        return response

    # Flask runs response hooks in reverse registration order.
    server.app.after_request_funcs.setdefault(None, []).insert(0, public_static_headers)

    if args.check:
        print('Local site and account API configuration ready; no secrets printed.')
        return
    logging.getLogger('werkzeug').setLevel(logging.ERROR)
    print(f'Local NyankoDB ready: http://127.0.0.1:{args.port}', flush=True)
    server.app.run(host='127.0.0.1', port=args.port, threaded=True, debug=False, use_reloader=False)


if __name__ == '__main__':
    main()
