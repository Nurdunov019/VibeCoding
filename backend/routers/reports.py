import io
from datetime import timedelta

from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from openpyxl import Workbook
from sqlalchemy.orm import Session

from auth import require_roles
from database import get_db
from models import DailyProgress, Group, GroupMember, User
from utils import progress_score, today_local

router = APIRouter(prefix="/api/reports", tags=["reports"])


@router.get("/excel")
def export_excel(
    months: int = 3,
    group_id: int = None,
    user: User = Depends(require_roles("teacher", "admin")),
    db: Session = Depends(get_db),
):
    if months < 1 or months > 12:
        raise HTTPException(status_code=400, detail="Айлар саны 1-12 арасында болушу керек")

    end = today_local()
    start = end - timedelta(days=months * 30)

    if group_id:
        group = db.query(Group).filter(Group.id == group_id).first()
        if not group:
            raise HTTPException(status_code=404, detail="Топ табылган жок")
        if user.role == "teacher" and group.teacher_id != user.id:
            raise HTTPException(status_code=403, detail="Уруксат жок")
        member_ids = [m.user_id for m in group.members]
    elif user.role == "teacher":
        groups = db.query(Group).filter(Group.teacher_id == user.id).all()
        member_ids = []
        for g in groups:
            member_ids.extend(m.user_id for m in g.members)
        member_ids = list(set(member_ids))
    else:
        member_ids = [u.id for u in db.query(User).filter(User.role == "student").all()]

    wb = Workbook()
    ws = wb.active
    ws.title = "Отчёт"
    ws.append(["Дата", "Окуучу", "Логин", "Бет", "Кайталоо", "Упай", "Ырасталды"])

    records = (
        db.query(DailyProgress)
        .filter(DailyProgress.user_id.in_(member_ids), DailyProgress.date >= start)
        .order_by(DailyProgress.date.desc())
        .all()
    )

    for r in records:
        student = db.query(User).filter(User.id == r.user_id).first()
        ws.append(
            [
                r.date.isoformat(),
                student.full_name if student else "",
                student.username if student else "",
                r.page_number,
                r.repetitions,
                progress_score(r.page_number, r.repetitions),
                "Ооба" if r.confirmed else "Жок",
            ]
        )

    buffer = io.BytesIO()
    wb.save(buffer)
    buffer.seek(0)
    filename = f"quran_report_{months}m.xlsx"
    return StreamingResponse(
        buffer,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'},
    )
