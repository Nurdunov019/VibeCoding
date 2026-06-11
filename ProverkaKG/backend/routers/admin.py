import re
import uuid
from pathlib import Path
from typing import List

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from sqlalchemy.orm import Session

from auth import require_admin
from database import get_db
from models import Complex, Document, User
from schemas import ComplexCreate, ComplexOut, ComplexUpdate, DocumentCreate, DocumentOut, DocumentUpdate
from services.verification import sync_complex_verification

router = APIRouter(prefix="/api/admin", tags=["admin"])

UPLOAD_DIR = Path(__file__).parent.parent / "uploads"
UPLOAD_DIR.mkdir(exist_ok=True)

ALLOWED_IMAGE = {".jpg", ".jpeg", ".png", ".webp", ".gif"}
ALLOWED_DOC = {".pdf"}


@router.post("/upload")
async def upload_file(
    file: UploadFile = File(...),
    kind: str = "image",
    _: User = Depends(require_admin),
):
    ext = Path(file.filename or "").suffix.lower()
    allowed = ALLOWED_IMAGE if kind == "image" else ALLOWED_DOC
    if ext not in allowed:
        raise HTTPException(status_code=400, detail=f"Файл түрү колдоого алынбайт: {ext}")

    subdir = "images" if kind == "image" else "documents"
    dest_dir = UPLOAD_DIR / subdir
    dest_dir.mkdir(exist_ok=True)

    filename = f"{uuid.uuid4().hex}{ext}"
    path = dest_dir / filename
    content = await file.read()
    if len(content) > 10 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="Файл 10MBдан чоң")

    path.write_bytes(content)
    return {"url": f"/uploads/{subdir}/{filename}", "filename": filename}


@router.get("/complexes", response_model=List[ComplexOut])
def admin_list_complexes(
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
):
    return db.query(Complex).order_by(Complex.name).all()


@router.post("/complexes", response_model=ComplexOut)
def create_complex(
    data: ComplexCreate,
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
):
    if db.query(Complex).filter(Complex.slug == data.slug).first():
        raise HTTPException(status_code=400, detail="Slug ээлеген")
    c = Complex(**data.model_dump())
    db.add(c)
    db.commit()
    db.refresh(c)
    return c


@router.put("/complexes/{complex_id}", response_model=ComplexOut)
def update_complex(
    complex_id: int,
    data: ComplexUpdate,
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
):
    c = db.query(Complex).filter(Complex.id == complex_id).first()
    if not c:
        raise HTTPException(status_code=404, detail="Объект табылган жок")
    for key, value in data.model_dump(exclude_unset=True).items():
        setattr(c, key, value)
    db.commit()
    db.refresh(c)
    return c


@router.delete("/complexes/{complex_id}")
def delete_complex(
    complex_id: int,
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
):
    c = db.query(Complex).filter(Complex.id == complex_id).first()
    if not c:
        raise HTTPException(status_code=404, detail="Объект табылган жок")
    db.delete(c)
    db.commit()
    return {"ok": True}


@router.post("/complexes/{complex_id}/recalculate", response_model=ComplexOut)
def recalculate_rating(
    complex_id: int,
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
):
    c = sync_complex_verification(complex_id, db)
    if not c:
        raise HTTPException(status_code=404, detail="Объект табылган жок")
    return c


@router.get("/complexes/{complex_id}/documents", response_model=List[DocumentOut])
def admin_complex_documents(
    complex_id: int,
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
):
    c = db.query(Complex).filter(Complex.id == complex_id).first()
    if not c:
        raise HTTPException(status_code=404, detail="Объект табылган жок")
    return db.query(Document).filter(Document.complex_id == complex_id).order_by(Document.doc_type).all()


@router.post("/complexes/{complex_id}/documents", response_model=DocumentOut)
def create_document(
    complex_id: int,
    data: DocumentCreate,
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
):
    c = db.query(Complex).filter(Complex.id == complex_id).first()
    if not c:
        raise HTTPException(status_code=404, detail="Объект табылган жок")
    doc = Document(complex_id=complex_id, **data.model_dump())
    db.add(doc)
    db.commit()
    db.refresh(doc)
    sync_complex_verification(complex_id, db)
    return doc


@router.put("/documents/{doc_id}", response_model=DocumentOut)
def update_document(
    doc_id: int,
    data: DocumentUpdate,
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
):
    doc = db.query(Document).filter(Document.id == doc_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Документ табылган жок")
    for key, value in data.model_dump(exclude_unset=True).items():
        setattr(doc, key, value)
    db.commit()
    db.refresh(doc)
    sync_complex_verification(doc.complex_id, db)
    return doc


@router.delete("/documents/{doc_id}")
def delete_document(
    doc_id: int,
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
):
    doc = db.query(Document).filter(Document.id == doc_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Документ табылган жок")
    complex_id = doc.complex_id
    db.delete(doc)
    db.commit()
    sync_complex_verification(complex_id, db)
    return {"ok": True}
