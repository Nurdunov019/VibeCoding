# Render deploy — ProverkaKG

## Start Command (гана БИР сап, башка эч нерсе жок!)

```
python3 render_start.py
```

❌ `start-render.sh` ичиндеги кодду чаптамаңыз  
❌ `set -euo pipefail` жазбаңыз

## Build Command

```
./build.sh
```

## Root Directory

бош калтырыңыз

## Environment

| Key | Value |
|-----|-------|
| `PYTHON_VERSION` | `3.11.0` |
| `NODE_VERSION` | `20` |
| `SECRET_KEY` | узун кокусуз текст |
| `ADMIN_PASSWORD` | сиздин пароль |
| `ADMIN_EMAIL` | `admin@proverkakg.kg` |
| `DATABASE_URL` | `sqlite:///./proverkakg.db` |

## Текшерүү

```bash
curl https://СИЗДИН-URL.onrender.com/api/health
```
