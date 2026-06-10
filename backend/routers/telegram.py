from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from auth import verify_password
from database import get_db
from models import User
from schemas import TelegramLinkRequest

router = APIRouter(prefix="/api/telegram", tags=["telegram"])


@router.post("/link")
def link_telegram(data: TelegramLinkRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == data.username).first()
    if not user or not verify_password(data.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Логин же пароль туура эмес")

    user.telegram_chat_id = data.chat_id
    db.commit()
    return {"message": "Telegram ийгиликтүү туташты", "full_name": user.full_name}
