from fastapi import APIRouter, HTTPException
from database.database import SessionLocal
from models.letter import LetterRequest

router = APIRouter(
    prefix="/letters",
    tags=["Letters"]
)

@router.get("/letter-requests")
def get_letter_requests():

    db = SessionLocal()

    requests = db.query(LetterRequest).all()

    return requests

@router.put("/reject/{letter_id}")
def reject_letter(letter_id: int, reject_reason: str):
    db = SessionLocal()

    letter = db.query(LetterRequest).filter(
        LetterRequest.id == letter_id
    ).first()

    if not letter:
        raise HTTPException(status_code=404, detail="Letter not found")

    letter.status = "Rejected"
    letter.reject_reason = reject_reason

    db.commit()

    return {
        "message": "Letter rejected successfully"
    }