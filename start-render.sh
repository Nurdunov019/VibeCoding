#!/bin/bash
# Render start command (Python runtime only).
set -euo pipefail
ROOT="$(cd "$(dirname "$0")" && pwd)"
cd "$ROOT/ProverkaKG/backend"
exec python3 -m uvicorn main:app --host 0.0.0.0 --port "${PORT:-10000}"
