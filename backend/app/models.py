from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime
from datetime import datetime
from .database import Base

class TransactionModel(Base):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, index=True)
    description = Column(String, index=True, nullable=False)
    amount = Column(Float, nullable=False)
    type = Column(String, nullable=False) # 'income' or 'expense'
    category = Column(String, index=True, nullable=False)
    date = Column(String, nullable=False) # YYYY-MM-DD
    ai_categorized = Column(Boolean, default=False)
    confidence = Column(Float, default=1.0)
    notes = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class SettingsModel(Base):
    __tablename__ = "settings"

    id = Column(Integer, primary_key=True, index=True)
    user_name = Column(String, default="Shrinivas")
    email = Column(String, default="user@finwise.ai")
    currency = Column(String, default="INR")
    currency_symbol = Column(String, default="₹")
    monthly_budget = Column(Float, default=50000.0)
    savings_goal_percentage = Column(Float, default=25.0)

