"""Refresh medal/combo search metadata without rebuilding existing catalogues."""
import argparse
import json
from pathlib import Path

SEARCH_PREFIX = 'window.NYANKODB_SEARCH_CATALOG = '
COMBO_PREFIX = 'window.NYANKODB_COMBO_CATALOG = '


def read_script(path, prefix):
    source = path.read_text(encoding='utf-8-sig').strip()
    if not source.startswith(prefix):
        raise ValueError(f'Unexpected catalogue declaration: {path}')
    payload, end = json.JSONDecoder().raw_decode(source[len(prefix):])
    if source[len(prefix) + end:].strip() != ';' or not isinstance(payload, dict):
        raise ValueError(f'Unexpected catalogue payload: {path}')
    return payload


def build_extra_catalogs(site_root):
    site_root = Path(site_root)
    medal_path = site_root / 'medal/catalog.json'
    combo_path = site_root / 'unit/nyancombo-data.js'
    medals = json.loads(medal_path.read_text(encoding='utf-8-sig'))['entries'] if medal_path.is_file() else []
    combos = read_script(combo_path, COMBO_PREFIX)['combos'] if combo_path.is_file() else []
    result = {'medals': [], 'combos': []}
    for kind, records in [('medal', medals), ('combo', combos)]:
        seen = set()
        for record in records:
            identity, name = record['id'], record['name']
            if type(identity) is not int or identity < 0 or identity in seen or not isinstance(name, str) or not name.strip():
                raise ValueError(f'Invalid or duplicate {kind} search record.')
            seen.add(identity)
            icon = record['icon'].removeprefix('../') if kind == 'medal' else 'img/icon/combo.png'
            result[kind + 's'].append({
                'kind': kind, 'id': identity, 'name': name, 'icon': icon,
                'href': f'{kind}/index.html#{kind}-{identity}',
            })
    return result


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--site', type=Path, default=Path(__file__).resolve().parents[1])
    parser.add_argument('--output', type=Path)
    args = parser.parse_args()
    site = args.site.resolve()
    # A partial update must preserve the last complete metadata on missing input.
    for rel in ['medal/catalog.json', 'unit/nyancombo-data.js']:
        if not (site / rel).is_file():
            raise FileNotFoundError(site / rel)
    catalog = read_script(site / 'catalog.js', SEARCH_PREFIX)
    catalog.update(build_extra_catalogs(site))
    output = args.output or site / 'catalog.js'
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text(SEARCH_PREFIX + json.dumps(catalog, ensure_ascii=False, separators=(',', ':')) + ';\n', encoding='utf-8')
    print(json.dumps({'medals': len(catalog['medals']), 'combos': len(catalog['combos'])}))


if __name__ == '__main__':
    main()
