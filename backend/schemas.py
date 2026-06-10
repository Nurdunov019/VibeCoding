from datetime import date, datetime
from typing import List, Optional

from pydantic import BaseModel, Field


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class LoginRequest(BaseModel):
    username: str
    password: str


class TelegramWidgetAuth(BaseModel):
    id: int
    first_name: str
    last_name: Optional[str] = None
    username: Optional[str] = None
    photo_url: Optional[str] = None
    auth_date: int
    hash: str


class TelegramWebAppAuth(BaseModel):
    init_data: str


class UserOut(BaseModel):
    id: int
    username: str
    role: str
    full_name: str
    telegram_linked: bool = False

    class Config:
        from_attributes = True


class ProgressCreate(BaseModel):
    page_number: int = Field(ge=1, le=604)
    repetitions: int = Field(ge=1, le=100)


class ProgressOut(BaseModel):
    id: int
    user_id: int
    date: date
    page_number: int
    repetitions: int
    confirmed: bool
    confirmed_at: Optional[datetime] = None
    score: int = 0

    class Config:
        from_attributes = True


class GroupCreate(BaseModel):
    name: str
    teacher_id: Optional[int] = None


class GroupOut(BaseModel):
    id: int
    name: str
    teacher_id: int
    student_count: int = 0

    class Config:
        from_attributes = True


class StudentCreate(BaseModel):
    username: str
    password: str
    full_name: str


class StudentOut(BaseModel):
    id: int
    username: str
    full_name: str

    class Config:
        from_attributes = True


class MemberStatus(BaseModel):
    user_id: int
    full_name: str
    username: str
    read_today: bool
    read_yesterday: bool
    today_page: Optional[int] = None
    today_repetitions: Optional[int] = None
    confirmed: bool = False
    progress_id: Optional[int] = None


class RankingEntry(BaseModel):
    rank: int
    user_id: int
    full_name: str
    username: str
    total_score: int
    total_days: int
    today_score: int


class WeeklyChartPoint(BaseModel):
    week_start: date
    total_repetitions: int


class PageChartPoint(BaseModel):
    page_number: int
    total_repetitions: int


class TelegramLinkRequest(BaseModel):
    username: str
    password: str
    chat_id: str


class UserManageOut(BaseModel):
    id: int
    username: str
    full_name: str
    role: str
    groups: List[str] = []

    class Config:
        from_attributes = True


class ChatMessageCreate(BaseModel):
    text: str


class ChatMessageOut(BaseModel):
    id: int
    group_id: int
    user_id: int
    author_name: str
    author_role: str
    text: str
    created_at: datetime

    class Config:
        from_attributes = True


class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    username: Optional[str] = None
    password: Optional[str] = None
    role: Optional[str] = None
