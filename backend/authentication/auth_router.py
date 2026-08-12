from fastapi import APIRouter, HTTPException, status, Response
from schemas.auth_schema import RegisterSchema, LoginSchema
from authentication.auth_service import register_user, login_user

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