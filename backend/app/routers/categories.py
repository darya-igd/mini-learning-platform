from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ..db import SessionLocal
from .. import models, schemas

router = APIRouter(prefix="/categories", tags=["categories"])

def get_db():
    db = SessionLocal()
    try: yield db
    finally: db.close()

@router.get("", response_model=List[schemas.CategoryOut])
def list_categories(db: Session = Depends(get_db)):
    return db.query(models.Category).all()

@router.get("/{category_id}/subcategories", response_model=List[schemas.SubCategoryOut])
def list_subcategories(category_id: int, db: Session = Depends(get_db)):
    cat = db.get(models.Category, category_id)
    if not cat: raise HTTPException(status_code=404, detail="Category not found")
    return db.query(models.SubCategory).filter(models.SubCategory.category_id == category_id).all()

