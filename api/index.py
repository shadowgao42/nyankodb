"""Same-origin deployment entry point for the existing NyankoDB account server."""
import os
from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parents[1]
os.environ['NYANKODB_SITE_ROOT'] = str(ROOT)
sys.path.insert(0, str(ROOT / 'account_service'))
from server import app
