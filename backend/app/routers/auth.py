from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..db import SessionLocal
from .. import models, schemas
from ..services.auth import hash_password, verify_password, create_token

router = APIRouter(prefix="/auth", tags=["auth"])

def get_db():
    db = SessionLocal()
    try: yield db
    finally: db.close()

@router.post("/register", response_model=schemas.Token)
def register(data: schemas.UserCreate, db: Session = Depends(get_db)):
    if db.query(models.User).filter(models.User.phone == data.phone).first():
        raise HTTPException(status_code=400, detail="Phone already registered")
    role = "admin" if db.query(models.User).count() == 0 else "user"
    u = models.User(name=data.name, phone=data.phone, password_hash=hash_password(data.password), role=role)
    db.add(u); db.commit(); db.refresh(u)
    return {"access_token": create_token(u.id, u.role)}

@router.post("/login", response_model=schemas.Token)
def login(data: schemas.UserLogin, db: Session = Depends(get_db)):
    u = db.query(models.User).filter(models.User.phone == data.phone).first()
    if not u or not verify_password(data.password, u.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return {"access_token": create_token(u.id, u.role)}

