# Render deploy — ProverkaKG

## ⚠️ МААНИЛҮҮ: Node эмес, Python!

Логдо `Using Node.js version` көрүнсө — сервис **Node** режиминде.  
`uvicorn: command not found` — ошондуктан чыгат.

**Settings** → **Environment** (же **Build & Deploy**) → **Language / Runtime** → **Python 3**

---

## Render'де так коюңуз

**Settings** → **Build & Deploy**:

| Талаа | Маани |
|-------|-------|
| **Root Directory** | *(бош)* |
| **Build Command** | `./build.sh` |
| **Start Command** | `./start-render.sh` |

❌ Build Command'ка `build.sh` ичиндеги кодду чаптамаңыз — гана `./build.sh` жазыңыз!

**Environment**:

| Key | Value |
|-----|-------|
| `PYTHON_VERSION` | `3.11.0` |
| `NODE_VERSION` | `20` |
| `SECRET_KEY` | *(кокусуз узун текст)* |
| `ADMIN_PASSWORD` | *(сиздин пароль)* |
| `ADMIN_EMAIL` | `admin@proverkakg.kg` |
| `DATABASE_URL` | `sqlite:///./proverkakg.db` |

**Manual Deploy** → **Deploy latest commit**

---

## Ийгиликтүү deploy

Build логдо көрүнүшү керек:
- `Python deps OK`
- `✓ built in` (Vite)
- `Using Python version` (Node эмес!)

Текшерүү:
```bash
curl https://proverkakg.onrender.com/api/health
```
`"build": "2026-06-27-docker1"`

---

## Docker (милдеттүү эмес)

Жаңы Web Service түзгөндө гана көрүнөт. Python жетиштүү.
