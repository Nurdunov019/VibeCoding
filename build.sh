#!/bin/bash
set -e
ROOT="$(cd "$(dirname "$0")" && pwd)"

echo "=== ProverkaKG production build ==="
cd "$ROOT/backend"
python3 -m pip install -r requirements.txt
python3 -c "import uvicorn; import fastapi; print('Python deps OK')"

cd "$ROOT/frontend"
rm -rf dist
npm ci
npm run build

echo "✓ Frontend built to frontend/dist"
