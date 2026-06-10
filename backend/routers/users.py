from datetime import datetime
from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from auth import hash_password, require_roles
from database import get_db
from models import Group, GroupMember, User
from schemas import UserManageOut, UserUpdate

router = APIRouter(prefix="/api/users", tags=["users"])


@router.get("", response_model=List[UserManageOut])
def list_users(
    user: User = Depends(require_roles("admin")),
    db: Session = Depends(get_db),
):
    users = db.query(User).order_by(User.role, User.full_name).all()
    result = []
    for u in users:
        memberships = db.query(GroupMember).filter(GroupMember.user_id == u.id).all()
        group_names = []
        for m in memberships:
            g = db.query(Group).filter(Group.id == m.group_id).first()
            if g:
                group_names.append(g.name)
        result.append(
            UserManageOut(
                id=u.id,
                username=u.username,
                full_name=u.full_name,
                role=u.role,
                groups=group_names,
            )
        )
    return result


@router.get("/teachers", response_model=List[UserManageOut])
def list_teachers(
    user: User = Depends(require_roles("admin")),
    db: Session = Depends(get_db),
):
    teachers = db.query(User).filter(User.role == "teacher").order_by(User.full_name).all()
    return [
        UserManageOut(id=t.id, username=t.username, full_name=t.full_name, role=t.role, groups=[])
        for t in teachers
    ]


@router.put("/{user_id}", response_model=UserManageOut)
def update_user(
    user_id: int,
    data: UserUpdate,
    actor: User = Depends(require_roles("admin")),
    db: Session = Depends(get_db),
):
    target = db.query(User).filter(User.id == user_id).first()
    if not target:
        raise HTTPException(status_code=404, detail="Колдонуучу табылган жок")

    if data.username and data.username != target.username:
        exists = db.query(User).filter(User.username == data.username, User.id != user_id).first()
        if exists:
            raise HTTPException(status_code=400, detail="Бул логин ээлеген")
        target.username = data.username

    if data.full_name:
        target.full_name = data.full_name

    if data.password:
        target.password_hash = hash_password(data.password)

    if data.role:
        if data.role not in ("student", "teacher", "admin"):
            raise HTTPException(status_code=400, detail="Туура эмес роль")
        target.role = data.role

    db.commit()
    db.refresh(target)

    memberships = db.query(GroupMember).filter(GroupMember.user_id == target.id).all()
    group_names = []
    for m in memberships:
        g = db.query(Group).filter(Group.id == m.group_id).first()
        if g:
            group_names.append(g.name)

    return UserManageOut(
        id=target.id,
        username=target.username,
        full_name=target.full_name,
        role=target.role,
        groups=group_names,
    )


@router.delete("/{user_id}/from-group/{group_id}")
def remove_from_group(
    user_id: int,
    group_id: int,
    actor: User = Depends(require_roles("admin")),
    db: Session = Depends(get_db),
):
    member = (
        db.query(GroupMember)
        .filter(GroupMember.group_id == group_id, GroupMember.user_id == user_id)
        .first()
    )
    if not member:
        raise HTTPException(status_code=404, detail="Окуучу тободо жок")

    db.delete(member)
    db.commit()
    return {"message": "Окуучу топтон чыгарылды"}


@router.post("/{user_id}/promote-to-teacher")
def promote_to_teacher(
    user_id: int,
    actor: User = Depends(require_roles("teacher", "admin")),
    db: Session = Depends(get_db),
):
    target = db.query(User).filter(User.id == user_id).first()
    if not target:
        raise HTTPException(status_code=404, detail="Колдонуучу табылган жок")
    
    if target.role == "teacher":
        raise HTTPException(status_code=400, detail="Бул колдонуучу булак устаз")
    
    if target.role == "admin":
        raise HTTPException(status_code=403, detail="Админди устаз кылууга болбойт")
    
    target.role = "teacher"
    db.commit()
    db.refresh(target)
    
    return {"message": f"{target.full_name} устаз кылып белгиленди"}
