from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from auth import require_user
from database import get_db
from models import Complex, Review, User
from schemas import ReviewCreate, ReviewOut, ReviewSummary

router = APIRouter(prefix="/api/reviews", tags=["reviews"])


def _get_commissioned_complex(slug: str, db: Session) -> Complex:
    complex_ = db.query(Complex).filter(Complex.slug == slug).first()
    if not complex_:
        raise HTTPException(status_code=404, detail="Объект табылган жок")
    if complex_.status != "commissioned":
        raise HTTPException(status_code=400, detail="Отзывы доступны только для сданных объектов")
    return complex_


@router.get("/{slug}", response_model=ReviewSummary)
def list_reviews(slug: str, db: Session = Depends(get_db)):
    complex_ = _get_commissioned_complex(slug, db)
    reviews = (
        db.query(Review)
        .filter(Review.complex_id == complex_.id)
        .order_by(Review.created_at.desc())
        .all()
    )
    avg = round(sum(r.rating for r in reviews) / len(reviews), 1) if reviews else 0
    return ReviewSummary(
        average_rating=avg,
        count=len(reviews),
        reviews=[
            ReviewOut(
                id=r.id,
                rating=r.rating,
                text=r.text,
                author_name=r.user.full_name,
                created_at=r.created_at,
            )
            for r in reviews
        ],
    )


@router.post("/{slug}", response_model=ReviewOut)
def create_review(
    slug: str,
    data: ReviewCreate,
    user: User = Depends(require_user),
    db: Session = Depends(get_db),
):
    complex_ = _get_commissioned_complex(slug, db)
    existing = (
        db.query(Review)
        .filter(Review.complex_id == complex_.id, Review.user_id == user.id)
        .first()
    )
    if existing:
        existing.rating = data.rating
        existing.text = data.text
        db.commit()
        db.refresh(existing)
        review = existing
    else:
        review = Review(
            complex_id=complex_.id,
            user_id=user.id,
            rating=data.rating,
            text=data.text,
        )
        db.add(review)
        db.commit()
        db.refresh(review)

    return ReviewOut(
        id=review.id,
        rating=review.rating,
        text=review.text,
        author_name=user.full_name,
        created_at=review.created_at,
    )
