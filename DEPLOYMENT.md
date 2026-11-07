# FinWise AI – Complete Deployment Guide (Vercel & Render)

This guide provides step-by-step instructions for deploying **FinWise AI**:
- **Frontend (React 19 + TypeScript + Tailwind):** Deployed to **Vercel**
- **Backend (FastAPI + Scikit-learn + SQLite):** Deployed to **Render** (Free Tier)

---

## Architecture Overview

```
+-------------------------------------------------------+
|                 VERCEL (Frontend)                     |
|  React 19 SPA | TypeScript | Tailwind CSS | Recharts  |
|  URL: https://finwise-ai-xxx.vercel.app               |
+-------------------------------------------------------+
                           |
                           | HTTPS REST API Calls
                           | (Configured via VITE_API_URL)
                           v
+-------------------------------------------------------+
|                 RENDER (Backend API)                  |
|  FastAPI | Scikit-learn ML Engine | SQLite Database   |
|  URL: https://finwise-ai-backend.onrender.com         |
+-------------------------------------------------------+
```

---

## Part 1: Deploy Backend to Render (Do this first)

Since the frontend needs the backend URL, deploy the backend first:

1. **Sign in to Render:**
   * Go to [https://render.com](https://render.com) and sign in with your GitHub account (`shrinidhirk0306-ui`).

2. **Create a New Web Service:**
   * Click **New +** → **Web Service**.
   * Select your repository: `shrinidhirk0306-ui/FinWise-AI`.

3. **Configure the Web Service:**
   * **Name:** `finwise-ai-backend` (or any name you like)
   * **Language:** `Python`
   * **Region:** Any region close to you (e.g. `Singapore` or `Frankfurt`)
   * **Branch:** `main`
   * **Root Directory:** `backend`
   * **Build Command:**
     ```bash
     pip install -r requirements.txt
     ```
   * **Start Command:**
     ```bash
     python -m uvicorn app.main:app --host 0.0.0.0 --port $PORT
     ```
   * **Instance Type:** `Free`

4. **Deploy:**
   * Click **Create Web Service**.
   * Render will automatically install dependencies, load the Scikit-learn model, seed the SQLite database, and start FastAPI.
   * Once deployed, copy your backend URL:
     `https://finwise-ai-backend.onrender.com`
   * Test it in your browser:
     `https://finwise-ai-backend.onrender.com/api/health`
     Should return: `{"status":"healthy","ml_model":"Multinomial Naive Bayes (TF-IDF)","model_trained":true}`

---

## Part 2: Deploy Frontend to Vercel

1. **Sign in to Vercel:**
   * Go to [https://vercel.com](https://vercel.com) and sign in with your GitHub account.

2. **Import Repository:**
   * Click **Add New...** → **Project**.
   * Choose your repository: `shrinidhirk0306-ui/FinWise-AI` and click **Import**.

3. **Configure Project Settings:**
   * **Framework Preset:** `Vite` (Vercel detects this automatically via `vercel.json`)
   * **Root Directory:** Leave as `./` (or select `frontend` — both work!)
   * **Build Command:** `npm run build` (or left default)
   * **Output Directory:** `frontend/dist` (or `dist` if root is set to `frontend`)

4. **Add Environment Variable (Crucial Step):**
   * Expand the **Environment Variables** section.
   * Add:
     * **Key:** `VITE_API_URL`
     * **Value:** `https://finwise-ai-backend.onrender.com` *(Paste your Render backend URL from Part 1)*
   * Click **Add**.

5. **Deploy:**
   * Click **Deploy**.
   * Vercel will build the React application in ~30 seconds.
   * Once complete, click your deployment URL (e.g., `https://finwise-ai.vercel.app`).

---

## Part 3: Verify the Live Deployment

1. **Open your Vercel URL:** `https://your-project.vercel.app`
2. **Dashboard Check:** Verify that Total Income, Total Expenses, and Recharts graphs render properly.
3. **Live AI Test:**
   * Go to **Transactions** → Click **Add Transaction**.
   * Type `"Swiggy lunch order"` in Description.
   * Observe the emerald badge auto-suggesting **Food & Dining** with ~97% confidence.
4. **Analytics Check:**
   * Navigate to **Spending Analysis** and **AI Recommendations** to verify data calculations.

---

## Troubleshooting & Tips

* **Render Free Tier Cold Starts:**
  Render's free tier spins down after 15 minutes of inactivity. When you open the frontend for the first time in a while, the first request may take 30–50 seconds while the backend boots up. Subsequent requests will be instant (<20ms).
* **CORS Settings:**
  The FastAPI backend has CORS enabled for all origins (`*`), so it will accept requests from any Vercel domain without errors.
* **Updating Code:**
  Whenever you `git push origin main`, both Vercel and Render will automatically rebuild and deploy your changes.

