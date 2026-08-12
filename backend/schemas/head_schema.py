from pydantic import BaseModel, EmailStr

class HeadBase(BaseModel):
    name: str
    email: EmailStr
    faculty: str
    major: str

class HeadCreate(HeadBase):
    pass

class HeadUpdate(BaseModel):
    name: str | None = None
    email: EmailStr | None = None
    faculty: str | None = None
    major: str | None = None

class HeadResponse(HeadBase):
    id: int
    class config:
        from_attributes = True