#!/bin/bash
set -e
ROOT="$(cd "$(dirname "$0")" && pwd)"

echo "=== ProverkaKG иштетүү ==="

# Backend
cd "$ROOT/backend"
if [ ! -d "venv" ]; then
  python3 -m venv venv
fi
source venv/bin/activate
pip install -r requirements.txt -q

echo "Backend: http://localhost:8002"
uvicorn main:app --reload --port 8002 &
BACK_PID=$!

# Frontend
cd "$ROOT/frontend"
if [ ! -d "node_modules" ]; then
  npm install
fi

echo "Frontend: http://localhost:3000"
npm run dev &
FRONT_PID=$!

echo ""
echo "✓ Сайт: http://localhost:3000"
echo "✓ API:  http://localhost:8002/docs"
echo "Токтотуу: kill $BACK_PID $FRONT_PID"

wait
