#!/bin/bash
set -euo pipefail
cd "$(dirname "$0")/backend"
exec python3 -m uvicorn main:app --host 0.0.0.0 --port "${PORT:-10000}"
