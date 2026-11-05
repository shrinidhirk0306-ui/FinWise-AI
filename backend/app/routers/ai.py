from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Tuple

from ..database import get_db
from ..models import TransactionModel
from ..schemas import PredictionRequest, PredictionResponse, ModelMetricsResponse, RetrainResponse
from ..ml.classifier import classifier

router = APIRouter(prefix="/api/ai", tags=["AI Categorisation"])

@router.post("/predict", response_model=PredictionResponse)
def predict_category(req: PredictionRequest):
    if not req.description or not req.description.strip():
        raise HTTPException(status_code=400, detail="Description cannot be empty")
    
    result = classifier.predict(req.description)
    return result

@router.get("/metrics", response_model=ModelMetricsResponse)
def get_model_metrics():
    metrics = classifier.get_metrics()
    return metrics

@router.post("/retrain", response_model=RetrainResponse)
def retrain_model(db: Session = Depends(get_db)):
    # Gather transactions from database to incorporate new user patterns
    db_transactions = db.query(TransactionModel).all()
    user_samples: List[Tuple[str, str]] = [
        (tx.description, tx.category)
        for tx in db_transactions
        if tx.description and tx.category and tx.type == "expense"
    ]

    metrics = classifier.train(custom_data=user_samples)
    return {
        "success": True,
        "message": f"Successfully retrained Multinomial Naive Bayes classifier with {metrics['trained_samples_count']} total samples.",
        "accuracy": metrics["accuracy"],
        "samples_count": metrics["trained_samples_count"],
        "categories": metrics["categories"]
    }

