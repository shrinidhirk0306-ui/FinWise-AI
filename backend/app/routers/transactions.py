from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime

from ..database import get_db
from ..models import TransactionModel
from ..schemas import TransactionCreate, TransactionUpdate, TransactionResponse
from ..ml.classifier import classifier

router = APIRouter(prefix="/api/transactions", tags=["Transactions"])

@router.get("", response_model=List[TransactionResponse])
def get_transactions(
    q: Optional[str] = Query(None, description="Search description or notes"),
    category: Optional[str] = Query(None, description="Filter by category"),
    type: Optional[str] = Query(None, description="Filter by type (income/expense)"),
    start_date: Optional[str] = Query(None, description="Start date (YYYY-MM-DD)"),
    end_date: Optional[str] = Query(None, description="End date (YYYY-MM-DD)"),
    limit: int = Query(100, ge=1, le=500),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_db)
):
    query = db.query(TransactionModel)

    if q:
        query = query.filter(
            TransactionModel.description.ilike(f"%{q}%") |
            TransactionModel.notes.ilike(f"%{q}%")
        )
    if category and category.lower() != "all":
        query = query.filter(TransactionModel.category == category)
    if type and type.lower() != "all":
        query = query.filter(TransactionModel.type == type)
    if start_date:
        query = query.filter(TransactionModel.date >= start_date)
    if end_date:
        query = query.filter(TransactionModel.date <= end_date)

    # Order by date descending, then id descending
    transactions = query.order_by(TransactionModel.date.desc(), TransactionModel.id.desc()).offset(offset).limit(limit).all()
    return transactions

@router.get("/{transaction_id}", response_model=TransactionResponse)
def get_transaction(transaction_id: int, db: Session = Depends(get_db)):
    tx = db.query(TransactionModel).filter(TransactionModel.id == transaction_id).first()
    if not tx:
        raise HTTPException(status_code=404, detail="Transaction not found")
    return tx

@router.post("", response_model=TransactionResponse, status_code=status.HTTP_201_CREATED)
def create_transaction(tx_in: TransactionCreate, db: Session = Depends(get_db)):
    data = tx_in.model_dump()

    # If category was empty or defaulted to Auto, run AI prediction
    if not data.get("category") or data.get("category") == "Auto":
        pred = classifier.predict(data["description"])
        data["category"] = pred["predicted_category"]
        data["ai_categorized"] = True
        data["confidence"] = pred["confidence"]

    db_tx = TransactionModel(**data)
    db.add(db_tx)
    db.commit()
    db.refresh(db_tx)
    return db_tx

@router.put("/{transaction_id}", response_model=TransactionResponse)
def update_transaction(transaction_id: int, tx_update: TransactionUpdate, db: Session = Depends(get_db)):
    tx = db.query(TransactionModel).filter(TransactionModel.id == transaction_id).first()
    if not tx:
        raise HTTPException(status_code=404, detail="Transaction not found")

    update_data = tx_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(tx, field, value)

    db.commit()
    db.refresh(tx)
    return tx

@router.delete("/{transaction_id}", status_code=status.HTTP_200_OK)
def delete_transaction(transaction_id: int, db: Session = Depends(get_db)):
    tx = db.query(TransactionModel).filter(TransactionModel.id == transaction_id).first()
    if not tx:
        raise HTTPException(status_code=404, detail="Transaction not found")

    db.delete(tx)
    db.commit()
    return {"success": True, "message": f"Transaction #{transaction_id} deleted successfully"}

