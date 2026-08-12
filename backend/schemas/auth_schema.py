from pydantic import BaseModel, EmailStr

class RegisterSchema(BaseModel):
    name: str
    username: str
    email: EmailStr
    password: str

class LoginSchema(BaseModel):
    username: str
    password: str
    remember_me: bool = False

class UserResponse(BaseModel):
    id: int
    name: str
    username: str
    email: EmailStr

    class Config:
        from_attributes = True