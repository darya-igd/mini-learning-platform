from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text

from app.db import engine, SessionLocal
from app.models import Base
from app.config import settings
from app.seed import seed
from app.routers import categories, auth, prompts

app = FastAPI(title="Mini Learning Platform", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[o.strip() for o in settings.CORS_ORIGINS.split(",") if o.strip()],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(categories.router)
app.include_router(auth.router)
app.include_router(prompts.router)

@app.on_event("startup")
def on_startup():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try: seed(db)
    finally: db.close()

@app.get("/")
def root():
    return {"message": "Hello, Learning Platform!"}

@app.get("/health")
def health():
    with engine.connect() as conn:
        conn.execute(text("select 1"))
    return {"status": "ok"}


