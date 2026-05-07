from fastapi import HTTPException
from sqlmodel import (
    Session,
    select,
    asc,
    desc,
)
from typing import Optional
import uuid
import datetime
from fastapi_pagination.ext.sqlalchemy import paginate
from models.expense_model import (
    SORT_COLUMNS,
    CustomPage,
    Expense,
    ExpenseByCategoryFilterParams,
    FilterParams,
)
from models.user_model import UserDecoded


async def db_create_expense(
    session: Session, user: UserDecoded, expense_create: Expense
) -> Expense:
    expense_create = expense_create.model_dump(exclude_unset=True)
    print(user, "usersssssssss")
    expense = Expense(**expense_create, user_id=user.id)
    session.add(expense)
    return expense


async def db_get_expense(session: Session, expense_id: int) -> Optional[Expense]:
    return session.get(Expense, expense_id)


async def db_get_expenses(
    session: Session, user: UserDecoded, query: FilterParams
) -> CustomPage[Expense]:
    month, year, skip, limit, category, search, sort_key, sort_dir = (
        query.month,
        query.year,
        query.skip,
        query.limit,
        query.category,
        query.search,
        query.sort_key,
        query.sort_dir,
    )
    statement = (
        select(Expense).where(Expense.user_id == user.id).offset(skip).limit(limit)
    )
    if month != 0 and year != 0:
        query_month = str(month).zfill(2)
        statement = statement.where(
            Expense.date.contains(str(year) + "-" + str(query_month))
        )
    if category is not None:
        statement = statement.where(Expense.category == category)
    if search is not None:
        statement = statement.where(Expense.title.contains(search))
    sort_column = SORT_COLUMNS.get(sort_key, Expense.date)
    if sort_dir is not None:
        if sort_dir == "desc":
            statement = statement.order_by(desc(sort_column))
        else:
            statement = statement.order_by(asc(sort_column))
    else:
        statement = statement.order_by(desc(sort_column))
    return paginate(session, statement)


# # the update_Expense endpoint calls this function to update a record
async def db_update_expense(
    session: Session, user: UserDecoded, expense_id: uuid.UUID, expense_update: Expense
) -> Optional[Expense]:
    expense = await db_get_expense(session, expense_id)
    if not expense:
        return None
    if expense.user_id != user.id:
        raise HTTPException(status_code=403, detail="You don't have permission")
    update_data = expense_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(expense, key, value)
    session.add(expense)
    return expense


# # the delete_expense endpoint calls this function to delete a record by its id field
async def db_delete_expense(
    session: Session, user: UserDecoded, expense_id: uuid.UUID
) -> bool:
    expense = await db_get_expense(session, expense_id)
    if not expense:
        return False
    if expense.user_id != user.id:
        raise HTTPException(status_code=403, detail="You don't have permission")
    session.delete(expense)
    return True


async def db_get_trends(
    year: int, user: UserDecoded, session: Session
) -> dict[str, int]:
    yearly_expense_trends = {}
    current_year = datetime.date.today().year
    current_month = datetime.date.today().month
    month_range = range(1, current_month + 1) if year == current_year else range(1, 13)
    for month in month_range:
        query_month = str(month).zfill(2)
        statement = (
            select(Expense)
            .where(Expense.date.contains(str(year) + "-" + query_month))
            .where(Expense.user_id == user.id)
        )
        total_expense = sum(
            float(item.amount) for item in session.exec(statement).all()
        )
        if total_expense > 0:
            yearly_expense_trends[f"{year}-{query_month}"] = total_expense
    return yearly_expense_trends


async def db_get_expense_by_category(
    query: ExpenseByCategoryFilterParams, user: UserDecoded, session: Session
) -> dict[str, int]:
    date = str(query.year) + "-" + str(query.month).zfill(2)
    expense_by_category = {}
    statement = (
        select(Expense)
        .where(Expense.date.contains(date))
        .where(Expense.user_id == user.id)
    )
    for item in session.exec(statement).all():
        if item.category in expense_by_category:
            expense_by_category[item.category] += float(item.amount)
        else:
            expense_by_category[item.category] = float(item.amount)
    return expense_by_category
