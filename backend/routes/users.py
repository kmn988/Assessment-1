from typing import Annotated
from fastapi import Depends, APIRouter, HTTPException, Query
from sqlmodel import Session, select
import uuid
from models.user_model import UserBase, Users, UsersFilterParams, CreateUserRequest, UpdateUserRequest
from models.expense_model import CustomPage
from dependencies import is_admin
from user_crud import db_get_user, db_get_user_detail, db_get_users, db_create_user, db_update_user
from expense_tracker_crud import get_session

router = APIRouter(dependencies=[Depends(is_admin)])


@router.post("", response_model=UserBase)
async def create_user(body: CreateUserRequest, db: Session = Depends(get_session)):
    try:
        user = await db_create_user(db, body)
        return UserBase.model_validate(user)
    except Exception:
        raise HTTPException(status_code=400, detail="Email already exists or invalid data.")


@router.put("/{user_id}", response_model=UserBase)
async def update_user(user_id: uuid.UUID, body: UpdateUserRequest, db: Session = Depends(get_session)):
    user = await db_update_user(db, user_id, body)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.get("", response_model=CustomPage[UserBase])
async def get_all_users(
    query: Annotated[UsersFilterParams, Query()], db: Session = Depends(get_session)
):
    return await db_get_users(db, query)


@router.delete("/{user_id}")
async def delete_user(user_id: uuid.UUID, db: Session = Depends(get_session)):
    user = db.exec(select(Users).where(Users.id == user_id)).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    db.delete(user)
    db.commit()


@router.get("/{user_id}")
async def get_user_detail(
    user_id: uuid.UUID, year: int, db: Session = Depends(get_session)
):
    data = await db_get_user_detail(db, user_id, year)
    if not data:
        raise HTTPException(status_code=404, detail="User not found")
    return data
