from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

class CategoryOut(BaseModel):
    id: int
    name: str
    class Config: from_attributes = True

class SubCategoryOut(BaseModel):
    id: int
    name: str
    category_id: int
    class Config: from_attributes = True

class UserCreate(BaseModel):
    name: str = Field(min_length=2, max_length=100)
    phone: str = Field(min_length=3, max_length=50)
    password: str = Field(min_length=6, max_length=128)

class UserLogin(BaseModel):
    phone: str
    password: str

class UserOut(BaseModel):
    id: int
    name: str
    phone: str
    role: str
    class Config: from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

class PromptCreate(BaseModel):
    category_id: int
    sub_category_id: int
    prompt: str = Field(min_length=3, max_length=4000)

class PromptOut(BaseModel):
    id: int
    prompt: str
    response: str
    created_at: datetime
    category: Optional[CategoryOut] = None
    sub_category: Optional[SubCategoryOut] = None
    class Config: from_attributes = True

class PaginatedPrompts(BaseModel):
    items: List[PromptOut]
    total: int
    page: int
    page_size: int
