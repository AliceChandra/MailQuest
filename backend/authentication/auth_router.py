from fastapi import APIRouter, HTTPException, status, Response, Request
from schemas.auth_schema import RegisterSchema, LoginSchema
from authentication.auth_service import register_user, login_user
from database.database import SessionLocal
from models.user import User

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)

@router.post(
    "/register",
    status_code=status.HTTP_201_CREATED
)
async def register(user:RegisterSchema):
    try:
        result = register_user(user)

        return {
            "success" : True,
            "message" : "Registration succsessful",
            "user" : result
        }
    
    except ValueError as e:
        raise HTTPException(
            status_code=400,
            detail=str(e)
        )

@router.post("/login")
async def login(
    user: LoginSchema,
    response: Response
):
    try:
        result = login_user(user, response)

        return {
            "success": True,
            "message": "Login successful",
            "user": result
        }
    
    except ValueError as e:
        raise HTTPException(
            status_code=401,
            detail=str(e)
        )

@router.get("/me")
async def get_current_user(request: Request):

    user_id = request.cookies.get("user_id")

    if not user_id:
        raise HTTPException(
            status_code=401,
            detail="Not authenticated"
        )

    db = SessionLocal()

    try:
        db_user = (
            db.query(User)
            .filter(User.id == int(user_id))
            .first()
        )

        if db_user is None:
            raise HTTPException(
                status_code=401,
                detail="User not found"
            )

        return {
            "id": db_user.id,
            "name": db_user.name,
            "username": db_user.username,
            "email": db_user.email,
            "role": db_user.role
        }

    finally:
        db.close()