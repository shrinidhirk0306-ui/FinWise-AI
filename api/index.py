import sys
import os
from pathlib import Path

# Ensure repo root is on sys.path so 'backend.app' can be imported
ROOT_DIR = Path(__file__).resolve().parent.parent
if str(ROOT_DIR) not in sys.path:
    sys.path.insert(0, str(ROOT_DIR))

# Import the FastAPI application directly for Vercel Serverless
from backend.app.main import app
