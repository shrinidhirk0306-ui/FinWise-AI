from pydantic import BaseModel, Field
from typing import Optional, List, Dict
from datetime import datetime

# Transaction Schemas
class TransactionBase(BaseModel):
    description: str = Field(..., min_length=1)
    amount: float = Field(..., gt=0)
    type: str = Field(..., pattern="^(income|expense)$")
    category: Optional[str] = "Auto"
    date: str = Field(..., pattern=r"^\d{4}-\d{2}-\d{2}$")
    ai_categorized: Optional[bool] = False
    confidence: Optional[float] = 1.0
    notes: Optional[str] = None

class TransactionCreate(TransactionBase):
    pass

class TransactionUpdate(BaseModel):
    description: Optional[str] = None
    amount: Optional[float] = Field(None, gt=0)
    type: Optional[str] = Field(None, pattern="^(income|expense)$")
    category: Optional[str] = None
    date: Optional[str] = Field(None, pattern=r"^\d{4}-\d{2}-\d{2}$")
    ai_categorized: Optional[bool] = None
    confidence: Optional[float] = None
    notes: Optional[str] = None

class TransactionResponse(TransactionBase):
    id: int
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# AI Categorisation Schemas
class PredictionRequest(BaseModel):
    description: str = Field(..., min_length=1)

class CategoryProbability(BaseModel):
    category: str
    confidence: float

class PredictionResponse(BaseModel):
    description: str
    predicted_category: str
    confidence: float
    top_categories: List[CategoryProbability]
    model_name: str = "Multinomial Naive Bayes (TF-IDF)"

class RetrainResponse(BaseModel):
    success: bool
    message: str
    accuracy: float
    samples_count: int
    categories: List[str]

class ModelMetricsResponse(BaseModel):
    model_name: str
    accuracy: float
    trained_samples_count: int
    categories: List[str]
    last_trained: str

# Analytics Schemas
class FinancialSummaryResponse(BaseModel):
    total_income: float
    total_expenses: float
    current_balance: float
    total_savings: float
    savings_rate: float
    monthly_budget: float
    budget_spent_percentage: float
    highest_spending_category: str
    highest_category_amount: float
    recent_trend: str

class SpendingTrendPoint(BaseModel):
    month: str
    income: float
    expenses: float
    savings: float

class CategoryBreakdownItem(BaseModel):
    category: str
    amount: float
    percentage: float
    count: int

# AI Insights & Savings Recommendations
class AIInsightResponse(BaseModel):
    id: str
    type: str # 'warning' | 'tip' | 'success' | 'info'
    title: str
    description: str
    category: Optional[str] = None
    impact_amount: Optional[float] = None

class AISavingsRecommendationItem(BaseModel):
    id: str
    category: str
    current_spend: float
    suggested_limit: float
    potential_savings: float
    insight: str
    urgency: str # 'low' | 'medium' | 'high'
    actionable_tip: str

# Settings Schemas
class SettingsBase(BaseModel):
    user_name: str
    email: str
    currency: str
    currency_symbol: str
    monthly_budget: float
    savings_goal_percentage: float

class SettingsUpdate(BaseModel):
    user_name: Optional[str] = None
    email: Optional[str] = None
    currency: Optional[str] = None
    currency_symbol: Optional[str] = None
    monthly_budget: Optional[float] = None
    savings_goal_percentage: Optional[float] = None

class SettingsResponse(SettingsBase):
    id: int

    class Config:
        from_attributes = True

