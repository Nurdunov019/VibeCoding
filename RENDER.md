# Render deploy — ProverkaKG

## Render'де так коюңуз (Python 3)

| Талаа | Маани |
|-------|-------|
| **Root Directory** | *(бош)* |
| **Build Command** | `./build.sh` |
| **Start Command** | `cd ProverkaKG/backend && python3 -m uvicorn main:app --host 0.0.0.0 --port $PORT` |

Start Command'ду скриптсиз түз жазыңыз — `./start-render.sh` Render'де табылбай калышы мүмкүн.

## Environment

| Key | Value |
|-----|-------|
| `PYTHON_VERSION` | `3.11.0` |
| `NODE_VERSION` | `20` |
| `SECRET_KEY` | *(кокусуз узун текст)* |
| `ADMIN_PASSWORD` | *(сиздин пароль)* |
| `ADMIN_EMAIL` | `admin@proverkakg.kg` |
| `DATABASE_URL` | `sqlite:///./proverkakg.db` |

## Текшерүү

```bash
curl https://СИЗДИН-URL.onrender.com/api/health
```

`"build": "2026-06-27-docker1"`
