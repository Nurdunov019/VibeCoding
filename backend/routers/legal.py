import secrets
from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from messages import COMPLEX_NOT_FOUND, LEGAL_ACCESS_NOT_FOUND, LEGAL_NOT_AVAILABLE
from models import Complex, LegalReport, ReportAccess
from schemas import RequestLegalAccess, LegalAccessOut, LegalReportView

router = APIRouter(prefix="/api/legal", tags=["legal"])

UNLIMITED_EXPIRES = datetime(2099, 12, 31, 23, 59, 59)


@router.post("/request/{slug}", response_model=LegalAccessOut)
def request_access(slug: str, data: RequestLegalAccess, db: Session = Depends(get_db)):
    complex_ = db.query(Complex).filter(Complex.slug == slug).first()
    if not complex_:
        raise HTTPException(status_code=404, detail=COMPLEX_NOT_FOUND)

    report = db.query(LegalReport).filter(LegalReport.complex_id == complex_.id).first()
    if not report:
        raise HTTPException(status_code=404, detail=LEGAL_NOT_AVAILABLE)

    existing = (
        db.query(ReportAccess)
        .filter(ReportAccess.report_id == report.id, ReportAccess.user_email == data.email)
        .first()
    )
    if existing:
        token = existing.access_token
    else:
        token = secrets.token_urlsafe(32)
        grant = ReportAccess(
            report_id=report.id,
            user_email=data.email,
            access_token=token,
            expires_at=UNLIMITED_EXPIRES,
            max_views=999999,
        )
        db.add(grant)
        db.commit()

    return LegalAccessOut(
        access_token=token,
        expires_at=UNLIMITED_EXPIRES,
        view_url=f"/legal/view/{token}",
        message="Доступ открыт без ограничения по времени. Скачивание отключено — только просмотр на платформе.",
    )


@router.get("/view/{token}", response_model=LegalReportView)
def view_report(token: str, db: Session = Depends(get_db)):
    grant = db.query(ReportAccess).filter(ReportAccess.access_token == token).first()
    if not grant:
        raise HTTPException(status_code=404, detail=LEGAL_ACCESS_NOT_FOUND)

    report = grant.report
    complex_ = report.complex

    grant.views_count += 1
    db.commit()

    return LegalReportView(
        title=report.title,
        summary=report.summary,
        conclusion=report.conclusion,
        risk_level=report.risk_level,
        prepared_at=report.prepared_at,
        complex_name=complex_.name,
        expires_at=grant.expires_at,
        views_left=999999,
        watermark=f"ProverkaKG • {grant.user_email} • {datetime.utcnow().strftime('%d.%m.%Y %H:%M')}",
        pdf_url=report.file_path,
    )
