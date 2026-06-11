from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from database import get_db
from models import Complex, Document
from schemas import DocumentOut, VerificationResult

router = APIRouter(prefix="/api/documents", tags=["documents"])

REQUIRED_DOC_TYPES = [
    "land_title",
    "construction_permit",
    "expertise",
    "commissioning",
    "ownership_scheme",
]

DOC_LABELS = {
    "land_title": "Земельный участок / право застройки",
    "construction_permit": "Разрешение на строительство",
    "expertise": "Государственная экспертиза проекта",
    "commissioning": "Акт ввода в эксплуатацию",
    "ownership_scheme": "Схема оформления прав собственности",
    "cadastre": "Кадастровая выписка",
    "other": "Иной документ",
}


@router.get("/complex/{slug}", response_model=List[DocumentOut])
def complex_documents(slug: str, db: Session = Depends(get_db)):
    complex_ = db.query(Complex).filter(Complex.slug == slug).first()
    if not complex_:
        raise HTTPException(status_code=404, detail="Объект табылган жок")
    return db.query(Document).filter(Document.complex_id == complex_.id).order_by(Document.doc_type).all()


@router.get("/verify/{slug}", response_model=VerificationResult)
def verify_complex(slug: str, db: Session = Depends(get_db)):
    complex_ = db.query(Complex).filter(Complex.slug == slug).first()
    if not complex_:
        raise HTTPException(status_code=404, detail="Объект табылган жок")

    docs = db.query(Document).filter(Document.complex_id == complex_.id).all()
    by_type = {d.doc_type: d for d in docs}

    checks = []
    valid = 0
    missing = 0
    expired = 0

    for doc_type in REQUIRED_DOC_TYPES:
        doc = by_type.get(doc_type)
        label = DOC_LABELS.get(doc_type, doc_type)
        if not doc:
            missing += 1
            checks.append({"type": doc_type, "label": label, "status": "missing", "message": "Документ не загружен"})
        elif doc.status == "expired":
            expired += 1
            checks.append({"type": doc_type, "label": label, "status": "expired", "message": "Срок действия истёк"})
        elif doc.status == "valid":
            valid += 1
            checks.append({"type": doc_type, "label": label, "status": "valid", "message": "Документ действителен", "number": doc.number})
        else:
            checks.append({"type": doc_type, "label": label, "status": doc.status, "message": doc.notes or "Требует проверки"})

    total = len(REQUIRED_DOC_TYPES)
    score = max(0, int((valid / total) * 100 - missing * 5 - expired * 10))
    if score >= 80:
        status = "verified"
    elif score >= 50:
        status = "partial"
    elif missing >= 3:
        status = "risk"
    else:
        status = "unverified"

    return VerificationResult(
        complex_id=complex_.id,
        complex_name=complex_.name,
        score=score,
        status=status,
        total_documents=len(docs),
        valid_documents=valid,
        missing_documents=missing,
        expired_documents=expired,
        checks=checks,
    )
