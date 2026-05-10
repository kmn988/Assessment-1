from enum import Enum
from pydantic import BaseModel, EmailStr, field_validator
import re
from typing import Optional
from sqlmodel import (
    Field,
    SQLModel,
)
import uuid

from models.expense_model import SortDirection


class UserRole(str, Enum):
    ADMIN = "ADMIN"
    USER = "USER"


class SortKey(str, Enum):
    NAME = "name"
    EMAIL = "email"
    ROLE = "role"


class UsersFilterParams(BaseModel):
    search: str = Field(None)
    sort_key: SortKey = Field(None)
    sort_dir: SortDirection = Field(None)


class UserBase(SQLModel):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    email: EmailStr = Field(unique=True, index=True, max_length=255)
    role: UserRole = Field(default=UserRole.USER)
    name: str = Field(max_length=256)

    @field_validator("role")
    @classmethod
    def validate_role(cls, v: str) -> str:
        if v not in [UserRole.ADMIN, UserRole.USER]:
            raise ValueError(
                f"Role must be either '{UserRole.ADMIN}' or '{UserRole.USER}'"
            )
        return v.upper()


class Users(UserBase, table=True):
    password: str = Field(max_length=256)


class UserDecoded(UserBase):
    exp: int


class LoginRequest(BaseModel):
    email: EmailStr
    password: str

    @field_validator("password")
    @classmethod
    def validate_password(cls, v: str) -> str:
        # Check for at least one digit
        if not re.search(r"\d", v):
            raise ValueError("Password must contain at least one digit")

        # Check for at least one uppercase letter
        if not re.search(r"[A-Z]", v):
            raise ValueError("Password must contain at least one uppercase letter")

        # Check for at least one lowercase letter
        if not re.search(r"[a-z]", v):
            raise ValueError("Password must contain at least one lowercase letter")

        # Check for at least one special character
        if not re.search(r'[!@#$%^&*(),.?":{}|<>]', v):
            raise ValueError("Password must contain at least one special character")

        return v


class RegisterRequest(LoginRequest):
    name: str = Field(max_length=256)


class CreateUserRequest(RegisterRequest):
    role: UserRole = Field(default=UserRole.USER)


class UpdateUserRequest(BaseModel):
    name: Optional[str] = Field(None, max_length=256)
    email: Optional[EmailStr] = None
    role: Optional[UserRole] = None


USER_SORT_COLUMNS = {
    SortKey.NAME: Users.name,
    SortKey.EMAIL: Users.email,
    SortKey.ROLE: Users.role,
}
