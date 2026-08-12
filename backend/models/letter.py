from sqlalchemy import Column, Integer, String, DateTime, Text
from sqlalchemy.sql import func
from database.database import Base
from sqlalchemy import ForeignKey

class LetterRequest(Base):
    __tablename__ = "letters"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    student_name = Column(String(100), nullable=False)
    student_id = Column(String(20), nullable=False)

    letter_type = Column(String(100), nullable=False)
    letter_title = Column(String(255), nullable=False)

    faculty = Column(String(100))
    major = Column(String(100))
    campus = Column(String(100))

    status = Column(String(20), default="Pending")

    reject_reason = Column(Text, nullable=True)

    file_path = Column(String(255), nullable=True)

    created_at = Column(DateTime, server_default=func.now())