"""Export native medals in native display (line) order, using Korean labels before Japanese."""
import argparse
import hashlib
import html
import json
from pathlib import Path
import re


def load(root):
    listing = root / 'DataLocal/medallist.json'
    names = root / 'resLocal/medalname.tsv'
    records = json.loads(listing.read_text(encoding='utf-8-sig'))['iconID']
    labels = [line.split('\t', 1) for line in names.read_text(encoding='utf-8-sig').splitlines()]
    if len(labels) != len(records) or any(len(row) != 2 for row in labels):
        raise ValueError('Native medal names and definitions do not align.')
    return records, labels, {listing.name: hashlib.sha256(listing.read_bytes()).hexdigest(), names.name: hashlib.sha256(names.read_bytes()).hexdigest()}


def text(value):
    return html.unescape(re.sub(r'<br\s*/?>', '\n', value, flags=re.I)).strip()


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--kr-root', required=True, type=Path)
    parser.add_argument('--jp-root', required=True, type=Path)
    parser.add_argument('--site', type=Path, default=Path(__file__).resolve().parents[1])
    parser.add_argument('--output', type=Path)
    args = parser.parse_args()
    kr, ko, kh = load(args.kr_root)
    jp, ja, jh = load(args.jp_root)
    entries = []
    for identity in range(max(len(kr), len(jp))):
        native = kr[identity] if identity < len(kr) else jp[identity]
        korean = ko[identity] if identity < len(ko) else ['', '']
        japanese = ja[identity] if identity < len(ja) else ['', '']
        name, description = [text(a or b) for a, b in zip(korean, japanese)]
        if not name:
            raise ValueError('A native medal has no label.')
        icon = f'img/medal/medal_{identity:03}.png'
        entries.append({'id': identity, 'name': name, 'description': description, 'icon': '../' + icon, 'grade': native.get('grade'), 'native': native})
    # iconID array indexes identify medals; line controls their display order.
    if any(type(entry['native'].get('line')) is not int for entry in entries):
        raise ValueError('A native medal has no valid display order (line).')
    entries.sort(key=lambda entry: (entry['native']['line'], entry['id']))
    result = {'schemaVersion': 1, 'sources': {'kr': kh, 'jp': jh}, 'entries': entries}
    output = args.output or args.site / 'medal/catalog.json'
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text(json.dumps(result, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    missing = [entry['id'] for entry in entries if not (args.site / entry['icon'].removeprefix('../')).is_file()]
    print(json.dumps({'medals': len(entries), 'missingImageIds': missing}))


if __name__ == '__main__':
    main()
