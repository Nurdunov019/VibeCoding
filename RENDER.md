# Render deploy — ProverkaKG

## Быстрая настройка (proverkakg сервис)

1. [dashboard.render.com](https://dashboard.render.com) → **proverkakg** → **Settings**
2. **Repository** → `Nurdunov019/VibeCoding` (ветка `main`)
3. **Root Directory** — оставьте **пустым** (корень репо)
4. **Runtime** — `Docker` (рекомендуется) **или** `Python` (см. ниже)
5. **Auto-Deploy** → **On**
6. **Manual Deploy** → **Deploy latest commit**

## Вариант A — Docker (рекомендуется)

| Поле | Значение |
|------|----------|
| Runtime | Docker |
| Dockerfile Path | `./Dockerfile` |
| Docker Context | `.` |

## Вариант B — Python

| Поле | Значение |
|------|----------|
| Runtime | Python 3 |
| Root Directory | *(пусто)* |
| Build Command | `./build.sh` |
| Start Command | `cd ProverkaKG/backend && uvicorn main:app --host 0.0.0.0 --port $PORT` |

Environment:

| Key | Value |
|-----|-------|
| `PYTHON_VERSION` | `3.11.0` |
| `NODE_VERSION` | `20` |
| `SECRET_KEY` | *(случайный)* |
| `ADMIN_PASSWORD` | *(сильный пароль)* |
| `ADMIN_EMAIL` | `admin@proverkakg.kg` |
| `DATABASE_URL` | `sqlite:///./proverkakg.db` |

## Проверка после deploy

```bash
curl https://proverkakg.onrender.com/api/health
```

В ответе должно быть `"build": "..."` с сегодняшней датой.  
В HTML страницы `index-*.js` — новый hash (не `index-Bt7z472d.js`).
