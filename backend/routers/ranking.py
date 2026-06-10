from typing import List
from cachetools import TTLCache

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from models import DailyProgress, Group, GroupMember, User
from schemas import RankingEntry
from utils import progress_score, today_local

router = APIRouter(prefix="/api/ranking", tags=["ranking"])

# Кэш: 30 секунд сакталат
ranking_cache = TTLCache(maxsize=100, ttl=30)


def _build_ranking(students: list, db: Session) -> List[RankingEntry]:
    today = today_local()
    entries = []
    for student in students:
        records = db.query(DailyProgress).filter(DailyProgress.user_id == student.id).all()
        total_score = sum(progress_score(r.page_number, r.repetitions) for r in records)
        today_rec = next((r for r in records if r.date == today), None)
        today_score = (
            progress_score(today_rec.page_number, today_rec.repetitions) if today_rec else 0
        )
        entries.append(
            {
                "user_id": student.id,
                "full_name": student.full_name,
                "username": student.username,
                "total_score": total_score,
                "total_days": len(records),
                "today_score": today_score,
            }
        )
    entries.sort(key=lambda e: (e["total_score"], e["today_score"]), reverse=True)
    return [RankingEntry(rank=i + 1, **entry) for i, entry in enumerate(entries)]


@router.get("/group/{group_id}", response_model=List[RankingEntry])
def get_group_ranking(group_id: int, db: Session = Depends(get_db)):
    cache_key = f"group_{group_id}"
    
    # Кэштен издөө
    if cache_key in ranking_cache:
        return ranking_cache[cache_key]
    
    group = db.query(Group).filter(Group.id == group_id).first()
    if not group:
        raise HTTPException(status_code=404, detail="Топ табылган жок")

    member_ids = [m.user_id for m in group.members]
    students = db.query(User).filter(User.id.in_(member_ids), User.role == "student").all()
    result = _build_ranking(students, db)
    
    # Кэшке сактоо
    ranking_cache[cache_key] = result
    return result
