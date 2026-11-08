"""NyankoDB BFF: all keys and Supabase tokens remain server-side/HttpOnly."""
import base64
import copy
from collections import defaultdict, deque
from datetime import datetime, timezone
import hashlib
import hmac
import json
import os
from pathlib import Path
import re
import secrets
import subprocess
import sys
import threading
import time
from urllib.parse import urlencode, urlsplit
from uuid import UUID

from cryptography.hazmat.primitives.ciphers.aead import AESGCM
from flask import Flask, abort, jsonify, make_response, redirect, request, send_from_directory
from werkzeug.exceptions import HTTPException
from transport import request as https
from profile_editing import apply_extras, known_units, stage_rule

ROOT = Path(__file__).resolve().parent
PRIVATE = ROOT / '.private'
SITE = Path(os.environ.get('NYANKODB_SITE_ROOT') or ROOT.parent / 'nyankodb-pages')
BUCKET = 'nyankodb-accounts-v1'
COOKIE = 'nyanko_session'
config = json.loads((PRIVATE / 'config.json').read_text()) if (PRIVATE / 'config.json').exists() else {}
def setting(key):
    return os.environ.get(key) or config.get(key, '')
ORIGIN = setting('APP_ORIGIN') or 'http://127.0.0.1:8765'
SUPABASE = setting('SUPABASE_URL').rstrip('/')
KEY = base64.urlsafe_b64decode(setting('ACCOUNT_ENCRYPTION_KEY'))
if len(KEY) != 32 or not re.fullmatch(r'https://[a-z0-9-]+\.supabase\.co', SUPABASE):
    raise RuntimeError('Invalid private server configuration')
crypto = AESGCM(KEY)
app = Flask(__name__, static_folder=None)
app.config['MAX_CONTENT_LENGTH'] = 4096
app.json.ensure_ascii = False
gate = threading.Lock()
rates = defaultdict(deque)
import_locks = set()

class PublicError(Exception):
    def __init__(self, message, status=400):
        self.message, self.status = message, status

def seal(data, aad):
    nonce = secrets.token_bytes(12)
    return nonce + crypto.encrypt(nonce, data, aad.encode())

def unseal(data, aad):
    return crypto.decrypt(data[:12], data[12:], aad.encode())

def api(path, method='GET', data=None, token=None, admin=False, binary=False):
    key = setting('SUPABASE_SECRET_KEY' if admin else 'SUPABASE_PUBLISHABLE_KEY')
    headers = {'apikey': key}
    if token:
        headers['Authorization'] = 'Bearer ' + token
    if binary:
        headers.update({'Content-Type': 'application/octet-stream', 'x-upsert': 'true'})
    try:
        status, body = https(SUPABASE + path, method, data, headers)
    except (OSError, ValueError):
        raise PublicError('인증 서버에 연결하지 못했습니다. 잠시 후 다시 시도해 주세요.', 502) from None
    if binary and method == 'GET':
        return status, body
    try:
        return status, json.loads(body) if body else {}
    except (ValueError, UnicodeError):
        raise PublicError('서버 응답을 확인할 수 없습니다.', 502) from None

def limit(key, maximum, window):
    now = time.monotonic()
    with gate:
        q = rates[key]
        while q and q[0] < now - window:
            q.popleft()
        if len(q) >= maximum:
            raise PublicError('요청이 많습니다. 잠시 후 다시 시도해 주세요.', 429)
        q.append(now)

def decode_cookie(name, aad):
    try:
        data = request.cookies.get(name, '')
        value = json.loads(unseal(base64.urlsafe_b64decode(data), aad))
        if value['until'] > time.time():
            return value
    except Exception:
        pass
    return None

def put_cookie(response, name, value, aad, age):
    value = {**value, 'until': int(time.time()) + age}
    encoded = base64.urlsafe_b64encode(seal(json.dumps(value).encode(), aad)).decode()
    response.set_cookie(name, encoded, max_age=age, httponly=True, secure=ORIGIN.startswith('https:'), samesite='Lax', path='/')

def login_response(tokens):
    response = jsonify({'ok': True})
    if 'access_token' in tokens and 'refresh_token' in tokens:
        put_cookie(response, COOKIE, {'access': tokens['access_token'], 'refresh': tokens['refresh_token'],
                                    'expires': int(time.time()) + int(tokens.get('expires_in', 3600))}, 'session', 7 * 86400)
    return response

def identity():
    session = decode_cookie(COOKIE, 'session')
    if not session:
        raise PublicError('로그인이 필요합니다.', 401)
    if session.get('expires', 0) <= time.time() + 30:
        status, data = api('/auth/v1/token?grant_type=refresh_token', 'POST', {'refresh_token': session['refresh']})
        if status != 200:
            raise PublicError('다시 로그인해 주세요.', 401)
        session.update(access=data['access_token'], refresh=data['refresh_token'], expires=int(time.time()) + int(data['expires_in']))
        request.refreshed_session = session
    status, user = api('/auth/v1/user', token=session['access'])
    if status != 200:
        raise PublicError('다시 로그인해 주세요.', 401)
    try:
        uid = str(UUID(user['id']))
    except (ValueError, KeyError):
        raise PublicError('사용자를 확인할 수 없습니다.', 401)
    return uid, user, session

@app.before_request
def protect():
    if request.path == '/api/account/save':
        request.max_content_length = 1024 * 1024
    if request.host != urlsplit(ORIGIN).netloc:
        abort(400)
    if request.path.startswith('/api/'):
        limit(('requests', request.remote_addr), 200, 60)
        if request.method != 'GET':
            if request.headers.get('Origin') != ORIGIN:
                raise PublicError('요청 출처를 확인할 수 없습니다.', 403)
            expected, provided = request.cookies.get('nyanko_csrf', ''), request.headers.get('X-CSRF-Token', '')
            if not expected or not hmac.compare_digest(expected, provided):
                raise PublicError('페이지를 새로고침한 뒤 다시 시도해 주세요.', 403)
            if request.mimetype != 'application/json':
                abort(415)

@app.after_request
def headers(response):
    response.headers.update({'X-Content-Type-Options': 'nosniff', 'Referrer-Policy': 'no-referrer',
                            'X-Frame-Options': 'DENY', 'Permissions-Policy': 'camera=(), microphone=(), geolocation=()'})
    if request.path.startswith(('/api/', '/mypage/')):
        response.headers['Cache-Control'] = 'no-store, private'
        response.headers['Content-Security-Policy'] = "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self'; object-src 'none'; base-uri 'none'; frame-ancestors 'none'; form-action 'self'"
    if hasattr(request, 'refreshed_session'):
        put_cookie(response, COOKIE, request.refreshed_session, 'session', 7 * 86400)
    return response

@app.errorhandler(Exception)
def error(error):
    if isinstance(error, PublicError):
        return jsonify({'error': error.message}), error.status
    if isinstance(error, HTTPException):
        return jsonify({'error': '요청을 처리할 수 없습니다.'}), error.code
    # Never echo upstream bodies, credential-bearing URLs, exceptions or tracebacks.
    return jsonify({'error': '처리 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.'}), 500

@app.get('/api/bootstrap')
def bootstrap():
    response = jsonify({'ok': True, 'googleEnabled': bool(setting('GOOGLE_ENABLED')),
                        'emailCodeEnabled': setting('EMAIL_CODE_ENABLED') == '1'})
    if not request.cookies.get('nyanko_csrf'):
        response.set_cookie('nyanko_csrf', secrets.token_urlsafe(32), secure=ORIGIN.startswith('https:'), samesite='Strict', path='/')
    return response

@app.get('/api/auth/session')
def auth_session():
    """GNB auth state only; never return user identifiers or fetch game data."""
    try:
        identity()
    except PublicError as error:
        if error.status == 401:
            return jsonify({'authenticated': False})
        raise
    return jsonify({'authenticated': True})

def username_value(value):
    if not isinstance(value, str) or not re.fullmatch(r'[A-Za-z0-9_]{4,24}', value):
        raise PublicError('아이디는 영문·숫자·밑줄 4~24자로 입력해 주세요.')
    return value.lower()

def member_lookup(username):
    status, rows = api('/rest/v1/nyankodb_members?' + urlencode({'username': 'eq.' + username, 'select': 'user_id,username'}), admin=True)
    if status != 200 or not isinstance(rows, list):
        raise PublicError('아이디를 확인할 수 없습니다. 잠시 후 다시 시도해 주세요.', 502)
    return rows[0] if rows else None

def credentials():
    data = request.get_json()
    if not isinstance(data, dict):
        raise PublicError('아이디와 비밀번호를 확인해 주세요.')
    username, password = username_value(data.get('username')), data.get('password', '')
    if not isinstance(password, str) or not 1 <= len(password) <= 128:
        raise PublicError('비밀번호를 확인해 주세요.')
    return data, username, password

@app.post('/api/auth/login')
def login():
    limit(('auth', request.remote_addr), 10, 300)
    _, username, password = credentials()
    member = member_lookup(username)
    if not member:
        raise PublicError('아이디 또는 비밀번호를 확인해 주세요.', 401)
    status, owner = api('/auth/v1/admin/users/' + str(UUID(member['user_id'])), admin=True)
    if status != 200 or not owner.get('email_confirmed_at'):
        raise PublicError('아이디 또는 비밀번호를 확인해 주세요.', 401)
    email = owner['email']
    status, data = api('/auth/v1/token?grant_type=password', 'POST', {'email': email, 'password': password})
    if status != 200 or data.get('user', {}).get('id') != member['user_id']:
        raise PublicError('아이디 또는 비밀번호를 확인해 주세요.', 401)
    return login_response(data)

@app.post('/api/auth/signup')
def signup():
    limit(('signup', request.remote_addr), 5, 3600)
    data, username, password = credentials()
    if not isinstance(data.get('nickname'), str):
        raise PublicError('닉네임을 확인해 주세요.')
    nickname = data['nickname'].strip()
    email = data.get('email')
    if not isinstance(email, str) or len(email) > 254 or not re.fullmatch(r'[^\s@]+@[^\s@]+\.[^\s@]+', email):
        raise PublicError('인증용 이메일 주소를 확인해 주세요.')
    email = email.strip()
    if not 2 <= len(nickname) <= 20 or len(password) < 8:
        raise PublicError('닉네임은 2~20자, 비밀번호는 8~128자로 입력해 주세요.')
    if setting('EMAIL_CODE_ENABLED') != '1':
        raise PublicError('이메일 인증 준비 중입니다.', 503)
    if member_lookup(username):
        raise PublicError('이미 사용 중인 아이디입니다.', 409)
    status, tokens = api('/auth/v1/signup?' + urlencode({'redirect_to': ORIGIN + '/mypage/login.html'}), 'POST',
                        {'email': email, 'password': password, 'data': {'display_name': nickname}})
    if status not in (200, 201):
        if tokens.get('error_code') == 'email_address_invalid':
            raise PublicError('사용 가능한 이메일 주소를 입력해 주세요.')
        if tokens.get('error_code') == 'email_address_not_authorized':
            raise PublicError('현재 가입 인증 메일을 발송할 수 없습니다. 관리자에게 문의해 주세요.', 503)
        if tokens.get('error_code') == 'over_email_send_rate_limit':
            raise PublicError('인증 메일 발송 한도에 도달했습니다. 잠시 후 다시 시도해 주세요.', 429)
        raise PublicError('회원가입을 처리하지 못했습니다. 입력 내용과 이메일 수신함을 확인해 주세요.')
    user = tokens.get('user', tokens)
    if 'access_token' in tokens or not user.get('id'):
        raise PublicError('이메일 인증 설정을 확인해 주세요.', 503)
    response = jsonify({'ok': True, 'confirmationRequired': True})
    put_cookie(response, 'nyanko_signup', {'username': username, 'email': email, 'user_id': user['id']}, 'signup', 1800)
    return response

@app.post('/api/auth/verify-email')
def verify_email():
    limit(('verify', request.remote_addr), 10, 600)
    pending = decode_cookie('nyanko_signup', 'signup')
    data = request.get_json()
    if not pending or not isinstance(data, dict):
        raise PublicError('인증 요청이 만료되었습니다. 다시 가입해 주세요.')
    username = username_value(data.get('username', pending['username']))
    member = member_lookup(username)
    if member and member['user_id'] != pending['user_id']:
        raise PublicError('이미 사용 중인 아이디입니다. 다른 아이디를 입력해 주세요.', 409)
    tokens = pending.get('verified_tokens')
    if not tokens:
        code = data.get('code', '')
        if not isinstance(code, str) or not re.fullmatch(r'[0-9]{6,10}', code):
            raise PublicError('이메일로 받은 인증코드를 입력해 주세요.')
        status, tokens = api('/auth/v1/verify', 'POST', {'type': 'signup', 'email': pending['email'], 'token': code})
        if status != 200 or not tokens.get('access_token'):
            raise PublicError('인증코드가 올바르지 않거나 만료되었습니다.')
    status, user = api('/auth/v1/user', token=tokens['access_token'])
    if status != 200 or user.get('id') != pending['user_id'] or not user.get('email_confirmed_at') or user.get('email', '').casefold() != pending['email'].casefold():
        raise PublicError('이메일 인증을 확인할 수 없습니다.', 403)
    def verified_error(message, status_code):
        response = jsonify({'error': message})
        retained = {key: tokens[key] for key in ['access_token', 'refresh_token', 'expires_in'] if key in tokens}
        put_cookie(response, 'nyanko_signup', {**pending, 'verified_tokens': retained}, 'signup', 600)
        return response, status_code
    status, _ = api('/rest/v1/nyankodb_members', 'POST', {'user_id': user['id'], 'username': username}, admin=True)
    if status == 409:
        member = member_lookup(username)
        if not member or member['user_id'] != user['id']:
            # Preserve verified ownership after a concurrent username claim, not a password.
            return verified_error('이미 사용 중인 아이디입니다. 다른 아이디를 입력해 주세요.', 409)
    elif status not in (200, 201, 204):
        return verified_error('가입 정보를 저장하지 못했습니다. 잠시 후 회원가입을 다시 눌러 주세요.', 502)
    response = login_response(tokens)
    response.delete_cookie('nyanko_signup', path='/')
    return response

@app.post('/api/auth/resend-email')
def resend_email():
    limit(('resend', request.remote_addr), 1, 60)
    if setting('EMAIL_CODE_ENABLED') != '1':
        raise PublicError('이메일 인증 준비 중입니다.', 503)
    pending = decode_cookie('nyanko_signup', 'signup')
    if not pending:
        raise PublicError('인증 요청이 만료되었습니다. 다시 가입해 주세요.')
    if pending.get('verified_tokens'):
        raise PublicError('이메일 인증은 완료됐습니다. 아이디를 확인하고 회원가입을 눌러 주세요.', 409)
    status, _ = api('/auth/v1/resend', 'POST', {'type': 'signup', 'email': pending['email']})
    if status not in (200, 201):
        raise PublicError('인증 메일을 발송하지 못했습니다. 잠시 후 다시 시도해 주세요.', 429)
    return jsonify({'ok': True})

@app.post('/api/auth/logout')
def logout():
    session = decode_cookie(COOKIE, 'session')
    if session:
        api('/auth/v1/logout?scope=local', 'POST', {}, token=session['access'])
    response = jsonify({'ok': True})
    response.delete_cookie(COOKIE, path='/')
    return response

@app.get('/api/auth/google')
def google():
    if not setting('GOOGLE_ENABLED'):
        raise PublicError('Google 로그인 준비 중입니다.', 503)
    verifier = secrets.token_urlsafe(48)
    challenge = base64.urlsafe_b64encode(hashlib.sha256(verifier.encode()).digest()).decode().rstrip('=')
    state = secrets.token_urlsafe(32)
    callback = ORIGIN + '/api/auth/callback?' + urlencode({'state': state})
    response = redirect(SUPABASE + '/auth/v1/authorize?' + urlencode({'provider': 'google', 'redirect_to': callback,
                        'code_challenge': challenge, 'code_challenge_method': 's256'}))
    put_cookie(response, 'nyanko_oauth', {'verifier': verifier, 'state': state}, 'oauth', 600)
    return response

@app.get('/api/auth/callback')
def callback():
    flow = decode_cookie('nyanko_oauth', 'oauth')
    state = request.args.get('state', '')
    code = request.args.get('code', '')
    if not flow or not hmac.compare_digest(flow['state'], state) or not re.fullmatch(r'[A-Za-z0-9_-]{10,256}', code):
        raise PublicError('로그인 요청이 만료되었습니다. 다시 시도해 주세요.')
    status, tokens = api('/auth/v1/token?grant_type=pkce', 'POST', {'auth_code': code, 'code_verifier': flow['verifier']})
    if status != 200:
        raise PublicError('로그인을 완료하지 못했습니다. 다시 시도해 주세요.')
    response = login_response(tokens)
    response.status_code = 303
    response.headers['Location'] = '/mypage/'
    response.delete_cookie('nyanko_oauth', path='/')
    return response

def object_path(uid):
    return '/storage/v1/object/' + BUCKET + '/' + uid + '/account.bin'

def revision(profile):
    return hashlib.sha256(json.dumps(profile, sort_keys=True, separators=(',', ':')).encode()).hexdigest()

@app.get('/api/account')
def account():
    uid, user, _ = identity()
    status, encrypted = api(object_path(uid), admin=True, binary=True)
    profile = None
    if status == 200:
        profile = json.loads(unseal(encrypted, 'account:' + uid))['profile']
    elif status != 404:
        try:
            missing = status == 400 and json.loads(encrypted).get('error') == 'not_found'
        except (ValueError, UnicodeError):
            missing = False
        if not missing:
            raise PublicError('계정 정보를 읽지 못했습니다.', 502)
    status, members = api('/rest/v1/nyankodb_members?' + urlencode({'user_id':'eq.' + uid, 'select':'username'}), admin=True)
    if status != 200 or not isinstance(members, list):
        raise PublicError('아이디를 확인하지 못했습니다.', 502)
    return jsonify({'user': {'username': members[0]['username'] if members else '',
                            'nickname': user.get('user_metadata', {}).get('display_name', '')},
                    'account': profile, 'revision': revision(profile) if profile else None})

def validate_edits(profile, data, metadata):
    """Allowlisted manual collection edits; raw source/auth fields stay immutable."""
    fields = {'revision', 'units', 'treasures', 'passives'}
    if not isinstance(data, dict) or set(data) - {'profileIcon'} not in (fields, fields | {'inventoryEdits', 'stageEdits'}, fields | {'inventoryEdits', 'stageEdits', 'removedUnitIds'}):
        raise PublicError('저장할 데이터를 확인해 주세요.')
    if data['revision'] != revision(profile):
        raise PublicError('다른 곳에서 계정 정보가 변경됐습니다. 새로고침 후 다시 수정해 주세요.', 409)
    result = copy.deepcopy(profile)
    units = data['units']
    available = known_units(SITE)
    forms = known_units(SITE, forms=True)
    if not isinstance(units, list) or len(units) > len(available):
        raise PublicError('보유 캐릭터 목록을 확인해 주세요.')
    expected = {u['id']: u for u in profile['units']}
    seen = set()
    for u in units:
        if not isinstance(u, dict) or set(u) not in ({'id','level','plus'}, {'id','level','plus','form'}, {'id','level','plus','form','unlockedForm'}) or type(u['id']) is not int or u['id'] not in available or u['id'] in seen:
            raise PublicError('캐릭터 정보를 확인해 주세요.')
        if 'form' in u and (type(u['form']) is not int or u['form'] not in forms[u['id']]):
            raise PublicError('존재하는 캐릭터 형태를 선택해 주세요.')
        if 'unlockedForm' in u and (type(u['unlockedForm']) is not int or u['unlockedForm'] not in forms[u['id']] or u['form'] > u['unlockedForm']):
            raise PublicError('해금한 형태 중 적용 형태를 선택해 주세요.')
        seen.add(u['id'])
        limits = metadata['unitLimits'].get(str(u['id']))
        if not limits:
            raise PublicError('지원하는 캐릭터인지 확인해 주세요.')
        for field, maximum in [('level', max(limits['maxBase'], expected.get(u['id'],{}).get('level',1))), ('plus', max(limits['maxPlus'], expected.get(u['id'],{}).get('plus',0)))]:
            if type(u[field]) is not int or not (1 if field == 'level' else 0) <= u[field] <= maximum:
                raise PublicError('캐릭터 레벨 범위를 확인해 주세요.')
    removed = data.get('removedUnitIds', [])
    if (not isinstance(removed, list) or len(removed) > len(expected)
            or any(type(value) is not int or value not in expected for value in removed)
            or len(set(removed)) != len(removed) or set(expected) - seen != set(removed)):
        raise PublicError('제거할 캐릭터 목록을 확인해 주세요.')
    result['units'] = [unit for unit in result['units'] if unit['id'] not in set(removed)]
    for new in units:
        if new['id'] not in expected:
            result['units'].append({'id':new['id'],'level':1,'plus':0,'highestForm':1,'raw':{'currentForm':0,'unlockedForms':0,'fourthForm':0},'talents':[],'manualAdded':True})
    for u in result['units']:
        new = next(value for value in units if value['id'] == u['id'])
        u.update(level=new['level'], plus=new['plus'])
        if 'form' in new:
            u['displayForm'] = new['form']
        raw = u.get('raw', {})
        source_highest = max(1, raw.get('currentForm',0)+1, 2 if u['level']+u['plus']>=10 else 1,
                             3 if raw.get('unlockedForms')==3 else 1, 4 if raw.get('fourthForm')==2 else 1)
        if 'unlockedForm' in new:
            u['unlockedForm'] = new['unlockedForm']
        u['highestForm'] = u.get('unlockedForm', source_highest)
        if 'form' in new and new['form'] > u['highestForm']:
            raise PublicError('해금한 형태 중 적용 형태를 선택해 주세요.')
    treasures = data['treasures']
    if not isinstance(treasures, list) or len(treasures) != 10:
        raise PublicError('보물 정보를 확인해 주세요.')
    for chapter, values in enumerate(treasures):
        original = profile['treasures'][chapter]
        if not isinstance(values, list) or len(values) != len(original) or any(type(v) is not int for v in values):
            raise PublicError('보물 정보를 확인해 주세요.')
        if chapter == 3:
            if values != original:
                raise PublicError('예약된 보물 기록은 변경할 수 없습니다.')
        elif values[48:] != original[48:] or any(type(v) is not int or not 0 <= v <= 3 for v in values[:48]):
            raise PublicError('보물 등급을 확인해 주세요.')
    result['treasures'] = copy.deepcopy(treasures)
    passives = data['passives']
    if not isinstance(passives, list) or len(passives) != 10 or len(profile.get('passives', [])) != 10:
        raise PublicError('패시브를 불러오려면 계정을 다시 연동해 주세요.')
    seen = set()
    for p in passives:
        if not isinstance(p, dict) or set(p) != {'id','level','plus'} or type(p['id']) is not int or p['id'] not in range(10) or p['id'] in seen:
            raise PublicError('패시브 정보를 확인해 주세요.')
        seen.add(p['id']); limits = metadata['passives'][p['id']]
        for field, maximum in [('level', limits['maxBase']), ('plus', limits['maxPlus'])]:
            if type(p[field]) is not int or not (1 if field == 'level' else 0) <= p[field] <= maximum:
                raise PublicError('패시브 레벨 범위를 확인해 주세요.')
    result['passives'] = sorted(copy.deepcopy(passives), key=lambda p:p['id'])
    if 'inventoryEdits' in data:
        apply_extras(result, data, metadata, SITE, PublicError)
    result['calculatedUserRank'] = sum(u['level']+u['plus'] for u in result['units']) + sum(p['level']+p['plus'] for p in result['passives'])
    if 'profileIcon' in data:
        icon = data['profileIcon']
        if icon is not None:
            if (not isinstance(icon, dict) or set(icon) != {'unitId', 'formIndex'}
                    or type(icon['unitId']) is not int or type(icon['formIndex']) is not int):
                raise PublicError('프로필 아이콘을 확인해 주세요.')
            selected = next((unit for unit in result['units'] if unit['id'] == icon['unitId']), None)
            form = icon['formIndex'] + 1
            if (selected is None or form not in forms.get(icon['unitId'], set())
                    or form > selected['highestForm']):
                raise PublicError('보유 캐릭터의 해금한 형태를 선택해 주세요.')
        result['profileIcon'] = copy.deepcopy(icon)
    result['editedAt'] = datetime.now(timezone.utc).isoformat()
    return result

@app.get('/api/account/stage-rules')
def account_stage_rules():
    identity()
    try:
        return jsonify(stage_rule(SITE, request.args.get('href')))
    except (OSError, ValueError, KeyError, TypeError):
        raise PublicError('지원하는 스테이지인지 확인해 주세요.') from None

@app.post('/api/account/save')
def save_account():
    uid, _, _ = identity()
    limit(('save', uid), 20, 600)
    with gate:
        if uid in import_locks:
            raise PublicError('계정 정보를 저장 중입니다. 잠시 후 다시 시도해 주세요.', 409)
        import_locks.add(uid)
    try:
        status, encrypted = api(object_path(uid), admin=True, binary=True)
        if status != 200:
            raise PublicError('연동한 계정 정보를 찾지 못했습니다.', 404)
        envelope = json.loads(unseal(encrypted, 'account:' + uid))
        current = envelope['profile']
        metadata = json.loads((SITE/'mypage/account-metadata.json').read_text(encoding='utf-8'))
        updated = validate_edits(current, request.get_json(), metadata)
        envelope.setdefault('sourceProfile', copy.deepcopy(current))
        envelope['profile'] = updated
        status, _ = api(object_path(uid), 'POST', seal(json.dumps(envelope).encode(), 'account:' + uid), admin=True, binary=True)
        if status not in (200,201):
            raise PublicError('저장하지 못했습니다. 다시 시도해 주세요.', 502)
        return jsonify({'ok':True,'account':updated,'revision':revision(updated)})
    finally:
        with gate:
            import_locks.discard(uid)

def parse(raw):
    result = subprocess.run([sys.executable, str(ROOT / 'parse_worker.py')], input=raw,
                            stdout=subprocess.PIPE, stderr=subprocess.PIPE, timeout=20, cwd=ROOT)
    if result.returncode or len(result.stdout) > 2 * 1024 * 1024:
        raise PublicError('지원하는 한국판 15.7.0 세이브인지 확인해 주세요.', 422)
    return json.loads(result.stdout)

def fetch_transfer(code, pin):
    """One child per request; secrets never appear in argv, files or diagnostics."""
    payload = bytearray(json.dumps({'code': code, 'pin': pin}).encode())
    code = pin = None
    try:
        result = subprocess.run([sys.executable, str(ROOT / 'transfer_worker.py')], input=payload,
                                stdout=subprocess.PIPE, stderr=subprocess.DEVNULL, timeout=110, cwd=ROOT)
        if result.returncode == 22:
            raise PublicError('게임 데이터를 받지 못했습니다. 이어하기 코드와 인증번호를 확인해 주세요.', 422)
        if result.returncode == 23 or len(result.stdout) > 4 * 1024 * 1024:
            raise PublicError('지원하는 세이브 크기를 초과했습니다.', 422)
        if result.returncode or not result.stdout:
            raise PublicError('게임 서버에 연결하지 못했습니다. 잠시 후 다시 시도해 주세요.', 502)
        return result.stdout
    except subprocess.TimeoutExpired:
        raise PublicError('게임 서버 응답 시간이 초과됐습니다. 자동 재시도하지 않았습니다.', 504) from None
    finally:
        payload[:] = b'\0' * len(payload)

@app.post('/api/account/link')
def link():
    uid, _, _ = identity()
    limit(('link', uid), 3, 600)
    data = code = pin = raw = None
    locked = False
    try:
        # Do not populate Flask's reusable JSON/body cache with transfer secrets.
        data = request.get_json(cache=False)
        if not isinstance(data, dict) or set(data) != {'code', 'pin'} or not all(isinstance(data.get(k), str) for k in ['code', 'pin']):
            raise PublicError('이어하기 코드와 인증번호를 확인해 주세요.')
        code, pin = data['code'].strip(), data['pin'].strip()
        data.clear()
        if not re.fullmatch(r'[A-Za-z0-9_-]{6,32}', code) or not re.fullmatch(r'[0-9]{4}', pin):
            raise PublicError('이어하기 코드와 4자리 인증번호를 확인해 주세요.')
        with gate:
            if uid in import_locks:
                raise PublicError('이미 계정 정보를 불러오는 중입니다.', 409)
            import_locks.add(uid)
            locked = True
        raw = fetch_transfer(code, pin)
        code = pin = None
        received = datetime.now(timezone.utc).isoformat()
        profile = parse(raw)
        raw = None
        profile['receivedAt'] = received
        profile['linkedAt'] = datetime.now(timezone.utc).isoformat()
        # Replace the entire prior envelope (including sourceProfile/manual edits).
        # Persist only allowlisted gameplay data; raw saves may contain game credentials.
        encrypted = seal(json.dumps({'profile': profile}).encode(), 'account:' + uid)
        status, _ = api(object_path(uid), 'POST', encrypted, admin=True, binary=True)
        if status not in (200, 201):
            raise PublicError('계정 데이터를 저장하지 못했습니다. 다시 시도해 주세요.', 502)
        return jsonify({'ok': True, 'account': profile, 'revision': revision(profile)})
    finally:
        if isinstance(data, dict):
            data.clear()
        code = pin = raw = data = None
        request.__dict__.pop('_cached_data', None)
        request._cached_json = (None, None)
        if locked:
            with gate:
                import_locks.discard(uid)

@app.get('/')
@app.get('/<path:path>')
def static(path='index.html'):
    if path.endswith('/'):
        path += 'index.html'
    if any(part.startswith('.') for part in path.split('/')) or path.startswith(('supabase/', 'api/')):
        abort(404)
    return send_from_directory(SITE, path)

if __name__ == '__main__':
    # Loopback only; no debug traces, reloaders or request-body logging.
    import logging
    logging.getLogger('werkzeug').setLevel(logging.ERROR)
    app.run(host='127.0.0.1', port=urlsplit(ORIGIN).port or 8765, threaded=True, debug=False, use_reloader=False)
