import json
import os
import jwt
from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from auth import create_access_token, get_current_user, verify_password
from database import get_db
from models import User
from schemas import LoginRequest, TelegramWebAppAuth, TelegramWidgetAuth, Token, UserOut
from telegram_auth import verify_webapp_init_data, verify_widget_auth

router = APIRouter(prefix="/api/auth", tags=["auth"])


def _login_by_telegram_id(telegram_id: str, db: Session) -> Token:
    user = db.query(User).filter(User.telegram_chat_id == str(telegram_id)).first()
    if not user:
        raise HTTPException(
            status_code=401,
            detail="Telegram туташкан эмес. Ботко: /link логин пароль",
        )
    return Token(access_token=create_access_token(user.id, user.role))


@router.post("/login", response_model=Token)
def login(data: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == data.username).first()
    if not user or not verify_password(data.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Логин же пароль туура эмес")
    token = create_access_token(user.id, user.role)
    return Token(access_token=token)


@router.post("/telegram", response_model=Token)
def telegram_widget_login(data: TelegramWidgetAuth, db: Session = Depends(get_db)):
    payload = data.model_dump()
    if not verify_widget_auth(payload):
        raise HTTPException(status_code=401, detail="Telegram текшерүү ишке ашкан жок")
    return _login_by_telegram_id(str(data.id), db)


@router.post("/telegram-webapp", response_model=Token)
def telegram_webapp_login(data: TelegramWebAppAuth, db: Session = Depends(get_db)):
    parsed = verify_webapp_init_data(data.init_data)
    if not parsed:
        raise HTTPException(status_code=401, detail="Telegram WebApp текшерүү ишке ашкан жок")
    user_json = parsed.get("user")
    if not user_json:
        raise HTTPException(status_code=401, detail="Колдонуучу маалыматы жок")
    tg_user = json.loads(user_json)
    return _login_by_telegram_id(str(tg_user["id"]), db)


@router.get("/me", response_model=UserOut)
def me(user: User = Depends(get_current_user)):
    return UserOut(
        id=user.id,
        username=user.username,
        role=user.role,
        full_name=user.full_name,
        telegram_linked=bool(user.telegram_chat_id),
    )
