from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import SettingsModel
from ..schemas import SettingsResponse, SettingsUpdate
from ..seed_data import seed_initial_data

router = APIRouter(prefix="/api/settings", tags=["Settings"])

@router.get("", response_model=SettingsResponse)
def get_settings(db: Session = Depends(get_db)):
    settings = db.query(SettingsModel).first()
    if not settings:
        settings = SettingsModel()
        db.add(settings)
        db.commit()
        db.refresh(settings)
    return settings

@router.put("", response_model=SettingsResponse)
def update_settings(update_data: SettingsUpdate, db: Session = Depends(get_db)):
    settings = db.query(SettingsModel).first()
    if not settings:
        settings = SettingsModel()
        db.add(settings)

    data = update_data.model_dump(exclude_unset=True)
    for key, val in data.items():
        setattr(settings, key, val)

    db.commit()
    db.refresh(settings)
    return settings

@router.post("/reset-seed")
def reset_database_with_sample_data(db: Session = Depends(get_db)):
    """Reset database and reseed with clean realistic sample financial transactions."""
    seed_initial_data(db, force=True)
    return {"success": True, "message": "Database successfully reset and reseeded with realistic financial data."}

