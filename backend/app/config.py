import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR / "data"
DATA_DIR.mkdir(exist_ok=True)

DATABASE_URL = f"sqlite:///{DATA_DIR / 'finwise.db'}"
MODEL_PATH = DATA_DIR / "naive_bayes_model.joblib"
VECTORIZER_PATH = DATA_DIR / "tfidf_vectorizer.joblib"
METRICS_PATH = DATA_DIR / "model_metrics.json"

