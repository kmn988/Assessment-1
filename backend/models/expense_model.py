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


from fastapi_pagination.customization import CustomizedPage, UseParamsFields
from typing import TypeVar


class ExpenseBase(SQLModel):
    user_id: uuid.UUID = Field(foreign_key="users.id", index=True)
    title: str = Field(max_length=256)
    category: str = Field(max_length=256)
    date: str = Field(max_length=256)
    amount: float
    description: str | None = Field(max_length=256)


class Expense(ExpenseBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)


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
