from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from collections import defaultdict

from ..database import get_db
from ..models import TransactionModel, SettingsModel
from ..schemas import AISavingsRecommendationItem

router = APIRouter(prefix="/api/recommendations", tags=["AI Savings Recommendations"])

@router.get("/savings", response_model=List[AISavingsRecommendationItem])
def get_savings_recommendations(db: Session = Depends(get_db)):
    """
    Analyzes actual transaction data to generate personalized AI savings recommendations,
    calculates potential savings, suggests category limits, and flags high-urgency spending patterns.
    """
    transactions = db.query(TransactionModel).all()
    settings = db.query(SettingsModel).first()
    symbol = settings.currency_symbol if settings else "₹"

    expenses = [tx for tx in transactions if tx.type == "expense"]
    income = [tx for tx in transactions if tx.type == "income"]
    total_income = sum(tx.amount for tx in income)
    total_expenses = sum(tx.amount for tx in expenses)

    # Estimate number of distinct months in dataset (default to 1 if empty)
    months = set(tx.date[:7] for tx in transactions if tx.date)
    month_count = max(1, len(months))

    # Calculate average monthly spend per category
    category_totals = defaultdict(float)
    for tx in expenses:
        category_totals[tx.category] += tx.amount

    monthly_cat_spend = {
        cat: (amt / month_count) for cat, amt in category_totals.items()
    }
    avg_monthly_income = (total_income / month_count) if total_income > 0 else (total_expenses / month_count * 1.2)

    recommendations: List[AISavingsRecommendationItem] = []

    # 1. Food & Dining Optimization
    food_spend = monthly_cat_spend.get("Food & Dining", 0.0)
    food_threshold = avg_monthly_income * 0.15 # 15% recommended guideline
    if food_spend > 2000:
        if food_threshold > 0 and food_threshold < food_spend:
            suggested = round(food_threshold)
        else:
            suggested = round(food_spend * 0.80)
        savings = max(100.0, round(food_spend - suggested))
        urgency = "high" if food_spend > (avg_monthly_income * 0.22) else "medium"
        recommendations.append(AISavingsRecommendationItem(
            id="rec-food",
            category="Food & Dining",
            current_spend=round(food_spend, 2),
            suggested_limit=float(suggested),
            potential_savings=float(savings),
            insight=f"Dining out and delivery accounts for {symbol}{food_spend:,.0f}/mo. This represents a prime opportunity for immediate, frictionless savings.",
            urgency=urgency,
            actionable_tip="Batch meal prep on Sundays and limit restaurant deliveries to twice per week to keep within the recommended cap."
        ))

    # 2. Shopping & Retail Discretionary Spending
    shopping_spend = monthly_cat_spend.get("Shopping & Retail", 0.0)
    if shopping_spend > 3000:
        suggested = round(shopping_spend * 0.70) # 30% reduction target
        savings = round(shopping_spend - suggested)
        urgency = "high" if shopping_spend > (avg_monthly_income * 0.20) else "medium"
        recommendations.append(AISavingsRecommendationItem(
            id="rec-shopping",
            category="Shopping & Retail",
            current_spend=round(shopping_spend, 2),
            suggested_limit=float(suggested),
            potential_savings=float(savings),
            insight=f"Non-essential retail purchases average {symbol}{shopping_spend:,.0f}/mo. Applying the 48-hour cool-off rule can curb impulse spending.",
            urgency=urgency,
            actionable_tip="Adopt the 48-hour rule: wait 2 full days before buying non-essential items online to verify if you still genuinely need them."
        ))

    # 3. Entertainment & Subscriptions
    entertainment_spend = monthly_cat_spend.get("Entertainment", 0.0)
    if entertainment_spend > 1000:
        suggested = round(entertainment_spend * 0.65)
        savings = round(entertainment_spend - suggested)
        recommendations.append(AISavingsRecommendationItem(
            id="rec-entertainment",
            category="Entertainment",
            current_spend=round(entertainment_spend, 2),
            suggested_limit=float(suggested),
            potential_savings=float(savings),
            insight=f"Entertainment & subscriptions total {symbol}{entertainment_spend:,.0f}/mo across recurring platforms and multiplex tickets.",
            urgency="low",
            actionable_tip="Audit unused recurring OTT/app subscriptions and rotate memberships (keep only 1-2 active streaming platforms per quarter)."
        ))

    # 4. Transportation / Commuting
    transport_spend = monthly_cat_spend.get("Transportation", 0.0)
    if transport_spend > 2500:
        suggested = round(transport_spend * 0.80)
        savings = round(transport_spend - suggested)
        urgency = "medium" if transport_spend > (avg_monthly_income * 0.15) else "low"
        recommendations.append(AISavingsRecommendationItem(
            id="rec-transport",
            category="Transportation",
            current_spend=round(transport_spend, 2),
            suggested_limit=float(suggested),
            potential_savings=float(savings),
            insight=f"Commute and cab expenditures average {symbol}{transport_spend:,.0f}/mo, influenced by peak surge pricing and taxi rides.",
            urgency=urgency,
            actionable_tip="Use metro smart cards or shared transit for office commutes during peak surge hours to cut monthly travel by 20%."
        ))

    # 5. Utilities & Subscriptions Optimization
    utilities_spend = monthly_cat_spend.get("Bills & Utilities", 0.0)
    if utilities_spend > 2000:
        suggested = round(utilities_spend * 0.90) # 10% optimization
        savings = round(utilities_spend - suggested)
        recommendations.append(AISavingsRecommendationItem(
            id="rec-utilities",
            category="Bills & Utilities",
            current_spend=round(utilities_spend, 2),
            suggested_limit=float(suggested),
            potential_savings=float(savings),
            insight=f"Utility and recurring maintenance bills stand at {symbol}{utilities_spend:,.0f}/mo.",
            urgency="low",
            actionable_tip="Review annual broadband or cellular plans which offer 15-20% discounts compared to monthly billing cycles."
        ))

    # 6. Investment / Wealth Compounding Recommendation
    investment_spend = monthly_cat_spend.get("Investment", 0.0)
    suggested_invest = avg_monthly_income * 0.20 # 20% rule
    if investment_spend < suggested_invest and avg_monthly_income > 0:
        gap = round(suggested_invest - investment_spend)
        recommendations.append(AISavingsRecommendationItem(
            id="rec-investment",
            category="Investment",
            current_spend=round(investment_spend, 2),
            suggested_limit=round(suggested_invest, 2),
            potential_savings=float(gap),
            insight=f"You currently allocate {symbol}{investment_spend:,.0f}/mo to investments. Increasing this toward the 20% milestone ({symbol}{suggested_invest:,.0f}/mo) builds compounding returns.",
            urgency="medium",
            actionable_tip="Automate an additional SIP (Systematic Investment Plan) the day after your salary arrives so savings happen before discretionary expenses."
        ))

    return recommendations

