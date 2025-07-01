from pydantic import BaseModel, EmailStr
from datetime import date
from pydantic import BaseModel, EmailStr
from typing import Optional, Generic, TypeVar

T = TypeVar('T')

class UserCreate(BaseModel):
    username: str
    first_name: str
    last_name: str
    email: EmailStr
    dob: date
    mobile_number: str
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class APIResponse(BaseModel, Generic[T]):
  data: Optional[T] = None
  error: Optional[str] = None
  status_code: Optional[int]