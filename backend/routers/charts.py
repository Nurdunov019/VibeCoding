from collections import defaultdict
from datetime import timedelta

from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from auth import get_current_user, require_roles
from database import get_db
from models import DailyProgress, Group, GroupMember, User
from schemas import PageChartPoint, WeeklyChartPoint
from utils import today_local

router = APIRouter(prefix="/api/charts", tags=["charts"])


def _can_view(user: User, target_id: int, db: Session) -> bool:
    if user.id == target_id or user.role == "admin":
        return True
    if user.role == "teacher":
        return (
            db.query(GroupMember)
            .join(Group, Group.id == GroupMember.group_id)
            .filter(Group.teacher_id == user.id, GroupMember.user_id == target_id)
            .first()
            is not None
        )
    return False


@router.get("/weekly/{user_id}", response_model=List[WeeklyChartPoint])
def weekly_repetitions(
    user_id: int,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if not _can_view(user, user_id, db):
        raise HTTPException(status_code=403, detail="Уруксат жок")

    today = today_local()
    start = today - timedelta(days=56)
    records = (
        db.query(DailyProgress)
        .filter(DailyProgress.user_id == user_id, DailyProgress.date >= start)
        .all()
    )

    weeks: dict = defaultdict(int)
    for r in records:
        week_start = r.date - timedelta(days=r.date.weekday())
        weeks[week_start] += r.repetitions

    return [
        WeeklyChartPoint(week_start=week, total_repetitions=count)
        for week, count in sorted(weeks.items())
    ]


@router.get("/pages/{user_id}", response_model=List[PageChartPoint])
def page_progress(
    user_id: int,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if not _can_view(user, user_id, db):
        raise HTTPException(status_code=403, detail="Уруксат жок")

    records = db.query(DailyProgress).filter(DailyProgress.user_id == user_id).all()
    pages: dict = defaultdict(int)
    for r in records:
        pages[r.page_number] += r.repetitions

    return [
        PageChartPoint(page_number=page, total_repetitions=count)
        for page, count in sorted(pages.items())
    ]
