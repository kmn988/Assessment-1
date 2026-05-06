from enum import Enum
from fastapi import Query
from pydantic import BaseModel, EmailStr, Field, field_validator
import re
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
from typing import TypeVar


class UserRole(str, Enum):
    ADMIN = "ADMIN"
    USER = "USER"


class UserBase(SQLModel):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    email: EmailStr = Field(unique=True, index=True, max_length=255)
    role: str = Field(max_length=256, default=UserRole.USER)

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


class RegisterRequest(BaseModel):
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
