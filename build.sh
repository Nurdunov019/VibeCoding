#!/bin/bash
# Render build entrypoint when repo root is VibeCoding (Root Directory empty).
set -euo pipefail
ROOT="$(cd "$(dirname "$0")" && pwd)"
exec "$ROOT/ProverkaKG/build.sh"
