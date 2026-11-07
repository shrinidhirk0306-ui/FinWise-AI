from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from .database import engine, Base, SessionLocal
from .seed_data import seed_initial_data
from .routers import transactions, ai, analytics, recommendations, settings
from .ml.classifier import classifier

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Create tables, train/load ML model, seed sample database
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        seed_initial_data(db)
    finally:
        db.close()
    yield
    # Shutdown logic if any

app = FastAPI(
    title="FinWise AI Backend",
    description="AI-Powered Personal Finance Management System API with TF-IDF Multinomial Naive Bayes",
    version="1.0.0",
    lifespan=lifespan
)

# Enable CORS for frontend Vite development server
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "*"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.middleware("http")
async def ensure_api_prefix(request, call_next):
    # Ensure routes match whether Vercel serverless passes /api/... or stripped /...
    path = request.scope.get("path", "")
    if not path.startswith("/api") and path not in ("/", "/docs", "/openapi.json", "/redoc"):
        request.scope["path"] = f"/api{path}"
    response = await call_next(request)
    return response

# Include all route modules
app.include_router(transactions.router)
app.include_router(ai.router)
app.include_router(analytics.router)
app.include_router(recommendations.router)
app.include_router(settings.router)

@app.get("/")
def root():
    return {
        "app": "FinWise AI – Personal Finance Management System",
        "version": "1.0.0",
        "status": "online",
        "docs_url": "/docs"
    }

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "ml_model": classifier.metrics.get("model_name", "Multinomial Naive Bayes"),
        "model_trained": classifier.is_trained
    }

