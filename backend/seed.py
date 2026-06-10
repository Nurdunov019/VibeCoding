from datetime import timedelta

from sqlalchemy.orm import Session

from auth import hash_password
from models import DailyProgress, Group, GroupMember, User
from utils import progress_score, today_local


def seed_database(db: Session) -> None:
    if db.query(User).first():
        return

    users_data = [
        ("ahmad", "student123", "student", "Ахмад"),
        ("ali", "student123", "student", "Али"),
        ("ustaz", "teacher123", "teacher", "Устаз"),
        ("admin", "admin123", "admin", "Админ"),
    ]

    users = {}
    for username, password, role, full_name in users_data:
        user = User(
            username=username,
            password_hash=hash_password(password),
            role=role,
            full_name=full_name,
        )
        db.add(user)
        db.flush()
        users[username] = user

    group = Group(name="Биринчи топ", teacher_id=users["ustaz"].id)
    db.add(group)
    db.flush()

    for student_name in ("ahmad", "ali"):
        db.add(GroupMember(group_id=group.id, user_id=users[student_name].id))

    today = today_local()
    yesterday = today - timedelta(days=1)

    db.add(
        DailyProgress(
            user_id=users["ahmad"].id,
            date=yesterday,
            page_number=4,
            repetitions=15,
            confirmed=True,
        )
    )
    db.add(
        DailyProgress(
            user_id=users["ahmad"].id,
            date=today,
            page_number=5,
            repetitions=20,
            confirmed=False,
        )
    )

    db.commit()
