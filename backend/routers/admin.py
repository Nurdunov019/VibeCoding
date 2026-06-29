import re
import uuid
from pathlib import Path
from typing import List, Optional

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from pydantic import BaseModel
from sqlalchemy.orm import Session

from auth import require_admin
from database import get_db
from messages import COMPLEX_NOT_FOUND, DOCUMENT_NOT_FOUND, FILE_TOO_LARGE, FILE_TYPE_UNSUPPORTED, SLUG_TAKEN
from models import Complex, Document, LegalReport, User
from schemas import ComplexCreate, ComplexOut, ComplexUpdate, DocumentCreate, DocumentOut, DocumentUpdate
from services.verification import sync_complex_verification

router = APIRouter(prefix="/api/admin", tags=["admin"])

UPLOAD_DIR = Path(__file__).parent.parent / "uploads"
UPLOAD_DIR.mkdir(exist_ok=True)

ALLOWED_IMAGE = {".jpg", ".jpeg", ".png", ".webp", ".gif"}
ALLOWED_DOC = {".pdf"}
ALLOWED_LEGAL = {".docx", ".pdf"}


class LegalFilePayload(BaseModel):
    file_path: str


@router.post("/upload")
async def upload_file(
    file: UploadFile = File(...),
    kind: str = "image",
    slug: Optional[str] = None,
    _: User = Depends(require_admin),
):
    ext = Path(file.filename or "").suffix.lower()
    if kind == "image":
        allowed = ALLOWED_IMAGE
        subdir = "images"
    elif kind == "catalog":
        allowed = ALLOWED_DOC
        subdir = "catalogs"
    elif kind == "legal":
        allowed = ALLOWED_LEGAL
        subdir = "documents"
    else:
        allowed = ALLOWED_DOC
        subdir = "documents"
    if ext not in allowed:
        raise HTTPException(status_code=400, detail=FILE_TYPE_UNSUPPORTED.format(ext=ext))

    content = await file.read()
    if len(content) > 10 * 1024 * 1024:
        raise HTTPException(status_code=400, detail=FILE_TOO_LARGE)

    if kind == "image" and slug:
        safe_slug = re.sub(r"[^a-z0-9-]", "", slug.lower())
        if not safe_slug:
            raise HTTPException(status_code=400, detail="Invalid slug")
        filename = f"{safe_slug}{ext}"
        repo_root = Path(__file__).parent.parent.parent
        for images_dir in (repo_root / "frontend" / "public" / "images", repo_root / "frontend" / "dist" / "images"):
            images_dir.mkdir(parents=True, exist_ok=True)
            (images_dir / filename).write_bytes(content)
        return {"url": f"/images/{filename}", "filename": filename}

    dest_dir = UPLOAD_DIR / subdir
    dest_dir.mkdir(exist_ok=True)

    filename = f"{uuid.uuid4().hex}{ext}"
    path = dest_dir / filename
    path.write_bytes(content)
    return {"url": f"/uploads/{subdir}/{filename}", "filename": filename}


@router.get("/complexes", response_model=List[ComplexOut])
def admin_list_complexes(
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
):
    complexes = db.query(Complex).order_by(Complex.name).all()
    if not complexes:
        return complexes
    by_id = {c.id: c for c in complexes}
    rows = (
        db.query(LegalReport.complex_id, LegalReport.file_path)
        .filter(LegalReport.complex_id.in_(by_id.keys()))
        .all()
    )
    for complex_id, file_path in rows:
        if file_path:
            setattr(by_id[complex_id], "legal_doc_url", file_path)
    return complexes


@router.post("/complexes", response_model=ComplexOut)
def create_complex(
    data: ComplexCreate,
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
):
    if db.query(Complex).filter(Complex.slug == data.slug).first():
        raise HTTPException(status_code=400, detail=SLUG_TAKEN)
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
        raise HTTPException(status_code=404, detail=COMPLEX_NOT_FOUND)
    for key, value in data.model_dump(exclude_unset=True).items():
        setattr(c, key, value)
    db.commit()
    db.refresh(c)
    report = db.query(LegalReport).filter(LegalReport.complex_id == c.id).first()
    if report and report.file_path:
        setattr(c, "legal_doc_url", report.file_path)
    return c


@router.put("/complexes/{complex_id}/legal-file", response_model=ComplexOut)
def upsert_legal_file(
    complex_id: int,
    data: LegalFilePayload,
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
):
    c = db.query(Complex).filter(Complex.id == complex_id).first()
    if not c:
        raise HTTPException(status_code=404, detail=COMPLEX_NOT_FOUND)

    report = db.query(LegalReport).filter(LegalReport.complex_id == c.id).first()
    if report:
        report.file_path = data.file_path
        if not report.title:
            report.title = f"Правовое заключение — {c.name}"
        if not report.conclusion:
            report.conclusion = f"Юридический файл загружен администратором для объекта {c.name}."
    else:
        report = LegalReport(
            complex_id=c.id,
            title=f"Правовое заключение — {c.name}",
            summary="Юридический файл добавлен администратором.",
            conclusion=f"Юридический файл загружен администратором для объекта {c.name}.",
            risk_level="medium",
            file_path=data.file_path,
        )
        db.add(report)
    db.commit()
    db.refresh(c)
    setattr(c, "legal_doc_url", data.file_path)
    return c


@router.delete("/complexes/{complex_id}")
def delete_complex(
    complex_id: int,
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
):
    c = db.query(Complex).filter(Complex.id == complex_id).first()
    if not c:
        raise HTTPException(status_code=404, detail=COMPLEX_NOT_FOUND)
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
        raise HTTPException(status_code=404, detail=COMPLEX_NOT_FOUND)
    return c


@router.get("/complexes/{complex_id}/documents", response_model=List[DocumentOut])
def admin_complex_documents(
    complex_id: int,
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
):
    c = db.query(Complex).filter(Complex.id == complex_id).first()
    if not c:
        raise HTTPException(status_code=404, detail=COMPLEX_NOT_FOUND)
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
        raise HTTPException(status_code=404, detail=COMPLEX_NOT_FOUND)
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
        raise HTTPException(status_code=404, detail=DOCUMENT_NOT_FOUND)
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
        raise HTTPException(status_code=404, detail=DOCUMENT_NOT_FOUND)
    complex_id = doc.complex_id
    db.delete(doc)
    db.commit()
    sync_complex_verification(complex_id, db)
    return {"ok": True}
