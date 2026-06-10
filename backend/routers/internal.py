from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import get_db
from models import DailyProgress, User
from utils import today_local

router = APIRouter(prefix="/api/internal", tags=["internal"])


@router.get("/reminders")
def get_reminders(db: Session = Depends(get_db)):
    today = today_local()
    students = db.query(User).filter(User.role == "student", User.telegram_chat_id.isnot(None)).all()
    reminders = []
    for student in students:
        has_progress = (
            db.query(DailyProgress)
            .filter(DailyProgress.user_id == student.id, DailyProgress.date == today)
            .first()
            is not None
        )
        if not has_progress:
            reminders.append(
                {
                    "chat_id": student.telegram_chat_id,
                    "full_name": student.full_name,
                    "username": student.username,
                }
            )
    return reminders
