import re

from datetime import datetime, timedelta, UTC
import secrets

from fastapi import Response
from sqlalchemy.orm import Session

from database.database import SessionLocal
from models.user import User
from models.remember_token import RememberToken
from schemas.auth_schema import RegisterSchema, LoginSchema
from authentication.password import hash_password, verify_password

student_pattern = r"^\d{10}$"
lecturer_pattern = r"^D\d{4}$"

def register_user(user: RegisterSchema):
    db: Session = SessionLocal()

    try:
        # validasi format username
        if not(
            re.match(student_pattern, user.username)
            or re.match(lecturer_pattern, user.username)
        ):
            raise ValueError(
                "Username must be a 10-digit student ID or a lecturer ID starting with 'D' followed by 4 digits."
            )

        # tentukan role berdasarakn username
        if re.match(student_pattern, user.username):
            role = "student"
        elif re.match(lecturer_pattern, user.username):
            role = "lecturer"

        # cek username sudah ada atau belum
        existing_user = (
            db.query(User)
            .filter(User.username == user.username)
            .first()
        )

        if existing_user:
            raise ValueError("Username already exists")
        
        # Hash password
        hashed_password = hash_password(user.password)

        print("USERNAME: ", user.username)
        print("ROLE: ", role)

        # Buat object User
        new_user = User(
            name=user.name,
            username=user.username,
            email=user.email,
            hashed_password=hashed_password,
            role=role
        )

        db.add(new_user)
        db.commit()
        db.refresh(new_user)

        return {
            "id": new_user.id,
            "name": new_user.name,
            "username": new_user.username,
            "email": new_user.email,
            "role": new_user.role
        }

    finally:
        db.close()

def login_user(user: LoginSchema, response: Response):
    db:  Session = SessionLocal()
    try:
        # cari user berdasarkan username
        db_user = (
            db.query(User)
            .filter(User.username == user.username)
            .first()
        )
        
        if db_user is None:
            raise ValueError("Invalid username or password")
        
        # Verifikasi password
        if not verify_password(user.password, db_user.hashed_password):
            raise ValueError("Invalid username or password")

        # Simpan user yang sedang login
        response.set_cookie(
            key="user_id",
            value=str(db_user.id),
            httponly=True,
            samesite="lax",
            secure=False
        )

        # Remember Me
        if user.remember_me:
            remember_token = secrets.token_urlsafe(32)

            expires_at = datetime.now(UTC) + timedelta(days=30)

            token = RememberToken(
                user_id=db_user.id,
                token=remember_token,
                expires_at=expires_at
            )

            db.add(token)
            db.commit()

            response.set_cookie(
                key="remember_token",
                value=remember_token,
                httponly=True,
                max_age=60*60*24*30,
                samesite="lax"
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