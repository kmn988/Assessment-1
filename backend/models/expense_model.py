from fastapi import Query
from pydantic import BaseModel
from sqlmodel import (
    Field,
    SQLModel,
    cast,
    Float,
)
import uuid
from fastapi_pagination import Page
from datetime import date
from fastapi_pagination.customization import CustomizedPage, UseParamsFields
from typing import TypeVar, Literal
from enum import Enum


class SortDirection(str, Enum):
    ASC = "asc"
    DESC = "desc"


class SortKey(str, Enum):
    TITLE = "title"
    CATEGORY = "category"
    DATE = "date"
    AMOUNT = "amount"


class Category(str, Enum):
    FOOD = "Food"
    TRANSPORT = "Transport"
    HEALTH = "Health"
    HOUSING = "Housing"
    EDUCATION = "Education"
    CLOTHING = "Clothing"
    EXERCISE = "Exercise"
    ENTERTAINMENT = "Entertainment"
    UTILITIES = "Utilities"
    OTHER = "Other"


class ExpenseBase(SQLModel):
    user_id: uuid.UUID = Field(foreign_key="users.id", index=True)
    title: str = Field(max_length=256)
    category: Category = Field(default=Category.FOOD)
    date: date
    amount: float
    description: str | None = Field(max_length=256)


class Expense(ExpenseBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)


SORT_COLUMNS = {
    SortKey.TITLE: Expense.title,
    SortKey.CATEGORY: Expense.category,
    SortKey.DATE: Expense.date,
    SortKey.AMOUNT: cast(Expense.amount, Float),
}


class FilterParams(BaseModel):
    month: int = Field(0, gt=0, le=100)
    year: int = Field(0, ge=0)
    category: Category = Field(None)
    search: str = Field(None)
    sort_key: SortKey = Field(None)
    sort_dir: SortDirection = Field(None)


class ExpenseByCategoryFilterParams(BaseModel):
    month: int = Field(0, gt=0, le=100)
    year: int = Field(0, ge=0)


T = TypeVar("T")
CustomPage = CustomizedPage[
    Page[T],
    UseParamsFields(
        # change default size to be 5, increase upper limit to 1 000
        size=Query(10, ge=1, le=1_000),
    ),
]
