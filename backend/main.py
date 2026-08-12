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
        "http://localhost:3000/register",
        "http://localhost:3000/login",
        "http://localhost:3000/letter-request",
        "http://localhost:3000/view-status",
        "http://localhost:3000/dashboard",
        "http://localhost:3000/create-letter",
        "http://localhost:3000/manage-head",
        "http://localhost:3000/manage-template"
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