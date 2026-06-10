import os
from pathlib import Path
from functools import lru_cache

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

from database import Base, engine, SessionLocal
from seed import seed_database
from routers import auth, charts, chat, groups, internal, progress, ranking, reports, telegram, users

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Quran Tracker API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(groups.router)
app.include_router(progress.router)
app.include_router(ranking.router)
app.include_router(charts.router)
app.include_router(reports.router)
app.include_router(telegram.router)
app.include_router(internal.router)
app.include_router(users.router)
app.include_router(chat.router)

FRONTEND_DIR = Path(__file__).parent.parent / "frontend" / "dist"


@app.on_event("startup")
def on_startup():
    db = SessionLocal()
    try:
        seed_database(db)
    finally:
        db.close()


@app.get("/api/health")
def health():
    return {"status": "ok", "timezone": os.getenv("TZ", "Asia/Bishkek")}


@app.get("/api/config")
def config():
    bot_username = os.getenv("TELEGRAM_BOT_USERNAME", "")
    return {
        "telegram_bot_username": bot_username,
        "telegram_enabled": bool(os.getenv("TELEGRAM_BOT_TOKEN")),
    }


if FRONTEND_DIR.exists():
    app.mount("/assets", StaticFiles(directory=FRONTEND_DIR / "assets"), name="assets")

    @app.get("/{full_path:path}")
    def serve_spa(full_path: str):
        if full_path.startswith("api/"):
            return {"detail": "Not found"}
        file_path = FRONTEND_DIR / full_path
        if file_path.is_file():
            return FileResponse(file_path)
        return FileResponse(FRONTEND_DIR / "index.html")
