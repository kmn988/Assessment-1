from fastapi import HTTPException, Depends, Response, status, Query, APIRouter
from models.expense_model import ExpenseBase
from models.user_model import UserDecoded
from dependencies import get_current_user, is_user
from expense_crud import (
    CustomPage,
    Expense,
    FilterParams,
    ExpenseByCategoryFilterParams,
    db_get_expenses,
    db_update_expense,
    db_create_expense,
    db_delete_expense,
    db_get_trends,
    db_get_expense_by_category,
)
from typing import Annotated
from sqlmodel import Session
from db_connection import get_session
import uuid

CurrentUser = Annotated[UserDecoded, Depends(get_current_user)]
router = APIRouter(dependencies=[Depends(get_current_user), Depends(is_user)])


@router.get("/expenses", response_model=CustomPage[Expense])
async def get_all_expenses(
    query: Annotated[FilterParams, Query()],
    user: CurrentUser,
    db: Session = Depends(get_session),
):
    """Fetch the entire to-do list."""
    return await db_get_expenses(db, user, query)


@router.post("/expense", response_model=Expense)
async def create_expense(
    expense: ExpenseBase, user: CurrentUser, db: Session = Depends(get_session)
):
    """Add a new task to the list."""
    db_expense = await db_create_expense(db, user, expense)
    db.commit()
    db.refresh(db_expense)
    return db_expense


@router.put("/expense/{expense_id}", response_model=Expense)
async def update_expense(
    expense_id: uuid.UUID,
    updated_object: ExpenseBase,
    user: CurrentUser,
    db: Session = Depends(get_session),
):
    """Update an existing task by its ID."""
    db_expense = await db_update_expense(db, user, expense_id, updated_object)
    if not db_expense:
        raise HTTPException(status_code=404, detail="Expense item not found")
    db.commit()
    db.refresh(db_expense)
    return db_expense


@router.delete("/expense/{expense_id}")
async def delete_expense(
    expense_id: uuid.UUID, user: CurrentUser, db: Session = Depends(get_session)
):
    """Remove a task from the list."""
    db_expense = await db_delete_expense(db, user, expense_id)
    if not db_expense:
        raise HTTPException(status_code=404, detail="Expense item not found")
    db.commit()
    # This code indicates the action was successful, the resource is gone, and no body content needs to be returned.
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.get("/trends")
async def get_trend(year: int, user: CurrentUser, db: Session = Depends(get_session)):
    return db_get_trends(year, user, db)


@router.get("/expense_by_category")
async def get_expense_by_category(
    query: Annotated[ExpenseByCategoryFilterParams, Query()],
    user: CurrentUser,
    db: Session = Depends(get_session),
):
    return await db_get_expense_by_category(query, user, db)
