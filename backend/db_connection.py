from sqlmodel import (
    SQLModel,
    Session,
    create_engine,
)
from expense_crud import Expense
from user_crud import Users


from dotenv import load_dotenv
import os
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm

from urllib.parse import quote_plus

load_dotenv()
# Establish a db connection
username = os.getenv("db_username")
password = os.getenv("db_password")
database_name = os.getenv("db_name").strip()
database_host = os.getenv("db_host")
database_port = int(os.getenv("db_port"))


DATABASE_URL = f"mysql+pymysql://{username}:{quote_plus(password)}@{database_host}:{database_port}/{database_name}"
engine = create_engine(DATABASE_URL, echo=True)
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")
# If the database and table already exist, it will do nothing to those existing tables
SQLModel.metadata.create_all(engine)


# Helper function: Get a db session based on the existing connection
def get_session():
    """Yields a SQLModel Session instance."""
    with Session(engine) as session:
        yield session
