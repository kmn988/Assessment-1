from fastapi import Query
from pydantic import BaseModel
from sqlmodel import (
    Field,
    SQLModel,
    Session,
    create_engine,
    select,
    cast,
    Float,
    asc,
    desc,
)
from typing import Optional
import uuid
import datetime
from fastapi_pagination import Page
from fastapi_pagination.ext.sqlalchemy import paginate

from fastapi_pagination.customization import CustomizedPage, UseParamsFields
from typing import TypeVar

# Establish a db connection
username = "root"
password = "admin"
database_name = "sys"
DATABASE_URL = f"mysql+pymysql://{username}:{password}@localhost:3306/{database_name}"
engine = create_engine(DATABASE_URL, echo=True)


# Create a database table "Expense"
class Expense(SQLModel, table=True):
    # Change the id field to str type becuase MySQL's int type cannot hold large numbers
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    title: str = Field(max_length=256)
    category: str = Field(max_length=256)
    date: str = Field(max_length=256)
    amount: float
    description: str | None = Field(max_length=256)


class FilterParams(BaseModel):
    month: int = Field(0, gt=0, le=100)
    year: int = Field(0, ge=0)
    skip: int = Field(None, ge=0)
    limit: int = Field(None, ge=0)
    category: str = Field(None)
    search: str = Field(None)
    sort_key: str = Field(None)
    sort_dir: str = Field(None)


class ExpenseByCategoryFilterParams(BaseModel):
    month: int = Field(0, gt=0, le=100)
    year: int = Field(0, ge=0)


SORT_COLUMNS = {
    "title": Expense.title,
    "category": Expense.category,
    "date": Expense.date,
    "amount": cast(Expense.amount, Float),
}
T = TypeVar("T")
CustomPage = CustomizedPage[
    Page[T],
    UseParamsFields(
        # change default size to be 5, increase upper limit to 1 000
        size=Query(10, ge=1, le=1_000),
    ),
]
# If the database and table already exist, it will do nothing to those existing tables
SQLModel.metadata.create_all(engine)


# Helper function: Get a db session based on the existing connection
def get_session():
    """Yields a SQLModel Session instance."""
    with Session(engine) as session:
        yield session


# CRUD operations for Expenses


# # the create_Expense endpoint calls this function to insert records
async def db_create_expense(session: Session, expense_create: Expense) -> Expense:
    new_expense = Expense.model_validate(expense_create)
    session.add(new_expense)
    return new_expense


# # the get_Expense endpoint calls this function to fetch a record by its id field
async def db_get_expense(session: Session, expense_id: int) -> Optional[Expense]:
    return session.get(Expense, expense_id)


# # the get_all_Expenses endpoint calls this function to fetch multiple records (limited to 100 recrods per fetch)
async def db_get_expenses(session: Session, query: FilterParams) -> CustomPage[Expense]:
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
    statement = select(Expense).offset(skip).limit(limit)
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
    session: Session, expense_id: uuid.UUID, expense_update: Expense
) -> Optional[Expense]:
    expense = await db_get_expense(session, expense_id)
    if not expense:
        return None
    update_data = expense_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(expense, key, value)
    session.add(expense)
    return expense


# # the delete_expense endpoint calls this function to delete a record by its id field
async def db_delete_expense(session: Session, expense_id: uuid.UUID) -> bool:
    expense = await db_get_expense(session, expense_id)
    if not expense:
        return False
    session.delete(expense)
    return True


async def db_get_trends(year: int, session: Session) -> dict[str, int]:
    yearly_expense_trends = {}
    current_year = datetime.date.today().year
    current_month = datetime.date.today().month
    month_range = range(1, current_month + 1) if year == current_year else range(1, 13)
    for month in month_range:
        query_month = str(month).zfill(2)
        statement = select(Expense).where(
            Expense.date.contains(str(year) + "-" + query_month)
        )
        total_expense = sum(
            float(item.amount) for item in session.exec(statement).all()
        )
        if total_expense > 0:
            yearly_expense_trends[f"{year}-{query_month}"] = total_expense
    return yearly_expense_trends


async def db_get_expense_by_category(
    query: ExpenseByCategoryFilterParams, session: Session
) -> dict[str, int]:
    date = str(query.year) + "-" + str(query.month).zfill(2)
    expense_by_category = {}
    statement = select(Expense).where(Expense.date.contains(date))
    for item in session.exec(statement).all():
        if item.category in expense_by_category:
            expense_by_category[item.category] += float(item.amount)
        else:
            expense_by_category[item.category] = float(item.amount)
    return expense_by_category
