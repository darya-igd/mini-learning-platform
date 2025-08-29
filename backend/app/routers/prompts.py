from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from ..db import SessionLocal
from .. import models, schemas
from ..deps import get_current_user
from ..services.ai_provider import generate_lesson

router = APIRouter(prefix="/prompts", tags=["prompts"])

def get_db():
    db = SessionLocal()
    try: yield db
    finally: db.close()

@router.post("", response_model=schemas.PromptOut)
async def create_prompt(data: schemas.PromptCreate,
                        user: models.User = Depends(get_current_user),
                        db: Session = Depends(get_db)):
    cat = db.get(models.Category, data.category_id)
    sub = db.get(models.SubCategory, data.sub_category_id)
    if not cat or not sub or sub.category_id != cat.id:
        raise HTTPException(status_code=400, detail="Invalid category/subcategory")
    topic = f"{cat.name} → {sub.name}"
    response = await generate_lesson(topic, data.prompt)
    p = models.Prompt(
        user_id=user.id, category_id=cat.id, sub_category_id=sub.id,
        prompt=data.prompt, response=response
    )
    db.add(p); db.commit(); db.refresh(p)
    return p

@router.get("/history", response_model=schemas.PaginatedPrompts)
def my_history(page: int = Query(1, ge=1), page_size: int = Query(10, ge=1, le=100),
               user: models.User = Depends(get_current_user),
               db: Session = Depends(get_db)):
    q = db.query(models.Prompt).filter(models.Prompt.user_id == user.id).order_by(models.Prompt.created_at.desc())
    total = q.count()
    items = q.offset((page-1)*page_size).limit(page_size).all()
    return {"items": items, "total": total, "page": page, "page_size": page_size}

