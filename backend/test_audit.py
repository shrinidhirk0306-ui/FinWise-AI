"""
FinWise AI - Comprehensive End-to-End QA Functionality Audit
Tests all 8 functional areas required by the QA audit specification.
"""

import sys
import json
import urllib.request
import urllib.error
from collections import defaultdict

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

BASE_URL = "http://127.0.0.1:8000"

def request_json(path, method="GET", data=None):
    url = f"{BASE_URL}{path}"
    req = urllib.request.Request(url, method=method)
    req.add_header("Content-Type", "application/json")
    body = json.dumps(data).encode("utf-8") if data is not None else None
    try:
        with urllib.request.urlopen(req, data=body) as resp:
            status = resp.status
            content = resp.read().decode("utf-8")
            return status, json.loads(content) if content else {}
    except urllib.error.HTTPError as e:
        content = e.read().decode("utf-8")
        try:
            err_json = json.loads(content)
        except Exception:
            err_json = {"detail": content}
        return e.code, err_json

def run_audit():
    results = {"passed": [], "failed": [], "bugs": []}

    def record_pass(test_name, details=""):
        print(f"  [PASS] {test_name}: {details}")
        results["passed"].append({"name": test_name, "details": details})

    def record_fail(test_name, error=""):
        print(f"  [FAIL] {test_name}: {error}")
        results["failed"].append({"name": test_name, "error": error})

    print("=" * 60)
    print("FINWISE AI - COMPREHENSIVE QA AUDIT TEST RUN")
    print("=" * 60)

    # ---------------------------------------------------------
    # TEST SUITE 1: Backend Health & Database Connectivity
    # ---------------------------------------------------------
    print("\n--- 1. Backend Health & Database Connectivity ---")
    status, body = request_json("/api/health")
    if status == 200 and body.get("status") == "healthy":
        record_pass("API Health Check", f"Status: {body.get('status')}, Model: {body.get('ml_model')}")
    else:
        record_fail("API Health Check", f"Status code {status}, body {body}")

    # ---------------------------------------------------------
    # TEST SUITE 2: Dashboard Financial Calculations Audit
    # ---------------------------------------------------------
    print("\n--- 2. Dashboard Financial Calculations Audit ---")
    # Fetch all transactions to manually calculate expected values
    status, txns = request_json("/api/transactions?limit=500")
    if status != 200 or not isinstance(txns, list):
        record_fail("Fetch Transactions for Calculation Check", f"Status: {status}")
        return results

    expected_income = sum(t["amount"] for t in txns if t["type"] == "income")
    expected_expenses = sum(t["amount"] for t in txns if t["type"] == "expense")
    expected_balance = expected_income - expected_expenses
    expected_savings = max(0.0, expected_balance)
    expected_savings_rate = (expected_savings / expected_income * 100.0) if expected_income > 0 else 0.0

    status, summary = request_json("/api/analytics/summary")
    if status == 200:
        # Check Total Income
        if abs(summary["total_income"] - expected_income) < 0.01:
            record_pass("Total Income Calculation", f"DB: {expected_income} == API: {summary['total_income']}")
        else:
            record_fail("Total Income Calculation", f"Expected {expected_income}, got {summary['total_income']}")

        # Check Total Expenses
        if abs(summary["total_expenses"] - expected_expenses) < 0.01:
            record_pass("Total Expenses Calculation", f"DB: {expected_expenses} == API: {summary['total_expenses']}")
        else:
            record_fail("Total Expenses Calculation", f"Expected {expected_expenses}, got {summary['total_expenses']}")

        # Check Balance
        if abs(summary["current_balance"] - expected_balance) < 0.01:
            record_pass("Remaining Balance Calculation", f"DB: {expected_balance} == API: {summary['current_balance']}")
        else:
            record_fail("Remaining Balance Calculation", f"Expected {expected_balance}, got {summary['current_balance']}")

        # Check Savings
        if abs(summary["total_savings"] - expected_savings) < 0.01:
            record_pass("Total Savings Calculation", f"DB: {expected_savings} == API: {summary['total_savings']}")
        else:
            record_fail("Total Savings Calculation", f"Expected {expected_savings}, got {summary['total_savings']}")

        # Check Savings Rate
        if abs(summary["savings_rate"] - round(expected_savings_rate, 1)) < 0.1:
            record_pass("Savings Rate Percentage", f"DB: {round(expected_savings_rate, 1)}% == API: {summary['savings_rate']}%")
        else:
            record_fail("Savings Rate Percentage", f"Expected {expected_savings_rate}%, got {summary['savings_rate']}%")
    else:
        record_fail("Summary Endpoint", f"Status {status}")

    # ---------------------------------------------------------
    # TEST SUITE 3: Transactions CRUD & Persistence Audit
    # ---------------------------------------------------------
    print("\n--- 3. Transactions CRUD & Persistence Audit ---")

    # Add Income
    new_income_payload = {
        "description": "QA Audit Test Bonus Payment",
        "amount": 25000.0,
        "type": "income",
        "category": "Salary & Earnings",
        "date": "2026-11-05",
        "notes": "Automated QA Verification"
    }
    status, created_income = request_json("/api/transactions", method="POST", data=new_income_payload)
    if status == 201 and created_income.get("id"):
        income_id = created_income["id"]
        record_pass("Add Income Transaction", f"Created ID #{income_id} for amount {created_income['amount']}")
    else:
        record_fail("Add Income Transaction", f"Status {status}, response {created_income}")
        income_id = None

    # Add Expense with Auto-Categorisation
    new_expense_payload = {
        "description": "Swiggy dinner biryani and coke",
        "amount": 550.0,
        "type": "expense",
        "category": "Auto",
        "date": "2026-11-05"
    }
    status, created_expense = request_json("/api/transactions", method="POST", data=new_expense_payload)
    if status == 201 and created_expense.get("id"):
        expense_id = created_expense["id"]
        if created_expense.get("category") == "Food & Dining":
            record_pass("Add Expense & AI Auto-Categorisation", f"Auto-categorized as '{created_expense['category']}' (confidence: {round(created_expense.get('confidence', 0)*100)}%)")
        else:
            record_fail("Add Expense & AI Auto-Categorisation", f"Expected 'Food & Dining', got '{created_expense.get('category')}'")
    else:
        record_fail("Add Expense Transaction", f"Status {status}, response {created_expense}")
        expense_id = None

    # Edit Transaction
    if expense_id:
        update_payload = {"amount": 620.0, "notes": "Updated via QA Audit"}
        status, updated_tx = request_json(f"/api/transactions/{expense_id}", method="PUT", data=update_payload)
        if status == 200 and updated_tx.get("amount") == 620.0 and updated_tx.get("notes") == "Updated via QA Audit":
            record_pass("Edit Transaction", f"Updated ID #{expense_id} amount to 620.0")
        else:
            record_fail("Edit Transaction", f"Status {status}, response {updated_tx}")

    # Verify Persistence
    if expense_id:
        status, fetched_tx = request_json(f"/api/transactions/{expense_id}")
        if status == 200 and fetched_tx.get("amount") == 620.0:
            record_pass("Data Persistence Check", f"Fetched updated transaction from SQLite successfully")
        else:
            record_fail("Data Persistence Check", f"Status {status}, response {fetched_tx}")

    # Delete Transaction
    if expense_id:
        status, del_resp = request_json(f"/api/transactions/{expense_id}", method="DELETE")
        if status == 200 and del_resp.get("success"):
            record_pass("Delete Transaction", f"Deleted ID #{expense_id}")
        else:
            record_fail("Delete Transaction", f"Status {status}, response {del_resp}")

    # Clean up test income
    if income_id:
        request_json(f"/api/transactions/{income_id}", method="DELETE")

    # Search & Filtering Tests
    status, search_results = request_json("/api/transactions?q=Swiggy")
    if status == 200 and all("swiggy" in (t["description"].lower() + (t.get("notes") or "").lower()) for t in search_results):
        record_pass("Transaction Search Filter", f"Found {len(search_results)} matching 'Swiggy'")
    else:
        record_fail("Transaction Search Filter", f"Status {status}")

    status, cat_results = request_json("/api/transactions?category=Transportation")
    if status == 200 and all(t["category"] == "Transportation" for t in cat_results):
        record_pass("Transaction Category Filter", f"All {len(cat_results)} results have category='Transportation'")
    else:
        record_fail("Transaction Category Filter", f"Status {status}")

    status, type_results = request_json("/api/transactions?type=income")
    if status == 200 and all(t["type"] == "income" for t in type_results):
        record_pass("Transaction Type Filter", f"All {len(type_results)} results have type='income'")
    else:
        record_fail("Transaction Type Filter", f"Status {status}")

    # ---------------------------------------------------------
    # TEST SUITE 4: AI Model & Inference Audit
    # ---------------------------------------------------------
    print("\n--- 4. AI Categorisation Inference Audit ---")
    ai_test_cases = [
        ("Swiggy lunch order", "Food & Dining"),
        ("Uber ride", "Transportation"),
        ("Amazon purchase", "Shopping & Retail"),
        ("Electricity payment", "Bills & Utilities"),
        ("Netflix monthly subscription", "Entertainment"),
        ("Apollo Pharmacy medicine", "Healthcare & Medical"),
        ("Coursera specialization fee", "Education"),
        ("Zerodha mutual fund SIP", "Investment")
    ]

    for description, expected_cat in ai_test_cases:
        status, pred = request_json("/api/ai/predict", method="POST", data={"description": description})
        if status == 200:
            pred_cat = pred.get("predicted_category")
            conf = pred.get("confidence", 0)
            if pred_cat == expected_cat and conf > 0.5:
                record_pass(f"AI: '{description}'", f"-> {pred_cat} ({round(conf*100, 1)}% confidence)")
            else:
                record_fail(f"AI: '{description}'", f"Expected '{expected_cat}', got '{pred_cat}' ({round(conf*100, 1)}%)")
        else:
            record_fail(f"AI: '{description}'", f"HTTP {status}")

    status, metrics = request_json("/api/ai/metrics")
    if status == 200 and metrics.get("model_name") == "Multinomial Naive Bayes (TF-IDF)":
        record_pass("AI Model Architecture Verification", f"Algorithm: {metrics['model_name']}, Accuracy: {metrics['accuracy']}, Samples: {metrics['trained_samples_count']}")
    else:
        record_fail("AI Model Architecture Verification", f"Status {status}, metrics {metrics}")

    # ---------------------------------------------------------
    # TEST SUITE 5: Spending Analysis & Charts Data Audit
    # ---------------------------------------------------------
    print("\n--- 5. Spending Analysis & Charts Data Audit ---")
    status, trends = request_json("/api/analytics/monthly-trends")
    if status == 200 and isinstance(trends, list) and len(trends) > 0:
        record_pass("Monthly Trends Data", f"Returned {len(trends)} monthly aggregation buckets")
    else:
        record_fail("Monthly Trends Data", f"Status {status}, data {trends}")

    status, breakdown = request_json("/api/analytics/category-breakdown")
    if status == 200 and isinstance(breakdown, list) and len(breakdown) > 0:
        sum_breakdown = sum(b["amount"] for b in breakdown)
        status, current_summary = request_json("/api/analytics/summary")
        if abs(sum_breakdown - current_summary["total_expenses"]) < 0.1:
            record_pass("Category Breakdown Sum Integrity", f"Sum of breakdown ({sum_breakdown}) == Total Expenses ({current_summary['total_expenses']})")
        else:
            record_fail("Category Breakdown Sum Integrity", f"Breakdown sum {sum_breakdown} != Total Expenses {current_summary['total_expenses']}")
    else:
        record_fail("Category Breakdown Endpoint", f"Status {status}")

    # ---------------------------------------------------------
    # TEST SUITE 6: AI Savings Recommendations Audit
    # ---------------------------------------------------------
    print("\n--- 6. AI Savings Recommendations Audit ---")
    status, recs = request_json("/api/recommendations/savings")
    if status == 200 and isinstance(recs, list):
        record_pass("Fetch Savings Recommendations", f"Generated {len(recs)} tailored recommendations")
        all_positive = True
        for r in recs:
            if r["potential_savings"] <= 0:
                record_fail(f"Recommendation for {r['category']}", f"Potential savings <= 0: {r['potential_savings']}")
                all_positive = False
        if all_positive:
            record_pass("Positive Savings Checks", "All generated recommendations offer positive potential savings")
    else:
        record_fail("Fetch Savings Recommendations", f"Status {status}, recs {recs}")

    # ---------------------------------------------------------
    # TEST SUITE 7: Settings & Currency Persistence Audit
    # ---------------------------------------------------------
    print("\n--- 7. Settings & Currency Persistence Audit ---")
    status, orig_settings = request_json("/api/settings")
    if status == 200:
        record_pass("Fetch Settings", f"User: {orig_settings.get('user_name')}, Currency: {orig_settings.get('currency')} ({orig_settings.get('currency_symbol')})")

        # Test updating settings
        update_settings_payload = {
            "currency": "USD",
            "currency_symbol": "$",
            "monthly_budget": 55000.0
        }
        status, updated_settings = request_json("/api/settings", method="PUT", data=update_settings_payload)
        if status == 200 and updated_settings.get("currency") == "USD" and updated_settings.get("monthly_budget") == 55000.0:
            record_pass("Update Settings", f"Successfully updated currency to USD and budget to 55000")
        else:
            record_fail("Update Settings", f"Status {status}, response {updated_settings}")

        # Revert back to INR
        revert_payload = {
            "currency": orig_settings.get("currency", "INR"),
            "currency_symbol": orig_settings.get("currency_symbol", "₹"),
            "monthly_budget": orig_settings.get("monthly_budget", 50000.0)
        }
        status, reverted = request_json("/api/settings", method="PUT", data=revert_payload)
        if status == 200 and reverted.get("currency") == "INR":
            record_pass("Revert Settings", "Reverted settings back to INR (₹)")
        else:
            record_fail("Revert Settings", f"Status {status}")
    else:
        record_fail("Fetch Settings", f"Status {status}")

    # ---------------------------------------------------------
    # TEST SUITE 8: Error Handling & Validation
    # ---------------------------------------------------------
    print("\n--- 8. API Error Handling & Boundary Validation ---")

    # Invalid transaction ID
    status, _ = request_json("/api/transactions/999999")
    if status == 404:
        record_pass("404 on Nonexistent Transaction", "Correctly returned HTTP 404")
    else:
        record_fail("404 on Nonexistent Transaction", f"Expected 404, got {status}")

    # Negative amount
    status, _ = request_json("/api/transactions", method="POST", data={
        "description": "Invalid Negative Amount",
        "amount": -500.0,
        "type": "expense",
        "category": "Other & Miscellaneous",
        "date": "2026-11-05"
    })
    if status == 422:
        record_pass("422 Validation on Negative Amount", "Correctly blocked negative amount with HTTP 422")
    else:
        record_fail("422 Validation on Negative Amount", f"Expected 422, got {status}")

    # Empty description on predict
    status, _ = request_json("/api/ai/predict", method="POST", data={"description": "   "})
    if status == 400:
        record_pass("400 Validation on Empty AI Description", "Correctly rejected empty description with HTTP 400")
    else:
        record_fail("400 Validation on Empty AI Description", f"Expected 400, got {status}")

    print("\n" + "=" * 60)
    print(f"AUDIT SUMMARY: {len(results['passed'])} PASSED, {len(results['failed'])} FAILED")
    print("=" * 60)
    return results

if __name__ == "__main__":
    run_audit()
