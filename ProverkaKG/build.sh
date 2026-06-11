#!/bin/bash
set -e
ROOT="$(cd "$(dirname "$0")" && pwd)"

echo "=== ProverkaKG production build ==="
cd "$ROOT/backend"
pip install -r requirements.txt -q

cd "$ROOT/frontend"
npm ci
npm run build

echo "✓ Frontend built to frontend/dist"
echo "✓ Start: cd backend && uvicorn main:app --host 0.0.0.0 --port 8002"
