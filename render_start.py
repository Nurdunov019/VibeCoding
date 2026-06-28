#!/usr/bin/env python3
"""Render production entrypoint — use: python3 render_start.py"""
import os
from pathlib import Path

import uvicorn

ROOT = Path(__file__).resolve().parent
BACKEND = ROOT / "ProverkaKG" / "backend"
os.chdir(BACKEND)

if __name__ == "__main__":
    port = int(os.environ.get("PORT", "10000"))
    uvicorn.run("main:app", host="0.0.0.0", port=port)
