from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dependencies import get_current_user
from models.user_model import LoginRequest, Users, RegisterRequest, UserRole
from expense_tracker_crud import (
    create_access_token,
    get_password_hash,
    get_session,
    verify_password,
)
from fastapi_pagination import add_pagination
from typing import TypeVar
from routes import expenses
from routes import users
from fastapi.security import (
    HTTPBearer,
)
from sqlmodel import Session, select
from datetime import timedelta

header_scheme = HTTPBearer(auto_error=False)
app = FastAPI(title="Simple To-Do API", dependencies=[Depends(header_scheme)])
ACCESS_TOKEN_EXPIRE_MINUTES = 30
app.include_router(
    expenses.router, tags=["expenses"], dependencies=[Depends(get_current_user)]
)
app.include_router(users.router, prefix="/users", tags=["users"])
# Define the origins that are allowed to talk to your server
origins = [
    "http://localhost:3000",  # Default React port
    "http://127.0.0.1:3000",
    "http://localhost:5173",  # Default Vite/React port
    "http://127.0.0.1:5173",
]

# Used for pre-built middleware classes (like CORS or GZip)
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods (GET, POST, PUT, DELETE, etc.)
    allow_headers=["*"],  # Allows all headers
)


# --- Endpoints ---
@app.post("/login")
async def login(
    form_data: LoginRequest,
    db: Session = Depends(get_session),
):
    user = db.exec(select(Users).where(Users.email == form_data.email.lower())).first()

    if not user or not verify_password(form_data.password, user.password):
        raise HTTPException(status_code=401, detail="Incorrect email or password")

    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={
            "email": form_data.email,
            "role": user.role,
            "id": str(user.id),
            "name": user.name,
        },
        expires_delta=access_token_expires,
    )
    return {
        "access_token": access_token,
        "email": form_data.email,
        "role": user.role,
        "name": user.name,
        "id": str(user.id),
    }


@app.post("/register")
async def register(body: RegisterRequest, db: Session = Depends(get_session)):
    db_user = Users(
        email=body.email,
        password=get_password_hash(body.password),
        role=UserRole.USER,
        name=body.name,
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return {
        "id": db_user.id,
        "email": db_user.email,
        "role": db_user.role,
        "name": db_user.name,
    }


add_pagination(app)
