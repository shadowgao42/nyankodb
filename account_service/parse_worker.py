"""Isolated offline parser. Input raw save bytes, output allowlisted gameplay JSON."""
import hashlib
import importlib.util
import json
import os
from pathlib import Path
import socket
import struct
import subprocess
import sys
from types import ModuleType, SimpleNamespace

sys.dont_write_bytecode = True
ROOT = Path(__file__).resolve().parent
sys.path.insert(0, str(ROOT / 'vendor' / 'src'))
def deny(*args, **kwargs):
    raise RuntimeError('Offline parser')
for name, functions in [('jwt', ['encode', 'decode']), ('yaml', ['safe_load', 'dump'])]:
    if importlib.util.find_spec(name) is None:
        module = ModuleType(name)
        for fn in functions:
            setattr(module, fn, deny)
        module.YAMLError = type('YAMLError', (Exception,), {})
        sys.modules[name] = module
socket.socket.connect = socket.socket.connect_ex = socket.create_connection = deny
subprocess.Popen = deny
os.system = lambda *args: 0
from bcsfe import core
core.core_data.config = SimpleNamespace(get_bool=lambda *a: False)
core.core_data.local_manager = SimpleNamespace(get_key=lambda key, *a, **kw: key)
data = sys.stdin.buffer.read(4 * 1024 * 1024 + 1)
if not 1000 < len(data) <= 4 * 1024 * 1024 or struct.unpack_from('<i', data)[0] != 150700:
    raise ValueError('Supported save: KR 15.7.0 only')
if hashlib.md5(b'battlecatskr' + data[:-32]).hexdigest().encode() != data[-32:]:
    raise ValueError('Save checksum mismatch')
original = core.Data.read_bytes
def bounded(self, n):
    if n < 0 or not 0 <= self.pos <= self.pos + n <= len(self.data):
        raise ValueError('Invalid save bounds')
    return original(self, n)
core.Data.read_bytes = bounded
p = core.SaveFile(core.Data(data), cc=core.CountryCode('kr'), load=False)
p.load()
units = []
for c in p.cats.cats:
    if not c.unlocked:
        continue
    level = c.upgrade.base + 1
    # Selection is independent of unlock flags. Keep raw evidence for uncertain states.
    highest = max(1, c.current_form + 1)
    if level + c.upgrade.plus >= 10:
        highest = max(highest, 2)
    if c.unlocked_forms == 3:
        highest = max(highest, 3)
    if c.fourth_form == 2:
        highest = max(highest, 4)
    units.append({'id': c.id, 'level': level, 'plus': c.upgrade.plus, 'highestForm': highest,
                  'raw': {'currentForm': c.current_form, 'unlockedForms': c.unlocked_forms, 'fourthForm': c.fourth_form},
                  'talents': [t.serialize() for t in c.talents or []]})
from profile_extras import inventory_values, cleared_stages, owned_medals
result = {'version': '15.7.0', 'region': 'kr', 'sha256': hashlib.sha256(data).hexdigest(),
          'inventory': inventory_values(p), 'clearedStages': cleared_stages(p), 'medals': owned_medals(p),
          'stats': {k: getattr(p, k) for k in ['catfood', 'xp', 'current_energy', 'leadership']},
          'clubProfile': {'unitId': p.officer_pass.cat_id, 'formIndex': p.officer_pass.cat_form},
          'calculatedUserRank': p.calculate_user_rank(), 'units': units,
          'passives': [{'id': i, 'level': skill.upgrade.base + 1, 'plus': skill.upgrade.plus}
                       for i, skill in enumerate(p.special_skills.get_valid_skills())],
          'treasures': [[s.treasure for s in ch.get_treasure_stages()] for ch in p.story.chapters],
          'clearCounts': [[s.clear_times for s in ch.stages] for ch in p.story.chapters]}
sys.stdout.write(json.dumps(result, ensure_ascii=True))
