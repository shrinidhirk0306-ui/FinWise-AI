from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List, Dict, Any
from datetime import datetime
from collections import defaultdict

from ..database import get_db
from ..models import TransactionModel, SettingsModel
from ..schemas import (
    FinancialSummaryResponse,
    SpendingTrendPoint,
    CategoryBreakdownItem,
    AIInsightResponse
)

router = APIRouter(prefix="/api/analytics", tags=["Analytics"])

@router.get("/summary", response_model=FinancialSummaryResponse)
def get_financial_summary(db: Session = Depends(get_db)):
    transactions = db.query(TransactionModel).all()
    settings = db.query(SettingsModel).first()
    monthly_budget = settings.monthly_budget if settings else 50000.0

    total_income = sum(tx.amount for tx in transactions if tx.type == "income")
    total_expenses = sum(tx.amount for tx in transactions if tx.type == "expense")
    current_balance = total_income - total_expenses
    total_savings = max(0.0, current_balance)
    savings_rate = (total_savings / total_income * 100.0) if total_income > 0 else 0.0

    # Calculate spending by category
    cat_spend = defaultdict(float)
    for tx in transactions:
        if tx.type == "expense":
            cat_spend[tx.category] += tx.amount

    highest_cat = "None"
    highest_amount = 0.0
    if cat_spend:
        highest_cat = max(cat_spend, key=cat_spend.get)
        highest_amount = cat_spend[highest_cat]

    # Current month expenses for budget percentage
    now = datetime.now()
    current_month_prefix = now.strftime("%Y-%m")
    current_month_expenses = sum(
        tx.amount for tx in transactions
        if tx.type == "expense" and tx.date.startswith(current_month_prefix)
    )
    budget_pct = (current_month_expenses / monthly_budget * 100.0) if monthly_budget > 0 else 0.0

    # Trend calculation
    trend = "neutral"
    if savings_rate >= 20.0:
        trend = "up"
    elif budget_pct > 90.0:
        trend = "down"

    return {
        "total_income": round(total_income, 2),
        "total_expenses": round(total_expenses, 2),
        "current_balance": round(current_balance, 2),
        "total_savings": round(total_savings, 2),
        "savings_rate": round(savings_rate, 1),
        "monthly_budget": round(monthly_budget, 2),
        "budget_spent_percentage": round(budget_pct, 1),
        "highest_spending_category": highest_cat,
        "highest_category_amount": round(highest_amount, 2),
        "recent_trend": trend
    }

@router.get("/monthly-trends", response_model=List[SpendingTrendPoint])
def get_monthly_trends(db: Session = Depends(get_db)):
    transactions = db.query(TransactionModel).all()

    # Group by month (YYYY-MM)
    monthly_data = defaultdict(lambda: {"income": 0.0, "expenses": 0.0})

    for tx in transactions:
        try:
            # tx.date format YYYY-MM-DD
            month_key = tx.date[:7] # YYYY-MM
            if tx.type == "income":
                monthly_data[month_key]["income"] += tx.amount
            elif tx.type == "expense":
                monthly_data[month_key]["expenses"] += tx.amount
        except Exception:
            continue

    # Sort months chronologically
    sorted_months = sorted(monthly_data.keys())
    # Format labels e.g. "Oct 2025" or "Jan 2026"
    results = []
    for m in sorted_months[-6:]: # Last 6 months
        try:
            dt = datetime.strptime(m, "%Y-%m")
            label = dt.strftime("%b %Y")
        except Exception:
            label = m

        inc = round(monthly_data[m]["income"], 2)
        exp = round(monthly_data[m]["expenses"], 2)
        sav = round(max(0.0, inc - exp), 2)
        results.append({
            "month": label,
            "income": inc,
            "expenses": exp,
            "savings": sav
        })

    return results

@router.get("/category-breakdown", response_model=List[CategoryBreakdownItem])
def get_category_breakdown(db: Session = Depends(get_db)):
    transactions = db.query(TransactionModel).filter(TransactionModel.type == "expense").all()
    total_expenses = sum(tx.amount for tx in transactions)

    category_stats = defaultdict(lambda: {"amount": 0.0, "count": 0})
    for tx in transactions:
        category_stats[tx.category]["amount"] += tx.amount
        category_stats[tx.category]["count"] += 1

    results = []
    for cat, stats in sorted(category_stats.items(), key=lambda item: item[1]["amount"], reverse=True):
        amt = stats["amount"]
        pct = (amt / total_expenses * 100.0) if total_expenses > 0 else 0.0
        results.append({
            "category": cat,
            "amount": round(amt, 2),
            "percentage": round(pct, 1),
            "count": stats["count"]
        })

    return results

@router.get("/insights", response_model=List[AIInsightResponse])
def get_ai_insights(db: Session = Depends(get_db)):
    """Generate dynamic AI financial insights from real transaction logs."""
    transactions = db.query(TransactionModel).all()
    settings = db.query(SettingsModel).first()
    monthly_budget = settings.monthly_budget if settings else 50000.0
    symbol = settings.currency_symbol if settings else "₹"

    insights = []

    expenses = [tx for tx in transactions if tx.type == "expense"]
    total_expenses = sum(tx.amount for tx in expenses)
    total_income = sum(tx.amount for tx in transactions if tx.type == "income")

    # 1. Budget consumption insight
    now = datetime.now()
    cur_month = now.strftime("%Y-%m")
    cur_month_exp = sum(tx.amount for tx in expenses if tx.date.startswith(cur_month))
    spent_ratio = (cur_month_exp / monthly_budget) if monthly_budget > 0 else 0

    if spent_ratio > 0.85:
        insights.append({
            "id": "ins-budget-warning",
            "type": "warning",
            "title": "Budget Alert: Approaching Limit",
            "description": f"You have utilized {round(spent_ratio * 100)}% of your monthly budget ({symbol}{cur_month_exp:,.0f} of {symbol}{monthly_budget:,.0f}). Consider trimming discretionary spending.",
            "impact_amount": round(cur_month_exp - (monthly_budget * 0.85), 2)
        })
    else:
        insights.append({
            "id": "ins-budget-healthy",
            "type": "success",
            "title": "Healthy Budget Discipline",
            "description": f"You've used {round(spent_ratio * 100)}% of your monthly budget with {symbol}{monthly_budget - cur_month_exp:,.0f} remaining buffer.",
        })

    # 2. High Category Concentration
    cat_spend = defaultdict(float)
    for tx in expenses:
        cat_spend[tx.category] += tx.amount

    if cat_spend and total_expenses > 0:
        top_cat, top_amt = max(cat_spend.items(), key=lambda x: x[1])
        top_pct = (top_amt / total_expenses) * 100
        if top_pct > 25.0:
            insights.append({
                "id": "ins-cat-concentration",
                "type": "tip",
                "title": f"High Spend in {top_cat}",
                "description": f"{top_cat} accounts for {round(top_pct)}% ({symbol}{top_amt:,.0f}) of all your expenses. Optimizing this category offers the fastest route to surplus savings.",
                "category": top_cat,
                "impact_amount": round(top_amt * 0.15, 2)
            })

    # 3. Savings Rate Evaluation
    if total_income > 0:
        savings = max(0.0, total_income - total_expenses)
        sav_rate = (savings / total_income) * 100
        if sav_rate >= 30:
            insights.append({
                "id": "ins-savings-excellent",
                "type": "success",
                "title": "Outstanding Savings Rate",
                "description": f"Your current savings rate is {round(sav_rate)}%, surpassing the recommended 50/30/20 benchmark (20% savings target).",
            })
        elif sav_rate < 15:
            insights.append({
                "id": "ins-savings-low",
                "type": "warning",
                "title": "Savings Rate Below Target",
                "description": f"Your savings rate is currently {round(sav_rate)}%. Financial best practices suggest aiming for at least 20% to build an emergency fund.",
            })

    # 4. Recurring Micro-Transactions (e.g. Food / Cabs)
    food_count = sum(1 for tx in expenses if tx.category == "Food & Dining")
    if food_count >= 8:
        food_sum = sum(tx.amount for tx in expenses if tx.category == "Food & Dining")
        insights.append({
            "id": "ins-micro-food",
            "type": "info",
            "title": "Frequent Dining & Food Delivery",
            "description": f"Logged {food_count} food and dining transactions totaling {symbol}{food_sum:,.0f}. Cooking at home 2 extra days a week can easily save ~15%.",
            "category": "Food & Dining",
            "impact_amount": round(food_sum * 0.15, 2)
        })

    return insights

