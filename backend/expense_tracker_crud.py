from sqlmodel import (
    SQLModel,
    Session,
    create_engine,
)
from expense_crud import Expense
from user_crud import Users
import bcrypt
import jwt
from typing import Optional
from datetime import datetime, timedelta, timezone
from dotenv import load_dotenv
import os
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm

load_dotenv()
# Establish a db connection
username = os.getenv("db_username", "root")
password = os.getenv("db_password", "NewPassword123!")
database_name = os.getenv("db_name", "expense_tracker")
database_host = os.getenv("db_host", "localhost")
database_port = int(os.getenv("db_port", "3306"))
SECRET_KEY = os.getenv("SECRET_KEY", "dev-secret")
ALGORITHM = os.getenv("ALGORITHM", "HS256")

DATABASE_URL = f"mysql+pymysql://{username}:{password}@{database_host}:{database_port}/{database_name}"
engine = create_engine(DATABASE_URL, echo=True)
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")
# If the database and table already exist, it will do nothing to those existing tables
SQLModel.metadata.create_all(engine)


# Helper function: Get a db session based on the existing connection
def get_session():
    """Yields a SQLModel Session instance."""
    with Session(engine) as session:
        yield session


def get_password_hash(password: str) -> str:
    pwd_bytes = password.encode("utf-8")
    salt = bcrypt.gensalt(rounds=12)
    hashed = bcrypt.hashpw(pwd_bytes, salt)
    return hashed.decode("utf-8")


# User for login: verify the provided password against the hashed password stored in DB
def verify_password(plain_password: str, hashed_password: str) -> bool:
    pwd_bytes = plain_password.encode("utf-8")
    hashed_bytes = hashed_password.encode("utf-8")
    return bcrypt.checkpw(pwd_bytes, hashed_bytes)


# User for login: create a JWT token that includes the username and with  an expiration time
def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    payload = data.copy()
    expire = datetime.now(timezone.utc) + (expires_delta or timedelta(minutes=15))
    payload.update({"exp": expire})
    encoded_jwt = jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt
