from pydantic import BaseModel
from datetime import datetime

class RememberTokenBase(BaseModel):
    user_id: int
    token: str
    created_at: datetime
    expires_at: datetime

class RememberTokenCreate(RememberTokenBase):
    pass

class RememberTokenUpdate(BaseModel):
    token: str | None = None
    expires_at: datetime | None = None

class RememberTokenResponse(RememberTokenBase):
    id: int
    created_at: datetime
    expires_at: datetime

    class Config:
        from_attributes = True