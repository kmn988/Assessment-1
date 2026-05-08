from fastapi import HTTPException, Header, Request
import jwt
from dotenv import load_dotenv
import os
from models.user_model import UserDecoded

load_dotenv()
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")


def get_token_header(x_token: str = Header(...)):
    print(x_token)
    if x_token != "fake-super-secret-token":
        raise HTTPException(status_code=400, detail="X-Token header invalid")


def _get_bearer_token(request: Request) -> str:
    authorization = request.headers.get("authorization")
    if authorization and authorization.startswith("Bearer "):
        return authorization.split(" ", 1)[1]

    legacy_token = request.headers.get("bearer")
    if legacy_token:
        return legacy_token

    raise HTTPException(status_code=401, detail="Invalid authentication credentials")


def get_current_user(request: Request):
    token = _get_bearer_token(request)
    payload = jwt.decode(token, SECRET_KEY, algorithms=ALGORITHM)
    return UserDecoded(**payload)


def is_admin(request: Request):
    token = _get_bearer_token(request)
    payload = jwt.decode(token, SECRET_KEY, algorithms=ALGORITHM)
    if payload["role"] != "ADMIN":
        raise HTTPException(status_code=403, detail="You don't have permission")
