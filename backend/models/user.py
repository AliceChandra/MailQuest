from sqlalchemy import Column, Integer, String, DateTime
from database.database import Base
from sqlalchemy.orm import relationship

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key = True, index=True)
    name = Column(String(225), nullable=False)
    username = Column(String(100), unique=True, nullable=False)
    email = Column(String(255), unique=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)

    role = Column(String(20), nullable=False)

    created_at = Column(DateTime)

    remember_tokens = relationship(
        "RememberToken",
        back_populates="user",
        cascade="all, delete-orphan"
    )