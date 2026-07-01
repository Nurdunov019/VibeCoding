import uuid
from pathlib import Path

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from sqlalchemy.orm import Session

from auth import create_access_token, hash_password, require_user, verify_password
from database import get_db
from messages import EMAIL_TAKEN, FILE_TOO_LARGE, FILE_TYPE_UNSUPPORTED, INVALID_CREDENTIALS
from models import User
from schemas import UserLogin, UserRegister, UserOut, Token

router = APIRouter(prefix="/api/auth", tags=["auth"])

UPLOAD_DIR = Path(__file__).parent.parent / "uploads"
AVATAR_DIR = UPLOAD_DIR / "avatars"
AVATAR_DIR.mkdir(parents=True, exist_ok=True)
ALLOWED_AVATAR = {".jpg", ".jpeg", ".png", ".webp", ".gif"}


@router.post("/register", response_model=UserOut)
def register(data: UserRegister, db: Session = Depends(get_db)):
    if db.query(User).filter(User.email == data.email).first():
        raise HTTPException(status_code=400, detail=EMAIL_TAKEN)
    user = User(email=data.email, password_hash=hash_password(data.password), full_name=data.full_name)
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


@router.post("/login", response_model=Token)
def login(data: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == data.email).first()
    if not user or not verify_password(data.password, user.password_hash):
        raise HTTPException(status_code=401, detail=INVALID_CREDENTIALS)
    return Token(access_token=create_access_token(user.id, user.is_admin))


@router.get("/me", response_model=UserOut)
def me(user: User = Depends(require_user)):
    return user


@router.post("/avatar", response_model=UserOut)
async def upload_avatar(
    file: UploadFile = File(...),
    user: User = Depends(require_user),
    db: Session = Depends(get_db),
):
    ext = Path(file.filename or "").suffix.lower()
    if ext not in ALLOWED_AVATAR:
        raise HTTPException(status_code=400, detail=FILE_TYPE_UNSUPPORTED.format(ext=ext or "unknown"))

    content = await file.read()
    if len(content) > 5 * 1024 * 1024:
        raise HTTPException(status_code=400, detail=FILE_TOO_LARGE)

    for old in AVATAR_DIR.glob(f"user-{user.id}.*"):
        old.unlink(missing_ok=True)

    filename = f"user-{user.id}-{uuid.uuid4().hex[:8]}{ext}"
    path = AVATAR_DIR / filename
    path.write_bytes(content)

    user.avatar_url = f"/uploads/avatars/{filename}"
    db.commit()
    db.refresh(user)
    return user
