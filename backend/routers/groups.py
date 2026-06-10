from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from auth import hash_password, require_roles
from database import get_db
from models import Group, GroupMember, User
from schemas import GroupCreate, GroupOut, StudentCreate, StudentOut

router = APIRouter(prefix="/api/groups", tags=["groups"])


@router.get("/public", response_model=List[GroupOut])
def public_groups(db: Session = Depends(get_db)):
    groups = db.query(Group).order_by(Group.name).all()
    return [
        GroupOut(id=g.id, name=g.name, teacher_id=g.teacher_id, student_count=len(g.members))
        for g in groups
    ]


@router.get("", response_model=List[GroupOut])
def list_groups(
    user: User = Depends(require_roles("teacher", "admin")),
    db: Session = Depends(get_db),
):
    query = db.query(Group)
    if user.role == "teacher":
        query = query.filter(Group.teacher_id == user.id)
    groups = query.order_by(Group.name).all()
    return [
        GroupOut(
            id=g.id,
            name=g.name,
            teacher_id=g.teacher_id,
            student_count=len(g.members),
        )
        for g in groups
    ]


@router.post("", response_model=GroupOut)
def create_group(
    data: GroupCreate,
    user: User = Depends(require_roles("admin")),
    db: Session = Depends(get_db),
):
    teacher_id = data.teacher_id
    if not teacher_id:
        raise HTTPException(status_code=400, detail="Устазды тандаңыз")
    teacher = db.query(User).filter(User.id == teacher_id, User.role == "teacher").first()
    if not teacher:
        raise HTTPException(status_code=400, detail="Устаз табылган жок")
    group = Group(name=data.name, teacher_id=teacher_id)
    db.add(group)
    db.commit()
    db.refresh(group)
    return GroupOut(id=group.id, name=group.name, teacher_id=group.teacher_id, student_count=0)


@router.get("/my", response_model=List[GroupOut])
def my_groups(user: User = Depends(require_roles("student")), db: Session = Depends(get_db)):
    memberships = db.query(GroupMember).filter(GroupMember.user_id == user.id).all()
    result = []
    for m in memberships:
        g = db.query(Group).filter(Group.id == m.group_id).first()
        if g:
            result.append(
                GroupOut(
                    id=g.id,
                    name=g.name,
                    teacher_id=g.teacher_id,
                    student_count=len(g.members),
                )
            )
    return result


@router.get("/{group_id}/students", response_model=List[StudentOut])
def list_students(
    group_id: int,
    user: User = Depends(require_roles("teacher", "admin")),
    db: Session = Depends(get_db),
):
    group = db.query(Group).filter(Group.id == group_id).first()
    if not group:
        raise HTTPException(status_code=404, detail="Топ табылган жок")
    if user.role == "teacher" and group.teacher_id != user.id:
        raise HTTPException(status_code=403, detail="Уруксат жок")

    members = db.query(GroupMember).filter(GroupMember.group_id == group_id).all()
    students = []
    for m in members:
        s = db.query(User).filter(User.id == m.user_id).first()
        if s:
            students.append(StudentOut(id=s.id, username=s.username, full_name=s.full_name))
    return students


@router.post("/{group_id}/students", response_model=StudentOut)
def add_student(
    group_id: int,
    data: StudentCreate,
    user: User = Depends(require_roles("teacher", "admin")),
    db: Session = Depends(get_db),
):
    group = db.query(Group).filter(Group.id == group_id).first()
    if not group:
        raise HTTPException(status_code=404, detail="Топ табылган жок")
    if user.role == "teacher" and group.teacher_id != user.id:
        raise HTTPException(status_code=403, detail="Уруксат жок")

    existing = db.query(User).filter(User.username == data.username).first()
    if existing:
        member = (
            db.query(GroupMember)
            .filter(GroupMember.group_id == group_id, GroupMember.user_id == existing.id)
            .first()
        )
        if member:
            raise HTTPException(status_code=400, detail="Окуучу буга чейин тободо")
        db.add(GroupMember(group_id=group_id, user_id=existing.id))
        db.commit()
        return StudentOut(id=existing.id, username=existing.username, full_name=existing.full_name)

    student = User(
        username=data.username,
        password_hash=hash_password(data.password),
        role="student",
        full_name=data.full_name,
    )
    db.add(student)
    db.flush()
    db.add(GroupMember(group_id=group_id, user_id=student.id))
    db.commit()
    db.refresh(student)
    return StudentOut(id=student.id, username=student.username, full_name=student.full_name)
