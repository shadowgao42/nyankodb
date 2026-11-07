"""Validate manual DB edits against deployed catalogs, never against game APIs."""
import copy
from functools import lru_cache
import hashlib
import json
from pathlib import Path
import re

MAX_AMOUNT = 2_147_483_647
MAX_STAGE_EDITS = 4096

@lru_cache(maxsize=4)
def _catalog(path, modified):
    text = Path(path).read_text(encoding='utf-8')
    return json.loads(text[text.index('{'):text.rindex('}') + 1])

def known_units(site, forms=False):
    path = site / 'unit/catalog.js'
    entries = _catalog(str(path), path.stat().st_mtime_ns)['entries']
    if forms:
        result = {}
        for entry in entries:
            result.setdefault(entry['id'], set()).add(entry['form'])
        return result
    return {entry['id'] for entry in entries}

@lru_cache(maxsize=256)
def _stage_rule(path, modified):
    text = Path(path).read_text(encoding='utf-8')
    match = re.search(r'const DATA\s*=\s*', text)
    if not match:
        raise ValueError('Missing stage data')
    data = json.JSONDecoder().raw_decode(text[match.end():])[0]
    if data.get('location'):
        raise ValueError('A location is not a stage')
    boolean = bool(data.get('zombieSource'))
    story = data.get('story')
    chapters = []
    if story and not boolean:
        offset = [0, 4, 7][story['family']]
        chapters = [{'value': ch['chapter'] - 1 + offset, 'label': f"{ch['chapter']}장"}
                    for ch in story['chapters']]
    crowns = list(range(1, len(data.get('crownMagnifications') or [100]) + 1))
    required = data.get('stage', {}).get('requiredCrown')
    if type(required) is int and required in crowns:
        crowns = [required]
    return {'boolean': boolean, 'chapters': chapters, 'crowns': [1] if chapters or boolean else crowns}

@lru_cache(maxsize=4)
def _compiled_stage_rules(path, modified, catalog_path, catalog_modified):
    value = _catalog(path, modified)
    if value.get('schemaVersion') != 1 or value.get('catalogSHA256') != hashlib.sha256(Path(catalog_path).read_text(encoding='utf-8').encode('utf-8')).hexdigest():
        return None
    return value['stages']

def stage_rule(site, href):
    if not isinstance(href, str) or len(href) > 180:
        raise ValueError('Invalid stage')
    catalog_path = site / 'catalog.js'
    entries = _catalog(str(catalog_path), catalog_path.stat().st_mtime_ns)['entries']
    # Catalog membership also excludes path traversal, URLs and map index pages.
    if not any(e.get('kind') == 'stage' and e.get('href') == href and not href.endswith('/index.html') for e in entries):
        raise ValueError('Unknown stage')
    # Vercel functions use the same rules compiled from the public stage HTML.
    # Do not bundle the entire stage site into the server function.
    snapshot = site / 'mypage/account-stage-rules.json'
    if snapshot.is_file():
        rules = _compiled_stage_rules(str(snapshot), snapshot.stat().st_mtime_ns, str(catalog_path), catalog_path.stat().st_mtime_ns)
        if rules is not None:
            if href not in rules:
                raise ValueError('Unknown stage rules')
            return copy.deepcopy(rules[href])
    path = site / href
    if not path.resolve().is_relative_to(site.resolve()):
        raise ValueError('Invalid stage path')
    return copy.deepcopy(_stage_rule(str(path), path.stat().st_mtime_ns))

def stage_identity(row):
    return row['href'], row.get('chapter'), row.get('crown', 1)

def apply_extras(result, data, metadata, site, error):
    inventory = data.get('inventoryEdits', {})
    allowed = {str(item['id']) for group in metadata['inventoryGroups'] for item in group['items']}
    if not isinstance(inventory, dict) or len(inventory) > len(allowed) or not set(inventory).issubset(allowed):
        raise error('아이템 정보를 확인해 주세요.')
    values = copy.deepcopy(result.get('inventory') or {})
    for key, value in inventory.items():
        if type(value) is not int or not 0 <= value <= MAX_AMOUNT:
            raise error('아이템 수량 범위를 확인해 주세요.')
        values[key] = value
        stat = {'6': 'xp', '22': 'catfood', '105': 'leadership'}.get(key)
        if stat and isinstance(result.get('stats'), dict):
            result['stats'][stat] = value
    if inventory:
        result['inventory'] = values

    edits = data.get('stageEdits', [])
    if not isinstance(edits, list) or len(edits) > MAX_STAGE_EDITS:
        raise error('스테이지 변경 수를 확인해 주세요.')
    records = copy.deepcopy(result.get('clearedStages') or [])
    seen = set()
    for row in edits:
        if not isinstance(row, dict):
            raise error('스테이지 정보를 확인해 주세요.')
        try:
            rule = stage_rule(site, row.get('href'))
        except (OSError, ValueError, KeyError, TypeError):
            raise error('지원하는 스테이지인지 확인해 주세요.') from None
        fields = {'href', 'count', 'crown'} | ({'chapter'} if rule['chapters'] else set()) | ({'cleared'} if rule['boolean'] else set())
        if set(row) != fields or type(row['crown']) is not int or row['crown'] not in rule['crowns']:
            raise error('스테이지 성급을 확인해 주세요.')
        if rule['chapters'] and (type(row['chapter']) is not int or row['chapter'] not in [c['value'] for c in rule['chapters']]):
            raise error('스테이지 장을 확인해 주세요.')
        if rule['boolean']:
            if row['count'] is not None or type(row['cleared']) is not bool:
                raise error('스테이지 클리어 여부를 확인해 주세요.')
        elif type(row['count']) is not int or not 0 <= row['count'] <= MAX_AMOUNT:
            raise error('클리어 횟수 범위를 확인해 주세요.')
        identity = stage_identity(row)
        if identity in seen:
            raise error('같은 스테이지 기록이 중복됐습니다.')
        seen.add(identity)
        updated = {**copy.deepcopy(row), 'manualEdit': True}
        index = next((i for i, old in enumerate(records) if stage_identity(old) == identity), None)
        if index is None:
            records.append(updated)
        else:
            records[index] = updated
    if edits:
        result['clearedStages'] = records
