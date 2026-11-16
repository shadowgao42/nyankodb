"""Same-origin account, search, and official-feed API entry point."""
import os
from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parents[1]
os.environ['NYANKODB_SITE_ROOT'] = str(ROOT)
sys.path.insert(0, str(ROOT / 'account_service'))
from server import app

# Underscored API utility files are bundled, not independent Vercel Functions.
sys.path.insert(0, str(ROOT / 'api'))
from _external_search import search_all, search_section
from _official_notices import get_notices
from _official_social import get_shop_updates
from _x_posts import get_x_posts
from flask import abort, jsonify, request

_PUBLIC_FEEDS = {'/api/search/external', '/api/notices/official', '/api/social/shop', '/api/social/x'}


@app.before_request
def protect_search_feeds():
    # Existing account host, rate-limit, CSRF, and response-header guards remain.
    if request.path.startswith('/api/_') or request.path == '/api/search/ai':
        abort(404)
    if request.path in _PUBLIC_FEEDS:
        from server import ORIGIN
        if request.headers.get('Origin') not in (None, ORIGIN) or request.headers.get('Sec-Fetch-Site') == 'cross-site':
            abort(403)


@app.get('/api/search/external')
def public_external_search():
    params = request.args
    if set(params) - {'q', 'kind', 'page'} or any(len(params.getlist(key)) != 1 for key in params):
        return jsonify({'error': 'invalid_query'}), 400
    try:
        query = params.get('q', '')
        page = int(params.get('page', '1'))
        if not 1 <= page <= 100:
            raise ValueError('invalid_page')
        result = search_section(query, params['kind'], page) if 'kind' in params else search_all(query, page)
    except ValueError:
        return jsonify({'error': 'invalid_query'}), 400
    return jsonify(result)


def _feed(function):
    if request.query_string:
        return jsonify({'error': 'invalid_query'}), 400
    return jsonify(function())


@app.get('/api/notices/official')
def public_official_notices():
    return _feed(get_notices)


@app.get('/api/social/shop')
def public_shop_updates():
    return _feed(get_shop_updates)


@app.get('/api/social/x')
def public_x_updates():
    return _feed(get_x_posts)
