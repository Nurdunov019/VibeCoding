#!/usr/bin/env python3
"""Render production entrypoint — use: python3 render_start.py"""
import os
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent
BACKEND = ROOT / "ProverkaKG" / "backend"
sys.path.insert(0, str(BACKEND))
os.chdir(BACKEND)

from main import app  # noqa: E402
import uvicorn  # noqa: E402

if __name__ == "__main__":
    port = int(os.environ.get("PORT", "10000"))
    uvicorn.run(app, host="0.0.0.0", port=port)
