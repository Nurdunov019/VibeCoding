from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from auth import get_current_user
from database import get_db
from models import ChatMessage, Group, GroupMember, User
from schemas import ChatMessageCreate, ChatMessageOut

router = APIRouter(prefix="/api/chat", tags=["chat"])


def _can_access_group(user: User, group_id: int, db: Session) -> bool:
    if user.role == "admin":
        return True
    group = db.query(Group).filter(Group.id == group_id).first()
    if not group:
        return False
    if user.role == "teacher" and group.teacher_id == user.id:
        return True
    if user.role == "student":
        return (
            db.query(GroupMember)
            .filter(GroupMember.group_id == group_id, GroupMember.user_id == user.id)
            .first()
            is not None
        )
    return False


@router.get("/{group_id}", response_model=List[ChatMessageOut])
def get_messages(
    group_id: int,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if not _can_access_group(user, group_id, db):
        raise HTTPException(status_code=403, detail="Уруксат жок")

    messages = (
        db.query(ChatMessage)
        .filter(ChatMessage.group_id == group_id)
        .order_by(ChatMessage.created_at.asc())
        .limit(100)
        .all()
    )
    result = []
    for m in messages:
        author = db.query(User).filter(User.id == m.user_id).first()
        result.append(
            ChatMessageOut(
                id=m.id,
                group_id=m.group_id,
                user_id=m.user_id,
                author_name=author.full_name if author else "—",
                author_role=author.role if author else "",
                text=m.text,
                created_at=m.created_at,
            )
        )
    return result


@router.post("/{group_id}", response_model=ChatMessageOut)
def send_message(
    group_id: int,
    data: ChatMessageCreate,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if not _can_access_group(user, group_id, db):
        raise HTTPException(status_code=403, detail="Уруксат жок")

    text = data.text.strip()
    if not text:
        raise HTTPException(status_code=400, detail="Билдирүү бош болбошу керек")

    msg = ChatMessage(group_id=group_id, user_id=user.id, text=text[:500])
    db.add(msg)
    db.commit()
    db.refresh(msg)

    return ChatMessageOut(
        id=msg.id,
        group_id=msg.group_id,
        user_id=msg.user_id,
        author_name=user.full_name,
        author_role=user.role,
        text=msg.text,
        created_at=msg.created_at,
    )
