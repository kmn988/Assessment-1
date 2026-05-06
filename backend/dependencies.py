from fastapi import Depends, HTTPException, Header, Request
import jwt
from dotenv import load_dotenv
import os
from user_crud import UserDecoded

load_dotenv()
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")


def get_token_header(x_token: str = Header(...)):
    print(x_token)
    if x_token != "fake-super-secret-token":
        raise HTTPException(status_code=400, detail="X-Token header invalid")


def get_current_user(request: Request):
    token = request.headers.get("bearer")
    if not token:
        raise HTTPException(
            status_code=401, detail="Invalid authentication credentials"
        )
    payload = jwt.decode(token, SECRET_KEY, algorithms=ALGORITHM)
    return UserDecoded(**payload)
