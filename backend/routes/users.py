from fastapi import Depends, APIRouter, HTTPException
from sqlmodel import Session
import uuid
from dependencies import is_admin
from user_crud import db_get_user, db_get_user_detail, db_get_users
from expense_tracker_crud import get_session

router = APIRouter(dependencies=[Depends(is_admin)])


@router.get("/")
async def get_all_users(db: Session = Depends(get_session)):
    return await db_get_users(db)


@router.delete("/{user_id}")
async def delete_user(user_id: uuid.UUID, db: Session = Depends(get_session)):
    db_user = await db_get_user(db, user_id)
    if not db_user:
        raise HTTPException(status_code=404, detail="User item not found")
    db.delete(db_user)
    db.commit()


@router.get("/{user_id}")
async def get_user_detail(
    user_id: uuid.UUID, year: int, db: Session = Depends(get_session)
):
    data = await db_get_user_detail(db, user_id, year)
    return data
