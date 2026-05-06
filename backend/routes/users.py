from fastapi import FastAPI, HTTPException, Depends, Response, status, Query, APIRouter
from typing import List, Annotated, Literal
from sqlmodel import Session, select, SQLModel, create_engine
from pydantic import BaseModel, Field
import uuid

router = APIRouter()
