from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from auth import create_access_token, hash_password, require_admin, require_user, verify_password
from database import get_db
from models import User
from schemas import UserLogin, UserRegister, UserOut, Token

router = APIRouter(prefix="/api/auth", tags=["auth"])


@router.post("/register", response_model=UserOut)
def register(data: UserRegister, db: Session = Depends(get_db)):
    if db.query(User).filter(User.email == data.email).first():
        from fastapi import HTTPException
        raise HTTPException(status_code=400, detail="Email ээлеген")
    user = User(email=data.email, password_hash=hash_password(data.password), full_name=data.full_name)
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


@router.post("/login", response_model=Token)
def login(data: UserLogin, db: Session = Depends(get_db)):
    from fastapi import HTTPException
    user = db.query(User).filter(User.email == data.email).first()
    if not user or not verify_password(data.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Email же пароль туура эмес")
    return Token(access_token=create_access_token(user.id, user.is_admin))


@router.get("/me", response_model=UserOut)
def me(user: User = Depends(require_user)):
    return user
