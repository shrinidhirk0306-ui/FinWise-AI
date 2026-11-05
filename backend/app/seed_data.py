from sqlalchemy.orm import Session
from datetime import datetime, timedelta
import random

from .models import TransactionModel, SettingsModel
from .ml.classifier import classifier

SAMPLE_TRANSACTIONS = [
    # Salary & Earnings (Monthly deposits)
    {"description": "Monthly salary credit from Infosys direct deposit", "amount": 65000.0, "type": "income", "category": "Salary & Earnings", "days_ago": 150},
    {"description": "Monthly salary credit from Infosys direct deposit", "amount": 65000.0, "type": "income", "category": "Salary & Earnings", "days_ago": 120},
    {"description": "Monthly salary credit from Infosys direct deposit", "amount": 65000.0, "type": "income", "category": "Salary & Earnings", "days_ago": 90},
    {"description": "Monthly salary credit from Infosys direct deposit", "amount": 65000.0, "type": "income", "category": "Salary & Earnings", "days_ago": 60},
    {"description": "Monthly salary credit from Infosys direct deposit", "amount": 68000.0, "type": "income", "category": "Salary & Earnings", "days_ago": 30},
    {"description": "Monthly salary credit from Infosys direct deposit", "amount": 68000.0, "type": "income", "category": "Salary & Earnings", "days_ago": 2},
    {"description": "Freelance UI consulting client invoice", "amount": 18500.0, "type": "income", "category": "Salary & Earnings", "days_ago": 45},
    {"description": "Quarterly dividend income payout credited", "amount": 4200.0, "type": "income", "category": "Salary & Earnings", "days_ago": 18},

    # Investments (Monthly SIPs)
    {"description": "Zerodha mutual fund SIP equity growth", "amount": 12000.0, "type": "expense", "category": "Investment", "days_ago": 145},
    {"description": "Zerodha mutual fund SIP equity growth", "amount": 12000.0, "type": "expense", "category": "Investment", "days_ago": 115},
    {"description": "Zerodha mutual fund SIP equity growth", "amount": 12000.0, "type": "expense", "category": "Investment", "days_ago": 85},
    {"description": "Zerodha mutual fund SIP equity growth", "amount": 12000.0, "type": "expense", "category": "Investment", "days_ago": 55},
    {"description": "Zerodha mutual fund SIP equity growth", "amount": 15000.0, "type": "expense", "category": "Investment", "days_ago": 25},
    {"description": "Groww index fund monthly investment SIP", "amount": 5000.0, "type": "expense", "category": "Investment", "days_ago": 40},

    # Bills & Utilities
    {"description": "Electricity payment BESCOM bill", "amount": 2450.0, "type": "expense", "category": "Bills & Utilities", "days_ago": 140},
    {"description": "Airtel broadband wifi bill payment", "amount": 1180.0, "type": "expense", "category": "Bills & Utilities", "days_ago": 138},
    {"description": "Electricity payment BESCOM bill", "amount": 2820.0, "type": "expense", "category": "Bills & Utilities", "days_ago": 108},
    {"description": "Airtel broadband wifi bill payment", "amount": 1180.0, "type": "expense", "category": "Bills & Utilities", "days_ago": 105},
    {"description": "Apartment maintenance society charges", "amount": 3500.0, "type": "expense", "category": "Bills & Utilities", "days_ago": 70},
    {"description": "Electricity payment BESCOM bill", "amount": 2650.0, "type": "expense", "category": "Bills & Utilities", "days_ago": 48},
    {"description": "Airtel fiber high speed internet bill", "amount": 1180.0, "type": "expense", "category": "Bills & Utilities", "days_ago": 15},
    {"description": "Jio prepaid mobile recharge plan", "amount": 749.0, "type": "expense", "category": "Bills & Utilities", "days_ago": 6},
    {"description": "Indane LPG cooking gas cylinder refill", "amount": 915.0, "type": "expense", "category": "Bills & Utilities", "days_ago": 8},

    # Food & Dining
    {"description": "Swiggy lunch order", "amount": 420.0, "type": "expense", "category": "Food & Dining", "days_ago": 1},
    {"description": "Zomato dinner delivery biryani", "amount": 680.0, "type": "expense", "category": "Food & Dining", "days_ago": 3},
    {"description": "Blinkit grocery vegetables and milk", "amount": 890.0, "type": "expense", "category": "Food & Dining", "days_ago": 4},
    {"description": "Starbucks iced latte and pastry", "amount": 380.0, "type": "expense", "category": "Food & Dining", "days_ago": 7},
    {"description": "Zepto instant grocery delivery fruits", "amount": 540.0, "type": "expense", "category": "Food & Dining", "days_ago": 11},
    {"description": "Buffet dinner at Barbeque Nation", "amount": 2850.0, "type": "expense", "category": "Food & Dining", "days_ago": 19},
    {"description": "Dominos pizza party", "amount": 1150.0, "type": "expense", "category": "Food & Dining", "days_ago": 26},
    {"description": "Subway sandwich meal", "amount": 320.0, "type": "expense", "category": "Food & Dining", "days_ago": 35},
    {"description": "Supermarket food provisions purchase", "amount": 3400.0, "type": "expense", "category": "Food & Dining", "days_ago": 52},
    {"description": "Swiggy food delivery lunch thali", "amount": 380.0, "type": "expense", "category": "Food & Dining", "days_ago": 65},
    {"description": "KFC fried chicken bucket meal", "amount": 790.0, "type": "expense", "category": "Food & Dining", "days_ago": 80},

    # Transportation
    {"description": "Uber ride to office", "amount": 320.0, "type": "expense", "category": "Transportation", "days_ago": 2},
    {"description": "Rapido bike taxi commute", "amount": 85.0, "type": "expense", "category": "Transportation", "days_ago": 5},
    {"description": "Petrol pump fuel refill Shell", "amount": 2100.0, "type": "expense", "category": "Transportation", "days_ago": 9},
    {"description": "Metro card smart recharge", "amount": 500.0, "type": "expense", "category": "Transportation", "days_ago": 14},
    {"description": "Ola cab airport drop", "amount": 1120.0, "type": "expense", "category": "Transportation", "days_ago": 22},
    {"description": "FASTag toll plaza auto recharge", "amount": 1000.0, "type": "expense", "category": "Transportation", "days_ago": 44},
    {"description": "Indian Railways IRCTC train booking", "amount": 1650.0, "type": "expense", "category": "Transportation", "days_ago": 72},
    {"description": "Vehicle service motor oil change garage", "amount": 3800.0, "type": "expense", "category": "Transportation", "days_ago": 95},

    # Shopping & Retail
    {"description": "Amazon purchase wireless mouse", "amount": 1499.0, "type": "expense", "category": "Shopping & Retail", "days_ago": 5},
    {"description": "Myntra casual cotton shirts", "amount": 2250.0, "type": "expense", "category": "Shopping & Retail", "days_ago": 16},
    {"description": "Nike running shoes purchase", "amount": 4800.0, "type": "expense", "category": "Shopping & Retail", "days_ago": 32},
    {"description": "Decathlon sports gym gear dumbbell", "amount": 1850.0, "type": "expense", "category": "Shopping & Retail", "days_ago": 61},
    {"description": "Ikea study desk furniture lamp", "amount": 6200.0, "type": "expense", "category": "Shopping & Retail", "days_ago": 102},

    # Entertainment
    {"description": "Netflix monthly subscription premium", "amount": 649.0, "type": "expense", "category": "Entertainment", "days_ago": 4},
    {"description": "Spotify family music plan subscription", "amount": 179.0, "type": "expense", "category": "Entertainment", "days_ago": 12},
    {"description": "BookMyShow cinema tickets IMAX 3D", "amount": 960.0, "type": "expense", "category": "Entertainment", "days_ago": 17},
    {"description": "Netflix monthly subscription premium", "amount": 649.0, "type": "expense", "category": "Entertainment", "days_ago": 34},
    {"description": "PVR cinema popcorn and movie show tickets", "amount": 1100.0, "type": "expense", "category": "Entertainment", "days_ago": 58},

    # Healthcare & Medical
    {"description": "Apollo Pharmacy medicine prescription tablets", "amount": 840.0, "type": "expense", "category": "Healthcare & Medical", "days_ago": 10},
    {"description": "Dentist clinic teeth cleaning appointment", "amount": 1500.0, "type": "expense", "category": "Healthcare & Medical", "days_ago": 41},
    {"description": "Pathology lab blood test full checkup", "amount": 2100.0, "type": "expense", "category": "Healthcare & Medical", "days_ago": 88},

    # Education
    {"description": "Coursera specialization annual certificate learning", "amount": 3200.0, "type": "expense", "category": "Education", "days_ago": 28},
    {"description": "Udemy full-stack python masterclass course", "amount": 599.0, "type": "expense", "category": "Education", "days_ago": 76},
]

def seed_initial_data(db: Session, force: bool = False):
    """Seed default settings and realistic sample transactions if empty or forced."""
    # Ensure default settings
    settings = db.query(SettingsModel).first()
    if not settings:
        settings = SettingsModel(
            user_name="Shrinivas",
            email="shrinivas@finwise.ai",
            currency="INR",
            currency_symbol="₹",
            monthly_budget=50000.0,
            savings_goal_percentage=25.0
        )
        db.add(settings)
        db.commit()

    existing_count = db.query(TransactionModel).count()
    if existing_count > 0 and not force:
        return

    if force:
        db.query(TransactionModel).delete()
        db.commit()

    base_date = datetime.now()

    for item in SAMPLE_TRANSACTIONS:
        tx_date = (base_date - timedelta(days=item["days_ago"])).strftime("%Y-%m-%d")
        # Run classifier to compute authentic AI categorization confidence
        pred = classifier.predict(item["description"])
        tx = TransactionModel(
            description=item["description"],
            amount=item["amount"],
            type=item["type"],
            category=item["category"],
            date=tx_date,
            ai_categorized=True,
            confidence=pred["confidence"],
            notes="Sample demo transaction"
        )
        db.add(tx)

    db.commit()

