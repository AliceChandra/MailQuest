from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text

from database.database import engine

from authentication.auth_router import router as auth_router

from routers import letter
from routers import head
from routers import template

app = FastAPI()

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

# Register Router
app.include_router(auth_router)
app.include_router(letter.router)
app.include_router(head.router)
app.include_router(template.router)

@app.get("/")
def home():
    with engine.connect() as connection:
        connection.execute(text("SELECT 1"))
    
    return {
        "message": "Database Connected Successfully!"
    }