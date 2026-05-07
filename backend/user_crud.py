from sqlmodel import (
    Session,
    select,
)
import uuid
from models.user_model import Users
from expense_crud import db_get_trends


def db_get_users(session: Session):
    return session.exec(select(Users)).all()


def db_get_user(session: Session, user_id: str):
    return session.exec(select(Users).where(Users.id == user_id)).first()


def db_get_user_detail(session: Session, user_id: str, year: int):
    user = db_get_user(session, user_id)
    user_trend = db_get_trends(year, user, session)
    return user_trend
