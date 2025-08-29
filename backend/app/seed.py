from sqlalchemy.orm import Session
from . import models

DEFAULT_DATA = {
    "Science": ["Space", "Biology", "Chemistry"],
    "Technology": ["AI", "Web", "Mobile"],
    "Arts": ["Music", "Painting", "Literature"],
}

def seed(db: Session):
    if db.query(models.Category).count() > 0:
        return
    for cat_name, subs in DEFAULT_DATA.items():
        cat = models.Category(name=cat_name)
        db.add(cat); db.flush()
        for s in subs:
            db.add(models.SubCategory(name=s, category_id=cat.id))
    db.commit()

