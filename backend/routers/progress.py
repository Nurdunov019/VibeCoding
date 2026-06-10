from datetime import datetime

from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from auth import get_current_user, require_roles
from database import get_db
from models import DailyProgress, Group, GroupMember, User
from schemas import MemberStatus, ProgressCreate, ProgressOut
from utils import progress_score, today_local, yesterday_local

router = APIRouter(prefix="/api/progress", tags=["progress"])


def _to_progress_out(record: DailyProgress) -> ProgressOut:
    return ProgressOut(
        id=record.id,
        user_id=record.user_id,
        date=record.date,
        page_number=record.page_number,
        repetitions=record.repetitions,
        confirmed=record.confirmed,
        confirmed_at=record.confirmed_at,
        score=progress_score(record.page_number, record.repetitions),
    )


@router.get("/me", response_model=Optional[ProgressOut])
def my_today_progress(
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    record = (
        db.query(DailyProgress)
        .filter(DailyProgress.user_id == user.id, DailyProgress.date == today_local())
        .first()
    )
    return _to_progress_out(record) if record else None


@router.post("", response_model=ProgressOut)
def save_progress(
    data: ProgressCreate,
    user: User = Depends(require_roles("student")),
    db: Session = Depends(get_db),
):
    today = today_local()
    record = (
        db.query(DailyProgress)
        .filter(DailyProgress.user_id == user.id, DailyProgress.date == today)
        .first()
    )
    if record:
        record.page_number = data.page_number
        record.repetitions = data.repetitions
        record.confirmed = False
        record.confirmed_at = None
        record.confirmed_by = None
    else:
        record = DailyProgress(
            user_id=user.id,
            date=today,
            page_number=data.page_number,
            repetitions=data.repetitions,
        )
        db.add(record)
    db.commit()
    db.refresh(record)
    return _to_progress_out(record)


@router.get("/group/{group_id}", response_model=List[MemberStatus])
def group_status(
    group_id: int,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    group = db.query(Group).filter(Group.id == group_id).first()
    if not group:
        raise HTTPException(status_code=404, detail="Топ табылган жок")

    is_teacher = user.role == "teacher" and group.teacher_id == user.id
    is_member = (
        db.query(GroupMember)
        .filter(GroupMember.group_id == group_id, GroupMember.user_id == user.id)
        .first()
        is not None
    )
    if not is_teacher and not is_member and user.role != "admin":
        raise HTTPException(status_code=403, detail="Уруксат жок")

    today = today_local()
    yesterday = yesterday_local()
    members = db.query(GroupMember).filter(GroupMember.group_id == group_id).all()
    result = []

    for member in members:
        student = db.query(User).filter(User.id == member.user_id).first()
        today_rec = (
            db.query(DailyProgress)
            .filter(DailyProgress.user_id == student.id, DailyProgress.date == today)
            .first()
        )
        yesterday_rec = (
            db.query(DailyProgress)
            .filter(DailyProgress.user_id == student.id, DailyProgress.date == yesterday)
            .first()
        )
        result.append(
            MemberStatus(
                user_id=student.id,
                full_name=student.full_name,
                username=student.username,
                read_today=today_rec is not None,
                read_yesterday=yesterday_rec is not None,
                today_page=today_rec.page_number if today_rec else None,
                today_repetitions=today_rec.repetitions if today_rec else None,
                confirmed=today_rec.confirmed if today_rec else False,
                progress_id=today_rec.id if today_rec else None,
            )
        )
    return result


@router.post("/{progress_id}/confirm", response_model=ProgressOut)
def confirm_progress(
    progress_id: int,
    user: User = Depends(require_roles("teacher", "admin")),
    db: Session = Depends(get_db),
):
    record = db.query(DailyProgress).filter(DailyProgress.id == progress_id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Жазуу табылган жок")

    if user.role == "teacher":
        member = (
            db.query(GroupMember)
            .join(Group, Group.id == GroupMember.group_id)
            .filter(Group.teacher_id == user.id, GroupMember.user_id == record.user_id)
            .first()
        )
        if not member:
            raise HTTPException(status_code=403, detail="Бул окуучу сиздин тобуңузда эмес")

    record.confirmed = True
    record.confirmed_at = datetime.utcnow()
    record.confirmed_by = user.id
    db.commit()
    db.refresh(record)
    return _to_progress_out(record)
