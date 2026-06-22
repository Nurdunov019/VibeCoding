from pathlib import Path

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

from sqlalchemy import inspect, text

from database import Base, engine, SessionLocal
from seed import seed_database
from routers import admin, auth, complexes, documents, legal, reviews

Base.metadata.create_all(bind=engine)


def migrate_db():
    insp = inspect(engine)
    if not insp.has_table("complexes"):
        return
    cols = {c["name"] for c in insp.get_columns("complexes")}
    migrations = [
        ("region", "ALTER TABLE complexes ADD COLUMN region VARCHAR DEFAULT 'bishkek'"),
        ("catalog_pdf_url", "ALTER TABLE complexes ADD COLUMN catalog_pdf_url VARCHAR"),
        ("features", "ALTER TABLE complexes ADD COLUMN features TEXT"),
        ("entrances_count", "ALTER TABLE complexes ADD COLUMN entrances_count INTEGER"),
        ("initial_payment_percent", "ALTER TABLE complexes ADD COLUMN initial_payment_percent FLOAT"),
        ("barter_extra_usd_sqm", "ALTER TABLE complexes ADD COLUMN barter_extra_usd_sqm FLOAT"),
        ("barter_min_payment_percent", "ALTER TABLE complexes ADD COLUMN barter_min_payment_percent FLOAT"),
        ("installment_months", "ALTER TABLE complexes ADD COLUMN installment_months INTEGER"),
        ("has_red_book", "ALTER TABLE complexes ADD COLUMN has_red_book BOOLEAN DEFAULT 0"),
    ]
    for col, sql in migrations:
        if col not in cols:
            with engine.begin() as conn:
                conn.execute(text(sql))
    with engine.begin() as conn:
        conn.execute(text("UPDATE complexes SET region = 'manas' WHERE region = 'jalal-abad'"))


migrate_db()

app = FastAPI(title="ProverkaKG API", version="1.0.0", description="Платформа проверки объектов недвижимости")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(admin.router)
app.include_router(complexes.router)
app.include_router(documents.router)
app.include_router(legal.router)
app.include_router(reviews.router)

UPLOADS_DIR = Path(__file__).parent / "uploads"
UPLOADS_DIR.mkdir(exist_ok=True)
app.mount("/uploads", StaticFiles(directory=UPLOADS_DIR), name="uploads")


@app.on_event("startup")
def on_startup():
    db = SessionLocal()
    try:
        seed_database(db)
    finally:
        db.close()


@app.get("/api/health")
def health():
    return {"status": "ok", "service": "ProverkaKG"}


FRONTEND_DIR = Path(__file__).parent.parent / "frontend" / "dist"

NO_CACHE_HEADERS = {
    "Cache-Control": "no-cache, no-store, must-revalidate",
    "Pragma": "no-cache",
    "Expires": "0",
}
ASSET_CACHE_HEADERS = {"Cache-Control": "public, max-age=31536000, immutable"}


if FRONTEND_DIR.exists():

    @app.get("/assets/{asset_path:path}")
    def serve_asset(asset_path: str):
        fp = FRONTEND_DIR / "assets" / asset_path
        if not fp.is_file():
            raise HTTPException(status_code=404)
        return FileResponse(fp, headers=ASSET_CACHE_HEADERS)

    @app.get("/{full_path:path}")
    def spa(full_path: str):
        if full_path.startswith("api/"):
            raise HTTPException(status_code=404)
        fp = FRONTEND_DIR / full_path
        if fp.is_file():
            return FileResponse(fp, headers=NO_CACHE_HEADERS)
        return FileResponse(FRONTEND_DIR / "index.html", headers=NO_CACHE_HEADERS)
else:

    @app.get("/")
    def root():
        return {"message": "ProverkaKG API", "docs": "/docs"}
