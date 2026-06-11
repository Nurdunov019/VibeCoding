from typing import Optional

from models import Complex, Document

REQUIRED_DOC_TYPES = [
    "land_title",
    "construction_permit",
    "expertise",
    "commissioning",
    "ownership_scheme",
]


def calculate_verification(complex_id: int, db) -> tuple[int, str]:
    docs = db.query(Document).filter(Document.complex_id == complex_id).all()
    by_type = {d.doc_type: d for d in docs}

    valid = 0
    missing = 0
    expired = 0

    for doc_type in REQUIRED_DOC_TYPES:
        doc = by_type.get(doc_type)
        if not doc or doc.status == "missing":
            missing += 1
        elif doc.status == "expired":
            expired += 1
        elif doc.status == "valid":
            valid += 1

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

    return score, status


def sync_complex_verification(complex_id: int, db) -> Optional[Complex]:
    c = db.query(Complex).filter(Complex.id == complex_id).first()
    if not c:
        return None
    score, status = calculate_verification(complex_id, db)
    c.verification_score = score
    c.verification_status = status
    db.commit()
    db.refresh(c)
    return c
