import os
import shutil
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

# In Vercel serverless environment, the filesystem is read-only except /tmp
if os.environ.get("VERCEL"):
    DATA_DIR = Path("/tmp/finwise_data")
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    ORIG_DATA_DIR = BASE_DIR / "data"
    if ORIG_DATA_DIR.exists():
        for file in ORIG_DATA_DIR.glob("*"):
            dest = DATA_DIR / file.name
            if not dest.exists():
                try:
                    shutil.copy2(file, dest)
                except Exception:
                    pass
else:
    DATA_DIR = BASE_DIR / "data"
    DATA_DIR.mkdir(exist_ok=True)

DATABASE_URL = f"sqlite:///{DATA_DIR / 'finwise.db'}"
MODEL_PATH = DATA_DIR / "naive_bayes_model.joblib"
VECTORIZER_PATH = DATA_DIR / "tfidf_vectorizer.joblib"
METRICS_PATH = DATA_DIR / "model_metrics.json"

