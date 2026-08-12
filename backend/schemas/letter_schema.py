from pydantic import BaseModel
from datetime import datetime

class LetterBase(BaseModel):
    student_name: str
    student_id: str
    faculty: str
    major: str
    campus: str
    letter_type: str
    thesis_title: str
    research_location: str

class LetterCreate(LetterBase):
    pass

class LetterUpdate(BaseModel):
    student_name: str | None = None
    student_id: str | None = None
    faculty: str | None = None
    major: str | None = None
    campus: str | None = None
    letter_type: str | None = None
    thesis_title: str | None = None
    research_location: str | None = None

class LetterResponse(LetterBase):
    id: int
    status: str
    submission_date: datetime
    class Config:
        from_attributes = True