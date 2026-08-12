from pydantic import BaseModel
from datetime import datetime

class TemplateBase(BaseModel):
    letter_type: str
    template_name: str
    file_name: str
    file_path: str

class TemplateCreate(TemplateBase):
    pass

class TemplateUpdate(BaseModel):
    letter_type: str | None = None
    template_name: str | None = None
    file_name: str | None = None
    file_path: str | None = None

class TemplateResponse(TemplateBase):
    id: int
    created_at: datetime
    class Config:
        from_attributes = True