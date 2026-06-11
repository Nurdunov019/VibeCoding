from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional

from database import get_db
from models import Complex, Document
from schemas import ComplexOut, CompareItem, CompareRequest, MapMarker

router = APIRouter(prefix="/api/complexes", tags=["complexes"])


@router.get("", response_model=List[ComplexOut])
def list_complexes(
    city: Optional[str] = None,
    region: Optional[str] = None,
    status: Optional[str] = None,
    class_type: Optional[str] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db),
):
    q = db.query(Complex)
    if city:
        q = q.filter(Complex.city == city)
    if region:
        q = q.filter(Complex.region == region)
    if status:
        q = q.filter(Complex.status == status)
    if class_type:
        q = q.filter(Complex.class_type == class_type)
    if search:
        q = q.filter(Complex.name.contains(search) | Complex.developer.contains(search))
    return q.order_by(Complex.verification_score.desc(), Complex.name).all()


@router.get("/stats")
def market_stats(db: Session = Depends(get_db)):
    complexes = db.query(Complex).all()
    building = sum(1 for c in complexes if c.status == "building")
    commissioned = sum(1 for c in complexes if c.status == "commissioned")
    prices = [c.price_per_sqm_usd for c in complexes if c.price_per_sqm_usd]
    avg_price = round(sum(prices) / len(prices), 0) if prices else 0
    verified = sum(1 for c in complexes if c.verification_status == "verified")
    return {
        "total_complexes": len(complexes),
        "building": building,
        "commissioned": commissioned,
        "avg_price_usd": avg_price,
        "verified_count": verified,
    }


@router.get("/map", response_model=List[MapMarker])
def map_markers(db: Session = Depends(get_db)):
    complexes = db.query(Complex).filter(
        Complex.latitude.isnot(None),
        Complex.longitude.isnot(None),
    ).all()
    return complexes


@router.post("/compare", response_model=List[CompareItem])
def compare_complexes(data: CompareRequest, db: Session = Depends(get_db)):
    items = []
    for slug in data.slugs:
        c = db.query(Complex).filter(Complex.slug == slug).first()
        if not c:
            raise HTTPException(status_code=404, detail=f"Объект «{slug}» табылган жок")
        docs = db.query(Document).filter(Document.complex_id == c.id).all()
        valid = sum(1 for d in docs if d.status == "valid")
        missing = sum(1 for d in docs if d.status == "missing")
        items.append(CompareItem(
            complex=c,
            documents_valid=valid,
            documents_missing=missing,
            documents_total=len(docs),
        ))
    return items


@router.get("/{slug}", response_model=ComplexOut)
def get_complex(slug: str, db: Session = Depends(get_db)):
    complex_ = db.query(Complex).filter(Complex.slug == slug).first()
    if not complex_:
        raise HTTPException(status_code=404, detail="Объект табылган жок")
    return complex_
