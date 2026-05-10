from sqlmodel import (
    Session,
    select,
    asc,
    desc,
)
import uuid
import bcrypt
from models.expense_model import CustomPage
from models.user_model import USER_SORT_COLUMNS, UserBase, Users, UsersFilterParams, CreateUserRequest, UpdateUserRequest
from expense_crud import db_get_trends, db_get_categories_by_user_year
from fastapi_pagination.ext.sqlalchemy import paginate


async def db_get_users(
    session: Session, query: UsersFilterParams
) -> CustomPage[UserBase]:
    search, sort_key, sort_dir = (query.search, query.sort_key, query.sort_dir)
    statement = select(Users)
    if search is not None:
        statement = statement.where(Users.name.contains(search)).where(
            Users.email.contains(search)
        )
    sort_column = USER_SORT_COLUMNS.get(sort_key, Users.email)
    if sort_dir is not None:
        if sort_dir == "desc":
            statement = statement.order_by(desc(sort_column))
        else:
            statement = statement.order_by(asc(sort_column))
    else:
        statement = statement.order_by(desc(sort_column))
    return paginate(session, statement)


def db_get_user(session: Session, user_id: str) -> UserBase | None:
    user = session.exec(select(Users).where(Users.id == user_id)).first()
    if not user:
        return None
    return UserBase.model_validate(user)


async def db_get_user_detail(session: Session, user_id: str, year: int):
    user = db_get_user(session, user_id)
    if not user:
        return None
    user_trend = db_get_trends(year, user, session)
    user_categories = db_get_categories_by_user_year(year, user_id, session)
    return {"user": user, "trend": user_trend, "categories": user_categories}


async def db_create_user(session: Session, body: CreateUserRequest) -> Users:
    hashed = bcrypt.hashpw(body.password.encode(), bcrypt.gensalt(12)).decode()
    user = Users(email=body.email, password=hashed, role=body.role, name=body.name)
    session.add(user)
    session.commit()
    session.refresh(user)
    return user


async def db_update_user(session: Session, user_id: uuid.UUID, body: UpdateUserRequest) -> UserBase | None:
    user = session.exec(select(Users).where(Users.id == user_id)).first()
    if not user:
        return None
    if body.name is not None:
        user.name = body.name
    if body.email is not None:
        user.email = body.email
    if body.role is not None:
        user.role = body.role
    session.add(user)
    session.commit()
    session.refresh(user)
    return UserBase.model_validate(user)
