import secrets
from datetime import datetime, timedelta

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from models import Complex, LegalReport, ReportAccess
from schemas import RequestLegalAccess, LegalAccessOut, LegalReportView

router = APIRouter(prefix="/api/legal", tags=["legal"])

ACCESS_DAYS_DEFAULT = 3


@router.post("/request/{slug}", response_model=LegalAccessOut)
def request_access(slug: str, data: RequestLegalAccess, db: Session = Depends(get_db)):
    complex_ = db.query(Complex).filter(Complex.slug == slug).first()
    if not complex_:
        raise HTTPException(status_code=404, detail="Объект табылган жок")

    report = db.query(LegalReport).filter(LegalReport.complex_id == complex_.id).first()
    if not report:
        raise HTTPException(status_code=404, detail="Юридическое заключение пока недоступно")

    days = min(data.days, 4)
    token = secrets.token_urlsafe(32)
    expires = datetime.utcnow() + timedelta(days=days)

    grant = ReportAccess(
        report_id=report.id,
        user_email=data.email,
        access_token=token,
        expires_at=expires,
    )
    db.add(grant)
    db.commit()

    return LegalAccessOut(
        access_token=token,
        expires_at=expires,
        view_url=f"/legal/view/{token}",
        message=f"Доступ открыт на {days} дней. Скачивание отключено — только просмотр на платформе.",
    )


@router.get("/view/{token}", response_model=LegalReportView)
def view_report(token: str, db: Session = Depends(get_db)):
    grant = db.query(ReportAccess).filter(ReportAccess.access_token == token).first()
    if not grant:
        raise HTTPException(status_code=404, detail="Доступ не найден")

    if datetime.utcnow() > grant.expires_at:
        raise HTTPException(status_code=403, detail="Срок доступа истёк (3–4 дня). Запросите доступ снова.")

    if grant.views_count >= grant.max_views:
        raise HTTPException(status_code=403, detail="Лимит просмотров исчерпан")

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
        views_left=max(0, grant.max_views - grant.views_count),
        watermark=f"ProverkaKG • {grant.user_email} • {datetime.utcnow().strftime('%d.%m.%Y %H:%M')}",
        pdf_url=report.file_path,
    )
