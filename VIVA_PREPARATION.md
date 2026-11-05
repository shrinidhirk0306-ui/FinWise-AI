# FinWise AI – Comprehensive Viva Voce & Oral Examination Master Guide

**Course:** Artificial Intelligence for Finance (CIA-2 Assignment)  
**Student Name:** Shrinidhi Kotagiri  
**Degree:** B.Tech Computer Science & Engineering (Specialisation: Artificial Intelligence & Machine Learning)  
**Academic Year:** 2026–2027  
**Project Title:** FinWise AI – AI-Powered Personal Finance Management System  

---

## Quick Navigation Index

1. [Section 1: 1-Minute Project Pitch (Elevator Pitch)](#section-1-1-minute-project-pitch-elevator-pitch)
2. [Section 2: 3-Minute Complete Technical Walkthrough](#section-2-3-minute-complete-technical-walkthrough)
3. [Section 3: TF-IDF and Multinomial Naive Bayes Explained Simply](#section-3-tf-idf-and-multinomial-naive-bayes-explained-simply)
4. [Section 4: Step-by-Step Transaction Categorisation Workflow](#section-4-step-by-step-transaction-categorisation-workflow)
5. [Section 5: System Architecture: Frontend, Backend, Database, and REST API](#section-5-system-architecture-frontend-backend-database-and-rest-api)
6. [Section 6: The 78.85% Model Accuracy & Evaluation Explained](#section-6-the-7885-model-accuracy--evaluation-explained)
7. [Section 7: The 50/30/20 Budgeting Rule & AI Savings Engine](#section-7-the-503020-budgeting-rule--ai-savings-engine)
8. [Section 8: The 33 Automated QA Audit Tests](#section-8-the-33-automated-qa-audit-tests)
9. [Section 9: 30 Most Likely Viva Questions & Spoken Answers](#section-9-30-most-likely-viva-questions--spoken-answers)
10. [Section 10: Limitations & Future Enhancements (Academic Defense)](#section-10-limitations--future-enhancements-academic-defense)
11. [Section 11: 10 Challenging Deep-Dive Follow-Up Questions](#section-11-10-challenging-deep-dive-follow-up-questions)

---

# Section 1: 1-Minute Project Pitch (Elevator Pitch)

> **When Faculty says:** *"Shrinidhi, introduce your project in one minute."*

### Spoken Script:
> *"Good morning, respected professors. My name is Shrinidhi Kotagiri, and for my CIA-2 assignment in Artificial Intelligence for Finance, I built **FinWise AI** — an AI-Powered Personal Finance Management System.*
>
> *The core problem in personal finance is that over 65% of people abandon expense-tracking apps because manually picking categories for dozens of daily UPI, food delivery, and cab transactions is tedious and error-prone. Traditional spreadsheets only show historical numbers without giving actionable advice.*
>
> *FinWise AI solves this by embedding genuine Natural Language Processing and Supervised Machine Learning directly into the bookkeeping workflow. As the user types an expense like 'Swiggy lunch order' or 'Uber ride to college', our **TF-IDF Vectorizer and Multinomial Naive Bayes model** predicts the exact category in real-time with statistical confidence scoring, eliminating manual dropdowns.*
>
> *The system is built using a decoupled three-tier architecture: **React 19 with TypeScript and Tailwind CSS** on the frontend, an asynchronous **FastAPI backend in Python 3.13**, and a local ACID-compliant **SQLite database**. It also features a **50/30/20 financial health engine** that generates personalized savings tips. The entire system is production-verified with **33 out of 33 passed automated QA audit tests** and an empirical holdout model accuracy of **78.85%** across 10 classes. Thank you."*

---

# Section 2: 3-Minute Complete Technical Walkthrough

> **When Faculty says:** *"Explain your entire project architecture, the workflow, and what you have actually built in 3 minutes."*

### Spoken Script with Timing Breakdown:

#### [0:00 – 0:40] Problem & Core Motivation
> *"Personal budgeting fails because of high friction. When a user makes 5 to 10 digital micro-transactions a day, manually selecting categories like 'Food & Dining' or 'Transportation' causes cognitive fatigue. Users tag inconsistently or quit tracking within two weeks. Moreover, existing expense trackers are passive ledgers—they tell you how much you spent last month, but never warn you if your dining out is exceeding healthy financial thresholds."*

#### [0:40 – 1:30] The AI/ML Pipeline & Categorisation Engine
> *"To solve this, FinWise AI integrates an intelligent NLP classification engine. When the user enters an expense description, a custom React hook waits for 400 milliseconds of idle typing (debouncing) and sends an asynchronous request to our FastAPI backend.*
>
> *On the backend, our machine learning pipeline performs two key operations:*
> 1. *First, **Text Preprocessing and TF-IDF Vectorisation**: It strips punctuation, converts characters to lowercase, and generates unigrams and bigrams using sublinear term-frequency scaling.*
> 2. *Second, **Multinomial Naive Bayes Classification**: The model computes class likelihoods across 10 financial categories using Bayes' theorem with Laplace smoothing ($\alpha = 0.1$). It outputs the most likely category along with a calibrated softmax confidence percentage.*
>
> *The frontend automatically highlights the predicted category with an emerald AI badge before the user even clicks submit."*

#### [1:30 – 2:15] Full-Stack Architecture & Data Flow
> *"Our application follows a clean, decoupled three-tier architecture:*
> * **Presentation Tier:** Built with React 19, TypeScript, and Tailwind CSS. It uses Recharts for responsive SVG visualizations (cash flow area charts, category donuts, and budget meters) and a central `FinanceContext` state manager.*
> * **Application Tier:** Powered by Python FastAPI and Uvicorn. It exposes RESTful endpoints with Pydantic v2 schemas for strict data validation, handles CRUD operations, and manages the ML model singleton.*
> * **Data Tier:** An ACID-compliant SQLite database accessed through SQLAlchemy 2.0 ORM. It stores ledger transactions and user settings locally, guaranteeing 100% data privacy with zero cloud data leakage."*

#### [2:15 – 3:00] Financial Intelligence, Testing & Results
> *"Beyond categorization, FinWise AI implements a **50/30/20 Financial Health Engine**. It analyzes actual historical expenses against healthy benchmarks: 50% for Needs, 30% for Wants, and 20% for Savings and Investments. If discretionary categories like dining or retail exceed safe thresholds, it generates prioritized, actionable advice with concrete rupee limits and guaranteed positive savings.*
>
> *Finally, the application was thoroughly audited through an automated test script (`test_audit.py`). All **33 out of 33 tests passed (100% pass rate)**, verifying mathematical balance integrity, CRUD persistence, boundary validation, and ML inference. The model achieved a holdout test accuracy of **78.85%** across 258 samples. Thank you, professors. I am ready for your questions."*

---

# Section 3: TF-IDF and Multinomial Naive Bayes Explained Simply

> **Tip for Students:** If the examiner gives you a marker or asks you to explain the math on a whiteboard, use this simple example.

### 1. What is TF-IDF?
**TF-IDF** stands for **Term Frequency - Inverse Document Frequency**. It is a mathematical technique to convert text words into numerical numbers that a machine learning algorithm can understand.

* **Term Frequency (TF):** Measures how frequently a word appears in a specific description.
  $$\text{TF}(w, d) = \frac{\text{Count of word } w \text{ in description } d}{\text{Total words in } d}$$
  *(In our project, we use `sublinear_tf=True`, which calculates $\text{TF} = 1 + \log(\text{count})$ to prevent repeated words from dominating).*

* **Inverse Document Frequency (IDF):** Measures how rare or informative a word is across all descriptions in our entire training dataset. If a word appears in every transaction (like *"payment"* or *"order"*), it has low IDF (low importance). If a word appears only in food transactions (like *"swiggy"* or *"biryani"*), it has high IDF (high importance).
  $$\text{IDF}(w) = \log\left(\frac{N}{\text{DF}(w)}\right) + 1$$
  *(Where $N$ is total transactions in dataset, and $\text{DF}(w)$ is how many transactions contain word $w$)*.

$$\text{TF-IDF}(w, d) = \text{TF}(w, d) \times \text{IDF}(w)$$

#### Simple Whiteboard Example:
Suppose we have 3 training samples:
* $D_1$: *"Swiggy lunch order"* (Food & Dining)
* $D_2$: *"Swiggy dinner biryani"* (Food & Dining)
* $D_3$: *"Uber ride home"* (Transportation)

Total documents $N = 3$.
* The word **"Swiggy"** appears in 2 documents ($D_1, D_2$). Its IDF is moderate.
* The word **"lunch"** appears in only 1 document ($D_1$). Its IDF is very high, making it a strong signal for Food.
* The word **"ride"** appears in only 1 document ($D_3$). Its IDF is very high, making it a strong signal for Transportation.

---

### 2. What is Multinomial Naive Bayes?
**Multinomial Naive Bayes** is a probabilistic supervised classification algorithm based on **Bayes' Theorem**. It is called **"Multinomial"** because it models the discrete word counts (or TF-IDF feature weights) occurring in text.

#### The Core Formula (Bayes' Theorem):
$$P(\text{Category} \mid \text{Words}) = \frac{P(\text{Words} \mid \text{Category}) \times P(\text{Category})}{P(\text{Words})}$$

Where:
1. **$P(\text{Category})$ (Prior Probability):** The baseline likelihood of a category before reading the text. For example, if 15% of our training data is Food & Dining, $P(\text{Food}) = 0.15$.
2. **$P(\text{Words} \mid \text{Category})$ (Likelihood):** The probability that these specific words appear in this category.
3. **$P(\text{Category} \mid \text{Words})$ (Posterior Probability):** The probability that the transaction belongs to this category given the words typed. The category with the highest posterior probability is our prediction.

#### Why is it called "Naive"?
It is called naive because it makes a simplified assumption: **it assumes that all words in a description are completely independent of each other**.  
In reality, the word *"order"* often follows *"lunch"*, so they are not truly independent. But in practice, this assumption allows the model to compute predictions in less than 5 milliseconds with very low memory usage!

#### What is Laplace Smoothing ($\alpha = 0.1$)?
If a user enters a word that was never seen in a category during training (for example, *"zomato"* in Transportation), the probability $P(\text{"zomato"} \mid \text{Transportation})$ would be mathematically zero:
$$P(\text{Words} \mid \text{Category}) = P(w_1) \times P(w_2) \times 0 = 0$$
Multiplying by zero would wipe out all other words and break the model.  
**Laplace Smoothing** adds a tiny positive value ($\alpha = 0.1$) to both the numerator and denominator so no probability is ever zero:
$$P(w_i \mid C) = \frac{\text{Count}(w_i, C) + \alpha}{\sum \text{Count}(w, C) + \alpha \cdot |V|}$$
*(Where $|V|$ is vocabulary size)*.

---

# Section 4: Step-by-Step Transaction Categorisation Workflow

When faculty asks: *"Trace what happens from the moment a user types in the browser to when the database saves the transaction."*

```mermaid
sequenceDiagram
    autonumber
    actor User
    participant Modal as React UI (Modal)
    participant Hook as useDebounce (400ms)
    participant API as FastAPI Backend
    participant NLP as Text Preprocessor
    participant Model as Naive Bayes Engine
    participant DB as SQLite Database

    User->>Modal: Types "Swiggy lunch order"
    Modal->>Hook: Triggers debounce timer
    Note over Hook: Waits 400ms after last keystroke
    Hook->>API: POST /api/ai/predict {"description": "Swiggy lunch order"}
    API->>NLP: preprocess_text() -> "swiggy lunch order"
    NLP->>Model: TF-IDF vectorizer.transform()
    Model->>Model: model.predict_proba()
    Model-->>API: Category: "Food & Dining", Confidence: 97.4%
    API-->>Modal: JSON Response with predictions
    Modal->>Modal: Auto-selects "Food & Dining" + Displays Green AI Badge
    User->>Modal: Clicks "Save Transaction"
    Modal->>API: POST /api/transactions
    API->>DB: INSERT INTO transactions
    DB-->>API: 201 Created (ID #59)
    API-->>Modal: Refreshes Dashboard State
```

### Detailed Spoken Steps:
1. **User Keystroke:** The user opens the *"Add Transaction"* modal and types `"Swiggy lunch order"`.
2. **Debounce Optimization:** A custom React hook (`useDebounce`) waits **400 milliseconds** after the user stops typing. This prevents flooding the backend with an API call for every single letter.
3. **HTTP Dispatch:** The frontend sends an asynchronous `POST` request to `/api/ai/predict` containing `{"description": "Swiggy lunch order"}`.
4. **Backend Validation:** FastAPI receives the payload and validates it using a Pydantic model (`PredictRequest`).
5. **Text Preprocessing:** The backend function `preprocess_text()` cleans the text: converts to lowercase, applies regex `[^a-z0-9\s]` to remove special characters/symbols, and collapses extra spaces into a clean string: `"swiggy lunch order"`.
6. **Feature Extraction:** The preprocessed string is transformed using our fitted `TfidfVectorizer`, extracting unigrams (*"swiggy"*, *"lunch"*, *"order"*) and bigrams (*"swiggy lunch"*, *"lunch order"*).
7. **Probabilistic Inference:** The sparse feature vector is passed to `MultinomialNB.predict_proba()`. The model evaluates log-likelihoods across all 10 trained categories.
8. **Softmax Output:** The highest probability class is identified (`"Food & Dining"`) with a confidence of **97.4%**, along with the top 4 candidate categories.
9. **UI Auto-Selection:** The frontend receives the JSON response in **< 15 milliseconds**, automatically checks the `"Food & Dining"` radio button, and displays a glowing emerald badge saying: *"AI Suggested: Food & Dining (97% match)"*.
10. **Database Commit:** When the user clicks *"Add Transaction"*, the record is persisted to SQLite via SQLAlchemy with `is_ai_categorized = True` and `confidence = 0.974`.

---

# Section 5: System Architecture: Frontend, Backend, Database, and REST API

```
+--------------------------------------------------------------------------+
|                        PRESENTATION TIER (Browser)                       |
|  React 19 | TypeScript | Tailwind CSS | Recharts | Lucide Icons          |
|  - Dashboard Page        - Transactions Table        - AI Playground     |
|  - Spending Analytics    - Savings Recommendations   - Settings          |
|  - Global State: FinanceContext (React Context API)                      |
+--------------------------------------------------------------------------+
                                     |  HTTP / REST (JSON)
                                     v
+--------------------------------------------------------------------------+
|                       APPLICATION TIER (FastAPI / ASGI)                  |
|  Python 3.13 | Uvicorn Server | Pydantic v2 Schema Validation            |
|  Routers:                                                                |
|  - /api/transactions       : Full CRUD, search, filtering, CSV export    |
|  - /api/ai                 : predict, metrics, retrain                   |
|  - /api/analytics          : summary, monthly-trends, category-breakdown |
|  - /api/recommendations    : 50/30/20 heuristic savings advice           |
|  - /api/settings           : currency, monthly budget limits             |
+--------------------------------------------------------------------------+
             |                                             |
             v                                             v
+-------------------------------+             +----------------------------+
|        AI/ML ENGINE           |             |         DATA TIER          |
|  Scikit-learn | NumPy         |             |  SQLite (data/finwise.db)  |
|  - TfidfVectorizer (1, 2)     |             |  SQLAlchemy 2.0 ORM        |
|  - MultinomialNB (alpha=0.1)  |             |  Tables:                   |
|  - joblib model persistence   |             |  - transactions (Ledger)   |
|  - 258 samples / 10 classes   |             |  - settings (Preferences)  |
+-------------------------------+             +----------------------------+
```

### 1. Frontend Architecture
* **Framework:** React 19 Single Page Application (SPA) scaffolded with Vite.
* **Type Safety:** 100% written in **TypeScript** (`strict: true`). All API payloads, transaction models, and analytics objects have strict interfaces in `frontend/src/types/finance.ts`.
* **Styling:** **Tailwind CSS** using a custom fintech palette: Cream/Off-white background (`#FBFBFA`), Dark Navy typography (`#0F172A`), Slate borders, and Emerald green accents (`#059669`).
* **Charts:** **Recharts** library for hardware-accelerated SVG charts:
  * Area Chart: Monthly Income vs Expenses cash flow trend.
  * Donut / Pie Chart: Category-wise expense breakdown.
  * Bar Chart: Category probability distribution in the AI Diagnostics Playground.
  * Linear Progress Bar: Monthly budget consumption meter.
* **State Management:** React `Context` API (`FinanceContext`) providing application-wide reactive state for transactions, active currency, summaries, and settings without prop-drilling.

### 2. Backend Architecture
* **Framework:** **FastAPI** running on **Uvicorn** ASGI server.
* **Why FastAPI?** Native asynchronous request handling (`async`/`await`), automatic OpenAPI/Swagger documentation generation at `/docs`, and automatic JSON serialization.
* **Validation:** **Pydantic v2** models (`TransactionCreate`, `PredictRequest`, `SettingsUpdate`) enforce strict runtime data types, preventing malformed requests (e.g. negative transaction amounts trigger HTTP 422).
* **Modular Routers:** Endpoints are cleanly separated into dedicated modules under `backend/app/routers/`:
  * `transactions.py`
  * `ai.py`
  * `analytics.py`
  * `recommendations.py`
  * `settings.py`

### 3. Database Design
* **Database Engine:** **SQLite 3** (`data/finwise.db`).
* **Why SQLite?** Zero-configuration, serverless, self-contained, ACID-compliant file-based database. For a personal finance application, storing data locally ensures **100% user privacy** because financial records never leave the user's computer.
* **ORM:** **SQLAlchemy 2.0** handles declarative model mapping and connection pooling.
* **Tables:**
  1. `transactions` table:
     * `id` (INTEGER, Primary Key, Autoincrement)
     * `description` (VARCHAR, Indexed)
     * `amount` (FLOAT, Checked $> 0$)
     * `type` (VARCHAR: `'income'` or `'expense'`)
     * `category` (VARCHAR, 10 standardized categories)
     * `date` (VARCHAR: `YYYY-MM-DD`, Indexed)
     * `notes` (TEXT, Optional)
     * `is_ai_categorized` (BOOLEAN, Flag for AI audit)
     * `confidence` (FLOAT, Probability score $0.0 - 1.0$)
     * `created_at` (DATETIME)
  2. `settings` table:
     * `id` (INTEGER, Primary Key)
     * `user_name` (VARCHAR)
     * `currency` (VARCHAR: `'INR'`, `'USD'`, `'EUR'`, etc.)
     * `currency_symbol` (VARCHAR: `'₹'`, `'$'`, `'€'`)
     * `monthly_budget` (FLOAT)
     * `email_notifications` (BOOLEAN)
     * `theme` (VARCHAR)

---

# Section 6: The 78.85% Model Accuracy & Evaluation Explained

> **When Faculty asks:** *"What is your model's accuracy? How did you calculate it? Why isn't it 100%?"*

### 1. How Was the Accuracy Evaluated?
* In `backend/app/ml/classifier.py`, our training routine uses `scikit-learn`'s `train_test_split`:
  ```python
  X_train, X_test, y_train, y_test = train_test_split(
      texts, labels, test_size=0.2, random_state=42, stratify=labels
  )
  ```
* **Dataset Size:** 258 carefully curated real-world transaction descriptions across **10 distinct categories**.
* **Split Ratio:** 80% training (206 samples) and 20% holdout testing (52 samples).
* **Stratification (`stratify=labels`):** Ensures that every one of the 10 categories has equal proportional representation in both the training set and the test set.
* **Result:** The model correctly classified **41 out of 52** test transactions on unseen data:
  $$\text{Accuracy} = \frac{41}{52} \approx 0.78846 \rightarrow \mathbf{78.85\%}$$

### 2. Why is 78.85% a Strong, Realistic Result?
* **Random Guessing Baseline:** Because there are 10 classes, random guessing yields only $\frac{1}{10} = \mathbf{10\%}$ accuracy. Our model is nearly **8 times better than random baseline**.
* **Academic Honesty:** If an AI model trained on text reports 100% accuracy, it is almost certainly **overfitted** (memorizing the training data). Reporting an empirical holdout accuracy of 78.85% proves that the model is genuinely tested on unseen data.
* **After Holdout Testing:** Once the 78.85% validation metric was logged, the model was refit on all 258 samples for maximum vocabulary coverage in production.

### 3. Real Benchmark Predictions:
On common real-world transaction descriptions, the model demonstrates high predictive confidence:
* *"Swiggy lunch order"* $\rightarrow$ **Food & Dining** (**97.4%** confidence)
* *"Uber ride"* $\rightarrow$ **Transportation** (**94.0%** confidence)
* *"Electricity payment"* $\rightarrow$ **Bills & Utilities** (**95.1%** confidence)
* *"Netflix monthly subscription"* $\rightarrow$ **Entertainment** (**97.2%** confidence)
* *"Apollo Pharmacy medicine"* $\rightarrow$ **Healthcare & Medical** (**95.2%** confidence)
* *"Zerodha mutual fund SIP"* $\rightarrow$ **Investment** (**99.7%** confidence)
* *"Coursera specialization fee"* $\rightarrow$ **Education** (**82.2%** confidence)
* *"Amazon purchase"* $\rightarrow$ **Shopping & Retail** (**83.6%** confidence)

### 4. Where Does the Model Struggle? (Error Analysis)
* **Ambiguous Merchant Names:** Descriptions like *"Amazon payment"* could be Shopping, Books, or AWS Cloud bills.
* **Generic Single Words:** Typing just *"fee"* or *"bill"* without context.
* **Out-of-Vocabulary (OOV) Terms:** Brand names that were never in the training dataset (e.g. a small local bakery name). In this case, the model gracefully falls back to *"Other & Miscellaneous"* with 50% baseline confidence.

---

# Section 7: The 50/30/20 Budgeting Rule & AI Savings Engine

### 1. What is the 50/30/20 Rule?
The **50/30/20 rule** is an internationally recognized personal finance framework popularized by Harvard bankruptcy expert and U.S. Senator Elizabeth Warren. It divides monthly post-tax income into three distinct buckets:
1. **50% for Needs:** Essential non-negotiables required to survive and work (Rent, Groceries, Electricity, Healthcare, Basic Commute).
2. **30% for Wants:** Discretionary lifestyle choices that improve quality of life (Dining out, OTT streaming, Shopping, Movies, Hobbies).
3. **20% for Savings & Investments:** Building an emergency fund, retirement wealth, or paying down high-interest debt.

### 2. How FinWise AI Maps Categories to the Rule:

| Bucket | Allocation Target | Mapped FinWise AI Categories |
|:---|:---:|:---|
| **Needs** | $\le 50\%$ | `Bills & Utilities`, `Healthcare & Medical`, `Transportation`, `Education` |
| **Wants** | $\le 30\%$ | `Food & Dining`, `Shopping & Retail`, `Entertainment`, `Travel & Holidays` |
| **Savings / Wealth** | $\ge 20\%$ | `Investment` (Mutual funds, SIPs, Stocks, Deposits) |

### 3. The Recommendation Heuristic Engine
In `backend/app/routers/recommendations.py`, FinWise AI executes continuous heuristic analysis across historical expenses:

1. **Food & Dining Optimization:**
   * Benchmark threshold: $\le 15\%$ of monthly income.
   * If dining exceeds 22% of income, it flags a **HIGH URGENCY** alert.
   * Actionable Tip: *"Batch meal prep on Sundays and limit food delivery to twice weekly."*
2. **Shopping & Retail Impulse Control:**
   * If retail spend exceeds 20% of income, it recommends a **30% reduction target**.
   * Actionable Tip: *"Adopt the 48-hour rule: wait 2 full days before buying non-essential items online to verify genuine need."*
3. **Entertainment & Subscription Audit:**
   * Flags recurring subscriptions when monthly spend $> ₹1,000$.
   * Actionable Tip: *"Audit unused OTT platforms and rotate memberships (keep only 1-2 active streaming platforms per quarter)."*
4. **Investment Compounding Acceleration:**
   * If investments $< 20\%$ of monthly income, it computes the exact rupee shortfall.
   * Actionable Tip: *"Automate an additional SIP the day after salary credit so savings happen before discretionary spending."*
5. **Positive Savings Guarantee:** Every generated recommendation mathematically ensures $\text{Current Spend} > \text{Suggested Limit}$, guaranteeing positive monthly savings potential.

---

# Section 8: The 33 Automated QA Audit Tests

> **When Faculty asks:** *"How did you test your application? Did you just test it manually?"*

### Spoken Answer:
> *"No, sir/madam. In addition to manual UI testing, I wrote a complete end-to-end automated QA audit script in Python named `backend/test_audit.py`. It executes **33 distinct automated test cases** against the live running FastAPI backend and SQLite database. All **33 out of 33 tests passed with a 100% pass rate**."*

### Breakdown of the 8 Test Suites (Total: 33 Tests):

```
+-------------------------------------------------------------------------+
|                  FINWISE AI - QA AUDIT TEST BREAKDOWN                   |
+----+--------------------------------------------+-------+---------------+
| #  | Test Suite Name                            | Count | Status        |
+----+--------------------------------------------+-------+---------------+
| 1. | Backend Health & Connectivity              | 1     | PASS (100%)   |
| 2. | Dashboard Financial Math Verification      | 5     | PASS (100%)   |
| 3. | Transactions CRUD & Persistence            | 8     | PASS (100%)   |
| 4. | AI Model Inference & Architecture          | 9     | PASS (100%)   |
| 5. | Spending Analytics & Chart Data Integrity  | 2     | PASS (100%)   |
| 6. | AI Savings Recommendations Logic           | 2     | PASS (100%)   |
| 7. | Settings & Multi-Currency Persistence      | 3     | PASS (100%)   |
| 8. | API Error Handling & Boundary Validation   | 3     | PASS (100%)   |
+----+--------------------------------------------+-------+---------------+
|    | TOTAL AUDIT TESTS                          | 33    | 33/33 PASSED  |
+----+--------------------------------------------+-------+---------------+
```

#### Detailed Test Verification:
1. **Health Check (1 test):** Verified backend status 200 and ML model loaded.
2. **Dashboard Math (5 tests):** Calculated raw sum of all income and expenses in the SQLite database and proved that API values match with a delta of $0.00$:
   * Total Income calculation verified.
   * Total Expense calculation verified.
   * Remaining Balance ($\text{Income} - \text{Expenses}$) verified.
   * Total Savings ($\max(0, \text{Balance})$) verified.
   * Savings Rate Percentage verified.
3. **Transactions CRUD (8 tests):**
   * Created income record (ID #59).
   * Created expense record with `"Auto"` category and verified AI auto-categorized it as `"Food & Dining"` (97% confidence).
   * Edited transaction amount from $550$ to $620$.
   * Fetched transaction directly from SQLite to prove persistence.
   * Deleted transaction and verified cascade removal.
   * Verified search query filter (`?q=Swiggy`).
   * Verified category filter (`?category=Transportation`).
   * Verified type filter (`?type=income`).
4. **AI Inference Benchmark (9 tests):** Verified that 8 real merchant benchmark descriptions (Swiggy, Uber, Amazon, Electricity, Netflix, Apollo, Coursera, Zerodha) correctly predict expected categories with $>80\%$ confidence, plus 1 test verifying model architecture metadata.
5. **Spending Analytics (2 tests):** Verified monthly aggregation buckets and proved that the sum of all category breakdown amounts exactly equals total expenses ($0.00$ difference).
6. **AI Savings Recommendations (2 tests):** Verified recommendation generation and guaranteed that potential savings are positive ($> 0$).
7. **Settings Persistence (3 tests):** Fetched user settings, toggled currency from INR (₹) to USD ($) and budget to $55,000$, confirmed SQLite persistence, and reverted cleanly to INR.
8. **Error Handling & Boundary Validation (3 tests):**
   * Nonexistent transaction ID returns HTTP **404 Not Found**.
   * Negative transaction amount (`-500.0`) returns HTTP **422 Unprocessable Entity**.
   * Empty string sent to AI predict returns HTTP **400 Bad Request**.

---

# Section 9: 30 Most Likely Viva Questions & Spoken Answers

### Category A: General & Conceptual (Q1 – Q5)

#### Q1: What is the main objective of FinWise AI?
> **Answer:** *"FinWise AI is designed to eliminate the friction of personal bookkeeping. It uses machine learning to automatically categorize transaction descriptions in real-time, visualizes spending patterns through responsive charts, and uses the 50/30/20 budgeting rule to provide personalized, actionable savings guidance."*

#### Q2: Why did you choose an AI-based solution instead of traditional keyword matching (like `if 'uber' in text: category = 'Travel'`)?
> **Answer:** *"Rule-based keyword matching is rigid, difficult to maintain, and breaks easily with spelling variations or unseen words. Machine learning using TF-IDF and Naive Bayes understands statistical word associations, supports bigrams (two-word phrases), handles unseen combinations, and outputs a statistical confidence score, which static if-else statements cannot do."*

#### Q3: What is the role of Artificial Intelligence in personal finance?
> **Answer:** *"In personal finance, AI automates repetitive tasks like transaction classification, identifies spending anomalies, predicts cash flow trends, and provides personalized recommendations to help users optimize savings without requiring manual spreadsheet formulas."*

#### Q4: What are the three tiers in your system architecture?
> **Answer:** *"The three tiers are:  
> 1. Presentation Tier: React 19, TypeScript, and Tailwind CSS running in the browser.  
> 2. Application Tier: Python FastAPI and Uvicorn providing asynchronous REST APIs and the Scikit-learn ML engine.  
> 3. Data Tier: SQLite database managed via SQLAlchemy 2.0 ORM for ACID-compliant local storage."*

#### Q5: Is FinWise AI a prototype or a working full-stack application?
> **Answer:** *"It is a fully working, production-grade full-stack application. It has an active backend server, a live React frontend, an ACID-compliant SQLite database, a trained Scikit-learn model, and 33 automated QA audit tests verifying all operations."*

---

### Category B: Machine Learning & NLP (Q6 – Q11)

#### Q6: Which machine learning algorithm is used, and what type of learning is it?
> **Answer:** *"We use the **Multinomial Naive Bayes** classifier paired with a **TF-IDF Vectorizer**. It is a **Supervised Learning** algorithm because it was trained on labeled pairs of transaction descriptions and their corresponding financial categories."*

#### Q7: What are the 10 financial categories supported by your model?
> **Answer:** *"The 10 categories are:  
> 1. Food & Dining  
> 2. Transportation  
> 3. Shopping & Retail  
> 4. Bills & Utilities  
> 5. Entertainment  
> 6. Healthcare & Medical  
> 7. Education  
> 8. Investment  
> 9. Travel & Holidays  
> 10. Other & Miscellaneous."*

#### Q8: What text preprocessing steps do you perform before feeding text to the model?
> **Answer:** *"In `preprocess_text()`, we perform three steps:  
> 1. Lowercasing: Converts all characters to lowercase so 'Uber' and 'uber' are treated identically.  
> 2. Regex Cleaning: Uses `re.sub(r'[^a-z0-9\s]', ' ', text)` to remove punctuation, symbols, and currency characters.  
> 3. Whitespace Collapsing: Trims extra spaces into single spaces."*

#### Q9: What does the confidence score represent in your application?
> **Answer:** *"The confidence score is the calibrated posterior class probability output by `predict_proba()` via softmax normalization. For example, a 97.4% confidence score for 'Swiggy' means the model calculates a 97.4% mathematical probability that this transaction belongs to Food & Dining compared to all other 9 categories."*

#### Q10: What are n-grams, and why did you use `ngram_range=(1, 2)`?
> **Answer:** *"An n-gram is a contiguous sequence of $n$ words. A unigram ($n=1$) is a single word like 'coffee', while a bigram ($n=2$) is a two-word pair like 'coffee shop' or 'credit card'. We used `(1, 2)` so the model captures both individual merchant names and important two-word phrases that give contextual meaning."*

#### Q11: What is Laplace smoothing, and why did you set $\alpha = 0.1$?
> **Answer:** *"Laplace smoothing prevents the 'zero-frequency problem' where an unseen word causes a class probability to become zero, wiping out all calculations. Setting $\alpha = 0.1$ provides mild smoothing that avoids zero probabilities while keeping strong word signals dominant."*

---

### Category C: Model Training & Evaluation (Q12 – Q16)

#### Q12: How many samples are in your training dataset, and how was it created?
> **Answer:** *"Our dataset contains 258 realistic financial descriptions across 10 categories. It was curated using real-world merchant names (Swiggy, Zomato, Uber, Amazon, Netflix, Zerodha, Apollo) and everyday consumer expenses."*

#### Q13: How did you evaluate your model, and what was the test accuracy?
> **Answer:** *"We evaluated the model using a stratified 80:20 train-test split (`test_size=0.2, random_state=42, stratify=labels`) on the 258 samples. The model achieved a holdout accuracy of **78.85%** (correctly predicting 41 out of 52 unseen test samples)."*

#### Q14: Why is 78.85% considered a good result for this project?
> **Answer:** *"Because random guessing across 10 categories gives only 10% accuracy, so 78.85% is nearly 8 times better. More importantly, it reflects genuine generalization on unseen test data rather than overfitted memorization. On distinct merchant keywords, its confidence exceeds 94% to 99%."*

#### Q15: How does the model persist its learned weights so it doesn't retrain on every request?
> **Answer:** *"We use Python's **`joblib`** library to serialize and save the trained model to `backend/app/ml/saved_models/naive_bayes_model.joblib` and the vectorizer to `tfidf_vectorizer.joblib`. When FastAPI starts, it loads these binary files into memory once as a singleton."*

#### Q16: Can your model learn from new transactions entered by the user?
> **Answer:** *"Yes. FinWise AI includes a dynamic retraining endpoint (`POST /api/ai/retrain`). It queries user-confirmed transactions from the SQLite database, combines them with base training data, refits the model, and updates the persisted weights on disk."*

---

### Category D: Backend, FastAPI & REST (Q17 – Q21)

#### Q17: Why did you choose FastAPI instead of Flask or Django?
> **Answer:** *"FastAPI is built on modern ASGI standards and Starlette, making it asynchronous and significantly faster than Flask. It also provides automatic request validation using Pydantic, built-in interactive Swagger documentation at `/docs`, and native support for Python type hints."*

#### Q18: What is Uvicorn?
> **Answer:** *"Uvicorn is a lightning-fast ASGI (Asynchronous Server Gateway Interface) web server implementation for Python. It acts as the production server that listens for incoming HTTP requests and delivers them to our FastAPI application."*

#### Q19: What is the purpose of Pydantic in your backend?
> **Answer:** *"Pydantic handles data parsing, schema declaration, and runtime validation. For instance, if a user tries to send a negative amount or a blank string, Pydantic immediately catches it and returns a descriptive HTTP 422 error before it touches our database."*

#### Q20: What are the main HTTP status codes returned by your API?
> **Answer:** *"Our API strictly adheres to REST standards:  
> * `200 OK`: Successful data retrieval, update, or deletion.  
> * `201 Created`: Successful creation of a new transaction.  
> * `400 Bad Request`: Invalid input (e.g., blank text to AI predict).  
> * `404 Not Found`: Nonexistent transaction ID.  
> * `422 Unprocessable Entity`: Validation failures (e.g. negative amount)."*

#### Q21: What is CORS, and why did you configure it?
> **Answer:** *"CORS stands for Cross-Origin Resource Sharing. Because our React frontend runs on port 5173 and our FastAPI backend runs on port 8000, the browser blocks communication by default for security. We configured `CORSMiddleware` in FastAPI to safely allow requests from `http://localhost:5173`."*

---

### Category E: Database & Storage (Q22 – Q24)

#### Q22: Why did you choose SQLite over MySQL, PostgreSQL, or MongoDB?
> **Answer:** *"SQLite is serverless, zero-configuration, and stores the entire database in a single local file (`data/finwise.db`). For personal finance, privacy is paramount—SQLite ensures 100% of financial data stays on the user's machine without transmitting sensitive bank records to third-party cloud servers."*

#### Q23: What is SQLAlchemy, and what role does it play?
> **Answer:** *"SQLAlchemy is an Object-Relational Mapper (ORM). Instead of writing raw SQL queries like `SELECT * FROM transactions`, SQLAlchemy allows us to interact with database records as Python objects (`db.query(TransactionModel)`). This prevents SQL injection and provides type safety."*

#### Q24: How does your database ensure ACID compliance?
> **Answer:** *"SQLite natively implements ACID properties:  
> * **Atomicity:** Transactions are committed or rolled back completely.  
> * **Consistency:** Check constraints ensure amounts cannot be negative.  
> * **Isolation:** File locking prevents conflicting simultaneous writes.  
> * **Durability:** Writes are synced to the filesystem so data persists across app restarts."*

---

### Category F: Frontend, React & UI/UX (Q25 – Q27)

#### Q25: Why did you choose React 19 and TypeScript?
> **Answer:** *"React 19 provides a fast, component-driven reactive user interface with efficient DOM reconciliation. TypeScript adds static type checking during development, catching missing object properties and mismatched API schemas before the code ever runs in the browser."*

#### Q26: What is debouncing, and why is it used in the Add Transaction modal?
> **Answer:** *"Debouncing is a programming pattern that delays executing a function until the user stops performing an action for a set period. In our modal, our `useDebounce` hook waits 400 milliseconds after the user stops typing before calling the AI predict API. This prevents triggering 20 unnecessary API requests while typing a 20-letter sentence."*

#### Q27: How does your frontend manage state across different pages?
> **Answer:** *"We use React's Context API through `FinanceContext`. It acts as a central store that holds transactions, summaries, active currency, and settings. Whenever a user adds or deletes a transaction, the context updates and automatically refreshes all charts and dashboard cards without reloading the page."*

---

### Category G: Finance & Recommendations (Q28 – Q30)

#### Q28: How does FinWise AI calculate the current balance and savings?
> **Answer:** *"Current Balance is calculated as Total Inflows (Income) minus Total Outflows (Expenses):  
> $$\text{Balance} = \sum \text{Income} - \sum \text{Expenses}$$  
> Total Savings is defined as the surplus remaining: $\max(0, \text{Balance})$.  
> Savings Rate is calculated as:  
> $$\text{Savings Rate} = \left(\frac{\text{Savings}}{\text{Income}}\right) \times 100$$"*

#### Q29: What is the 48-hour rule suggested in your Shopping recommendations?
> **Answer:** *"The 48-hour rule is a proven behavioral finance technique: whenever a user wants to purchase a non-essential retail item online, they wait 48 hours before checking out. In over 70% of cases, the impulse fades and the user decides not to buy, curbing unnecessary discretionary spending."*

#### Q30: How does FinWise AI ensure that its savings recommendations are realistic and achievable?
> **Answer:** *"Instead of demanding that users stop spending altogether, the algorithm suggests gradual, capped reductions (e.g. reducing dining out by 20% or shopping by 30%) and pairs every limit with a concrete behavioral tip, like rotating streaming subscriptions or batch cooking."*

---

# Section 10: Limitations & Future Enhancements (Academic Defense)

> **Crucial Tip for Students:** Faculty respect students who understand their project's real limitations. Never claim your project is "flawless". Present your limitations maturely and explain how they will be solved in future work.

```
+-------------------------------------------------------------------------------+
|                       HONEST ACADEMIC DEFENSE MATRIX                          |
+----+------------------------------------+-------------------------------------+
| #  | Current System Limitation          | Proposed Future Solution            |
+----+------------------------------------+-------------------------------------+
| 1. | Dataset is 258 curated samples.    | Ingest open banking public datasets |
|    | Can miss rare regional brands.     | & enable crowd-sourced tagging.     |
+----+------------------------------------+-------------------------------------+
| 2. | English language descriptions      | Multi-lingual tokenization & support|
|    | only.                              | for regional transliteration.       |
+----+------------------------------------+-------------------------------------+
| 3. | Manual typing or CSV upload.       | Automated SMS notification parsing  |
|    | No direct bank account linking.    | & PDF bank statement reader.        |
+----+------------------------------------+-------------------------------------+
| 4. | Single-user local SQLite database. | Multi-tenant PostgreSQL database    |
|    | No login/password auth.            | with JWT bearer token auth.         |
+----+------------------------------------+-------------------------------------+
| 5. | Naive Bayes treats words           | Fine-tune lightweight Transformer   |
|    | independently (Bag of Words).      | (DistilBERT) for semantic nuances.  |
+----+------------------------------------+-------------------------------------+
```

### Scripted Answer When Faculty Asks:
> *"What are the limitations of your project, Shrinidhi?"*
>
> *"Sir/Madam, while FinWise AI is a complete, working system, it has five real limitations that I have documented in my report:  
> 1. **Dataset Scope:** Our training dataset has 258 samples. While it covers major national brands like Swiggy, Uber, and Amazon, it can struggle with niche local merchants.  
> 2. **Language:** It currently supports English text descriptions and does not handle regional languages.  
> 3. **Manual Entry:** Users must enter descriptions manually or via CSV export; we do not yet have automated bank SMS scraping.  
> 4. **Single-User Architecture:** The system uses a local SQLite database for personal privacy, so it does not have multi-user login with passwords.  
> 5. **Bag-of-Words Assumption:** Naive Bayes assumes word independence, so it cannot understand complex sentences with negated context like 'refund for food order'.  
>
> In the future, I plan to add OAuth2 multi-user authentication, PDF statement parsing using `pdfplumber`, and a hybrid fallback using the Gemini API for zero-shot text classification."*

---

# Section 11: 10 Challenging Deep-Dive Follow-Up Questions

These are the tough questions examiners ask when they want to test if you truly wrote the code or just copied a tutorial. Read these carefully!

---

### Q1: Why didn't you use a Deep Learning Transformer model like BERT or GPT-4 for classification?
> **Answer:** *"For transaction categorization, descriptions are typically very short (2 to 5 words, like 'Swiggy lunch' or 'Uber cab'). Large Language Models and BERT have hundreds of millions of parameters, require heavy GPUs, have high memory footprints (>500MB), and take 100 to 500 milliseconds per inference. In contrast, TF-IDF + Multinomial Naive Bayes executes in **under 3 milliseconds on a standard CPU**, uses less than 20MB of RAM, and runs completely offline with zero API costs. For this specific real-time micro-classification task, Naive Bayes is far more efficient."*

---

### Q2: Why is the Naive assumption technically violated in natural language, and why does Naive Bayes still work so well?
> **Answer:** *"The naive assumption states that words appear independently given the class:  
> $$P(w_1, w_2 \mid C) = P(w_1 \mid C) \cdot P(w_2 \mid C)$$  
> In real language, this is mathematically false because words depend heavily on grammar and context. However, empirical machine learning research (notably by Domingos & Pazzani) proved that even when probability estimates are skewed, **the rank order of probabilities remains correct**. As long as the correct category has the highest relative score, the classification decision is accurate."*

---

### Q3: What happens mathematically when an Out-of-Vocabulary (OOV) word is passed to your model?
> **Answer:** *"When a word is completely unknown (not in the vocabulary learned during `fit()`), the `TfidfVectorizer.transform()` method ignores it, producing a vector of all zeros. If all words in a description are unknown, our backend code catches this condition and safely returns `'Other & Miscellaneous'` with a baseline 50% confidence, preventing any mathematical crash or division-by-zero error."*

---

### Q4: What is `sublinear_tf=True` in your TfidfVectorizer, and why did you enable it?
> **Answer:** *"Normally, Term Frequency is proportional to raw count (a word appearing 10 times gets 10 times higher weight than a word appearing once). In financial descriptions, if a user accidentally types 'Uber Uber Uber ride', raw TF would artificially inflate the importance of 'Uber' by 300%. `sublinear_tf=True` replaces raw count with:  
> $$\text{TF} = 1 + \log(\text{count})$$  
> This logarithmic dampening prevents repeated words from dominating the feature vector."*

---

### Q5: How does your backend prevent SQL Injection attacks?
> **Answer:** *"We use SQLAlchemy 2.0 ORM. SQLAlchemy uses **parameterized queries** under the hood. When values are passed into `.filter()` or model attributes, SQLAlchemy escapes them and treats user input strictly as literal values rather than executable SQL statements, completely neutralizing SQL injection risks."*

---

### Q6: What is the difference between `model.predict()` and `model.predict_proba()`?
> **Answer:** *"`model.predict()` outputs only a single discrete label (e.g. `'Food & Dining'`). `model.predict_proba()` computes the full probability distribution across all 10 classes using softmax normalization. We use `predict_proba()` because our UI requires both the top predicted category and its exact statistical confidence percentage, as well as the top 4 candidates for our AI Diagnostics Playground."*

---

### Q7: Why did you choose SQLite over a NoSQL database like MongoDB?
> **Answer:** *"Financial transaction ledgers require strict **ACID compliance** (Atomicity, Consistency, Isolation, Durability) to ensure money calculations are mathematically exact. Relational databases like SQLite enforce check constraints, foreign keys, and transaction rollbacks. NoSQL document stores like MongoDB prioritize eventual consistency and schema flexibility, which is unnecessary and risky for structured financial accounting."*

---

### Q8: What would happen if there was severe class imbalance in your dataset?
> **Answer:** *"If one category had 200 samples and another had only 5 samples, the model's prior probability $P(\text{Category})$ would heavily bias predictions toward the dominant class. To prevent this, our training dataset maintains a balanced distribution across all 10 categories (~25 samples each), and our training split uses `stratify=labels` to ensure equal proportional representation in the test set."*

---

### Q9: Why is the debounce time set to exactly 400 milliseconds in your React frontend?
> **Answer:** *"400 milliseconds is the sweet spot in human-computer interaction (HCI). Studies show that the average human keystroke interval during typing is between 150ms and 250ms. Setting debounce below 250ms triggers premature API calls mid-word. Setting it above 600ms makes the UI feel sluggish. 400ms ensures the user has paused typing before the AI inference fires, creating a snappy, seamless experience."*

---

### Q10: How do you verify that your financial calculations (balance, income, expenses) are mathematically correct?
> **Answer:** *"In our automated test script `backend/test_audit.py`, Test Suite 2 queries all raw transaction rows directly from the SQLite database, computes the sum of positive income rows and negative expense rows in Python, and compares them with the JSON summary returned by `/api/analytics/summary`. The test asserts that the difference (delta) is strictly less than 0.01. All calculations verified with a delta of 0.00."*

---

## Final Examination Checklist for Shrinidhi:
* [x] Know your 1-minute pitch by heart.
* [x] Keep your project running on `http://127.0.0.1:5173` (Frontend) and `http://127.0.0.1:8000/docs` (Backend).
* [x] Remember the exact numbers: **78.85%** accuracy, **258** samples, **10** categories, **33/33** passed tests.
* [x] If asked to demonstrate, open the **AI Categorisation Playground** and type *"Swiggy lunch order"* or *"Uber ride"* to show live probability bars.
* [x] Maintain calm, confident, and professional academic posture. Good luck!

