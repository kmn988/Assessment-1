from enum import Enum
from pydantic import BaseModel, EmailStr, field_validator, Field
import re
from typing import Optional
from sqlmodel import Field as SQLField, SQLModel
import uuid
from models.expense_model import SortDirection


class UserRole(str, Enum):
    ADMIN = "ADMIN"
    USER = "USER"


class SortKey(str, Enum):
    NAME = "name"
    EMAIL = "email"
    ROLE = "role"


class EmailValidatorMixin:
    @field_validator("email", mode="before")
    @classmethod
    def validate_email(cls, v: Optional[str]) -> Optional[str]:
        if v is None:
            return v

        email_pattern = r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
        if not re.match(email_pattern, v):
            raise ValueError("Invalid email format")
        return v.lower()


class PasswordValidatorMixin:
    @field_validator("password")
    @classmethod
    def validate_password(cls, v: str) -> str:
        if not v:
            raise ValueError("Password cannot be empty")

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


class RoleValidatorMixin:
    @field_validator("role")
    @classmethod
    def validate_role(cls, v: UserRole | str) -> UserRole:
        if isinstance(v, str):
            v = v.upper()

        if v not in [UserRole.ADMIN, UserRole.USER]:
            raise ValueError(
                f"Role must be either '{UserRole.ADMIN}' or '{UserRole.USER}'"
            )

        return v if isinstance(v, UserRole) else UserRole(v)


class UserBase(SQLModel):
    id: uuid.UUID = SQLField(default_factory=uuid.uuid4, primary_key=True)
    email: EmailStr = SQLField(unique=True, index=True, max_length=255)
    role: UserRole = SQLField(default=UserRole.USER)
    name: str = SQLField(max_length=256)


class Users(UserBase, table=True):
    password: str = SQLField(max_length=256)


class UserDecoded(UserBase):
    exp: int


class UsersFilterParams(BaseModel):
    search: Optional[str] = Field(None, description="Search by name or email")
    sort_key: Optional[SortKey] = Field(None, description="Sort field")
    sort_dir: Optional[SortDirection] = Field(None, description="Sort direction")


class LoginRequest(BaseModel):
    email: str
    password: str


class RegisterRequest(LoginRequest, PasswordValidatorMixin, EmailValidatorMixin):
    email: str
    password: str
    name: str = Field(max_length=256)


class CreateUserRequest(RegisterRequest, RoleValidatorMixin):
    role: UserRole = Field(default=UserRole.USER)


class UpdateUserRequest(BaseModel, EmailValidatorMixin, RoleValidatorMixin):
    name: Optional[str] = Field(None, max_length=256)
    email: Optional[EmailStr] = None
    role: Optional[UserRole] = None


USER_SORT_COLUMNS = {
    SortKey.NAME: Users.name,
    SortKey.EMAIL: Users.email,
    SortKey.ROLE: Users.role,
}
