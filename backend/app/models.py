from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship
from sqlalchemy import Integer, String, Text, ForeignKey, DateTime, func, UniqueConstraint

class Base(DeclarativeBase):
    pass

class User(Base):
    __tablename__ = "users"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    phone: Mapped[str] = mapped_column(String(50), unique=True, index=True, nullable=False)
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    role: Mapped[str] = mapped_column(String(20), default="user")
    prompts = relationship("Prompt", back_populates="user", cascade="all,delete")

class Category(Base):
    __tablename__ = "categories"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(100), unique=True, nullable=False)
    subcategories = relationship("SubCategory", back_populates="category", cascade="all,delete")

class SubCategory(Base):
    __tablename__ = "sub_categories"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    category_id: Mapped[int] = mapped_column(ForeignKey("categories.id", ondelete="CASCADE"), nullable=False)
    category = relationship("Category", back_populates="subcategories")
    prompts = relationship("Prompt", back_populates="sub_category", cascade="all,delete")
    __table_args__ = (UniqueConstraint("name", "category_id", name="uq_sub_per_cat"),)

class Prompt(Base):
    __tablename__ = "prompts"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    category_id: Mapped[int] = mapped_column(ForeignKey("categories.id", ondelete="SET NULL"))
    sub_category_id: Mapped[int] = mapped_column(ForeignKey("sub_categories.id", ondelete="SET NULL"))
    prompt: Mapped[str] = mapped_column(Text, nullable=False)
    response: Mapped[str] = mapped_column(Text, nullable=False)
    created_at: Mapped[DateTime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    user = relationship("User", back_populates="prompts")
    category = relationship("Category")
    sub_category = relationship("SubCategory")
