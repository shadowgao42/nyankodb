"""Compile the existing stage HTML validation rules for the serverless bundle."""
import argparse
import hashlib
import json
from pathlib import Path

from profile_editing import _catalog, _stage_rule


def build(site):
    catalog_path = site / 'catalog.js'
    catalog = _catalog(str(catalog_path), catalog_path.stat().st_mtime_ns)
    result = {}
    for entry in catalog['entries']:
        href = entry.get('href', '')
        if entry.get('kind') != 'stage' or not href.endswith('.html') or href.endswith('/index.html'):
            continue
        path = site / href
        if not path.resolve().is_relative_to(site.resolve()):
            raise ValueError('Invalid stage path')
        result[href] = _stage_rule(str(path), path.stat().st_mtime_ns)
    # Normalize text newlines so Windows checkout and Linux deployment agree.
    return {'schemaVersion': 1, 'catalogSHA256': hashlib.sha256(catalog_path.read_text(encoding='utf-8').encode('utf-8')).hexdigest(), 'stages': result}


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--site', type=Path, required=True)
    args = parser.parse_args()
    value = build(args.site)
    target = args.site / 'mypage/account-stage-rules.json'
    target.write_text(json.dumps(value, ensure_ascii=False, separators=(',', ':')) + '\n', encoding='utf-8')
    print(f"Compiled {len(value['stages'])} existing stage rule sets without changing their interpretation")
