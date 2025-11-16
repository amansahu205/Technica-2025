# 🚀 Frontend-Backend Integration Guide

Complete setup guide for deploying the **new InvestIQ frontend** (`code/`) with Python backend integration on **Cloudflare Pages**.

---

## 📋 Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Prerequisites](#prerequisites)
3. [Backend Setup (Python)](#backend-setup-python)
4. [Frontend Setup (Next.js + Cloudflare)](#frontend-setup-nextjs--cloudflare)
5. [Local Development](#local-development)
6. [Production Deployment](#production-deployment)
7. [Testing the Integration](#testing-the-integration)
8. [Troubleshooting](#troubleshooting)

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    Cloudflare Pages                          │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Next.js Static Site (code/)                         │   │
│  │  - React pages, components, UI                       │   │
│  │  - Client-side routing                               │   │
│  └──────────────────────────────────────────────────────┘   │
│                          │                                    │
│  ┌──────────────────────▼──────────────────────────────┐   │
│  │  Cloudflare Pages Functions (/functions/api/)       │   │
│  │                                                       │   │
│  │  ┌───────────────────┐  ┌────────────────────────┐  │   │
│  │  │ /api/company      │  │ /api/market-ticker     │  │   │
│  │  │ Proxy → Python    │  │ Proxy → Python         │  │   │
│  │  └───────────────────┘  └────────────────────────┘  │   │
│  │                                                       │   │
│  │  ┌──────────────────────────────────────────────┐   │   │
│  │  │ /api/assessment-adaptive/start & answer      │   │   │
│  │  │ Uses Cloudflare D1 Database                  │   │   │
│  │  └──────────────────────────────────────────────┘   │   │
│  └───────────────────────────────────────────────────────   │
│                          │                                    │
│  ┌──────────────────────▼──────────────────────────────┐   │
│  │  Cloudflare D1 Database (investiq)                  │   │
│  │  - quiz_sessions, quiz_answers                      │   │
│  │  - questions (30 imported)                          │   │
│  │  - users, assessments, lessons, etc.                │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                          │
                          │ HTTPS (proxied)
                          ▼
┌─────────────────────────────────────────────────────────────┐
│              Python Backend (Trae Server)                    │
│              Running on Fly.io / Your server                 │
│                                                               │
│  GET  /company/{ticker}        → Company data + financials   │
│  GET  /market-ticker           → Real-time ticker data       │
│  POST /insights/news           → News analysis               │
│  POST /learn/explain           → Concept explanations        │
│  POST /assessment/profile      → Profile assessment          │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  AlphaVantage API (with 5-min caching)              │   │
│  │  Yahoo Finance API                                   │   │
│  │  EDGAR Filings API                                   │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

**Key Points:**
- ✅ Frontend served as static HTML/CSS/JS from Cloudflare Pages
- ✅ Cloudflare Pages Functions handle API routing (serverless edge functions)
- ✅ D1 database for adaptive quiz (already set up with 30 questions)
- ✅ Python backend for financial data, market ticker, and AI insights
- ✅ AlphaVantage caching to avoid rate limits

---

## ✅ Prerequisites

### Required Accounts

1. **Cloudflare Account** ✓ (You have this)
   - Account ID: `8fbe13dc4c1d3112f8b00f01e1eaa6d4`
   - D1 Database ID: `fdb7c213-b732-4155-88c6-000900224c56`

2. **AlphaVantage API Key**
   - Get free key: https://www.alphavantage.co/support/#api-key
   - Free tier: 25 requests/day (our caching handles this)

3. **Backend Hosting** (Choose one):
   - **Option A:** Run locally (`http://127.0.0.1:8080`) for development
   - **Option B:** Deploy to Fly.io, Railway, or Render for production

### Required Tools

```bash
# Node.js 18+ and pnpm
node --version  # Should be >= 18
npm install -g pnpm

# Wrangler CLI (Cloudflare)
npm install -g wrangler

# Python 3.9+
python3 --version
```

---

## 🐍 Backend Setup (Python)

### Step 1: Set Environment Variables

Create `backend/.env`:

```bash
cd backend
cat > .env << 'EOF'
# AlphaVantage API Key (required for market ticker)
ALPHAVANTAGE_API_KEY=your_alphavantage_api_key_here

# FMP API Key (optional, for financial data)
FMP_API_KEY=your_fmp_api_key_if_you_have_one

# Server port
PORT=8080
EOF
```

### Step 2: Install Python Dependencies

```bash
cd backend
pip3 install -r requirements.txt
# or if you use a virtual environment:
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### Step 3: Start Backend Server

```bash
cd backend
python3 investiq_server.py
```

You should see:
```
Starting InvestIQ server on http://127.0.0.1:8080
```

### Step 4: Test Backend Endpoints

```bash
# Test company endpoint
curl http://127.0.0.1:8080/company/AAPL | jq

# Test market ticker (NEW!)
curl http://127.0.0.1:8080/market-ticker | jq

# Check cache status
curl http://127.0.0.1:8080/market-ticker/cache-status | jq
```

**Expected Response for `/market-ticker`:**
```json
[
  {
    "symbol": "AAPL",
    "price": 185.32,
    "change": 2.45,
    "changePercent": 1.34
  },
  {
    "symbol": "MSFT",
    "price": 378.91,
    "change": -1.22,
    "changePercent": -0.32
  },
  ...
]
```

---

## 🌐 Frontend Setup (Next.js + Cloudflare)

### Step 1: Install Dependencies

```bash
cd code
pnpm install
```

### Step 2: Configure Environment Variables

For **local development**, create `code/.env.local`:

```bash
# Python Backend URL (local development)
BACKEND_URL=http://127.0.0.1:8080
```

For **production**, you'll set this in Cloudflare Pages dashboard:
```bash
BACKEND_URL=https://your-backend-url.fly.dev
```

### Step 3: Verify Cloudflare Configuration

Check `code/wrangler.toml`:

```toml
name = "investiq-frontend"
compatibility_date = "2024-01-01"
account_id = "8fbe13dc4c1d3112f8b00f01e1eaa6d4"

[[d1_databases]]
binding = "DB"
database_name = "investiq"
database_id = "fdb7c213-b732-4155-88c6-000900224c56"
```

✅ This is already configured!

### Step 4: Verify D1 Database is Ready

The database should already have:
- ✅ 30 questions imported
- ✅ Adaptive quiz schema
- ✅ User tables

To verify:

```bash
cd code
export CLOUDFLARE_API_TOKEN='w-mSUZCOB10a6g-eHUPY0hlgV02Xn8yPdT66kvh3'
wrangler d1 execute investiq --remote --command "SELECT COUNT(*) FROM questions"
```

Expected output: `30` questions

---

## 💻 Local Development

### Option 1: Development Server (Recommended for Testing UI)

```bash
# Terminal 1: Start Python backend
cd backend
python3 investiq_server.py

# Terminal 2: Start Next.js dev server
cd code
pnpm dev
```

Open: http://localhost:3000

**Note:** In dev mode, API routes go to Next.js API routes (not Cloudflare Functions). These are **mocks** and won't work fully.

### Option 2: Test Cloudflare Functions Locally

```bash
# Terminal 1: Start Python backend
cd backend
python3 investiq_server.py

# Terminal 2: Start Cloudflare Pages dev server
cd code
export CLOUDFLARE_API_TOKEN='w-mSUZCOB10a6g-eHUPY0hlgV02Xn8yPdT66kvh3'
wrangler pages dev --compatibility-date=2024-01-01 --d1=DB=investiq -- pnpm dev
```

This runs the actual Cloudflare Functions with D1 database locally!

---

## 🚀 Production Deployment

### Step 1: Deploy Python Backend to Fly.io

```bash
cd backend

# Install flyctl
curl -L https://fly.io/install.sh | sh

# Login to Fly.io
fly auth login

# Create app
fly launch --name investiq-backend

# Set environment variables
fly secrets set ALPHAVANTAGE_API_KEY=your_key_here

# Deploy
fly deploy
```

Your backend will be at: `https://investiq-backend.fly.dev`

### Step 2: Build Next.js Static Site

```bash
cd code
pnpm run build
```

This creates `code/out/` with static files.

### Step 3: Deploy to Cloudflare Pages

#### Option A: Automatic (GitHub Integration)

1. Push code to GitHub
2. Go to Cloudflare Dashboard → Pages
3. Create new project → Connect to Git
4. Select repository
5. Build settings:
   - **Build command:** `pnpm run build`
   - **Build output directory:** `out`
   - **Root directory:** `code`
6. Environment variables:
   - `BACKEND_URL` = `https://investiq-backend.fly.dev`

#### Option B: Manual (Wrangler CLI)

```bash
cd code

# Login to Cloudflare
export CLOUDFLARE_API_TOKEN='w-mSUZCOB10a6g-eHUPY0hlgV02Xn8yPdT66kvh3'
wrangler login

# Deploy
wrangler pages deploy out --project-name=investiq-frontend

# Set environment variable
wrangler pages project create investiq-frontend
wrangler pages deployment create out --project-name=investiq-frontend --branch=main
```

### Step 4: Configure D1 Binding in Cloudflare Pages

1. Go to: Cloudflare Dashboard → Pages → investiq-frontend → Settings → Functions
2. Add D1 binding:
   - **Variable name:** `DB`
   - **D1 database:** `investiq`
3. Save

---

## 🧪 Testing the Integration

### Test 1: Market Ticker (Homepage)

1. Open: `https://your-site.pages.dev` or `http://localhost:3000`
2. You should see a ticker tape at the top with live stock prices
3. Prices should update every 30 seconds

**API Call:**
```bash
curl https://your-site.pages.dev/api/market-ticker
```

### Test 2: Company Dashboard

1. Go to: `/dashboard` page
2. Select a ticker (AAPL, MSFT, etc.)
3. Should load:
   - Company profile (name, sector, industry)
   - Stock price chart (1 year daily data)
   - Financial metrics (revenue, net income, ROE)
   - Volume trends

**API Call:**
```bash
curl https://your-site.pages.dev/api/company?ticker=AAPL
```

### Test 3: Adaptive Quiz

1. Go to: `/assessment-adaptive`
2. Click "Start Quiz"
3. Answer 10 questions
4. Should see:
   - Questions adapt in difficulty based on answers
   - Real-time level tracking
   - Final results with tier (Beginner/Intermediate/Advanced)
   - Progression chart

**API Calls:**
```bash
# Start quiz
curl -X POST https://your-site.pages.dev/api/assessment-adaptive/start \
  -H "Content-Type: application/json" \
  -d '{"userId":"test-user-123"}'

# Submit answer
curl -X POST https://your-site.pages.dev/api/assessment-adaptive/answer \
  -H "Content-Type: application/json" \
  -d '{"sessionId":"session_...","questionId":"q1","userAnswer":"B"}'
```

---

## 🐛 Troubleshooting

### Issue 1: "Failed to fetch company data from backend"

**Cause:** Python backend not running or BACKEND_URL incorrect

**Fix:**
```bash
# Check if backend is running
curl http://127.0.0.1:8080/company/AAPL

# Check environment variable
cd code
cat .env.local

# Should show: BACKEND_URL=http://127.0.0.1:8080
```

### Issue 2: "Question not found" or "No questions available"

**Cause:** D1 database doesn't have questions imported

**Fix:**
```bash
cd backend
export CLOUDFLARE_API_TOKEN='w-mSUZCOB10a6g-eHUPY0hlgV02Xn8yPdT66kvh3'

# Check question count
wrangler d1 execute investiq --remote --command "SELECT COUNT(*) FROM questions"

# If 0, reimport questions
wrangler d1 execute investiq --remote --file=questions-import.sql
```

### Issue 3: Market ticker shows "$0.00" for all stocks

**Cause:** AlphaVantage API key missing or rate limit exceeded

**Fix:**
```bash
# Check backend logs for API errors
cd backend
tail -f logs/server.log  # If logging is set up

# Check cache status
curl http://127.0.0.1:8080/market-ticker/cache-status

# Verify API key is set
cat backend/.env | grep ALPHAVANTAGE_API_KEY
```

### Issue 4: CORS errors in browser console

**Cause:** Python backend not sending CORS headers

**Fix:** Already handled in `backend/src/main.py`:
```python
self.send_header("Access-Control-Allow-Origin", "*")
```

If still getting errors, check backend logs.

### Issue 5: "Function not found" error on Cloudflare Pages

**Cause:** Functions directory not deployed correctly

**Fix:**
```bash
cd code

# Verify functions exist
ls -la functions/api/

# Should show:
# company.ts
# market-ticker.ts
# assessment-adaptive/start.ts
# assessment-adaptive/answer.ts

# Rebuild and redeploy
pnpm run build
wrangler pages deploy out --project-name=investiq-frontend
```

---

## 📊 API Reference

### Cloudflare Pages Functions

| Endpoint | Method | Description | Source |
|----------|--------|-------------|--------|
| `/api/company` | GET | Get company data | Proxies to Python backend |
| `/api/market-ticker` | GET | Get real-time ticker data | Proxies to Python backend |
| `/api/assessment-adaptive/start` | POST | Start adaptive quiz | D1 Database |
| `/api/assessment-adaptive/answer` | POST | Submit quiz answer | D1 Database |

### Python Backend Endpoints

| Endpoint | Method | Description | Data Source |
|----------|--------|-------------|-------------|
| `/company/{ticker}` | GET | Company profile, financials, filings | AlphaVantage, Yahoo Finance, EDGAR |
| `/market-ticker` | GET | Real-time prices for 10 stocks | AlphaVantage (cached 5 min) |
| `/market-ticker/cache-status` | GET | Debug: Cache status | In-memory cache |
| `/insights/news` | POST | Analyze news headline | AI/Rules-based |
| `/learn/explain` | POST | Explain financial concept | AI/Rules-based |
| `/assessment/profile` | POST | Assess user profile | Rules-based |

---

## 🎯 Next Steps

1. **Test locally** using the Local Development guide
2. **Deploy Python backend** to Fly.io or your preferred host
3. **Deploy frontend** to Cloudflare Pages
4. **Configure environment variables** in Cloudflare Pages dashboard
5. **Test all features** using the Testing section above

---

## 📚 Additional Resources

- **Cloudflare Pages Docs:** https://developers.cloudflare.com/pages/
- **Cloudflare D1 Docs:** https://developers.cloudflare.com/d1/
- **Next.js Static Export:** https://nextjs.org/docs/app/building-your-application/deploying/static-exports
- **AlphaVantage API:** https://www.alphavantage.co/documentation/
- **Fly.io Docs:** https://fly.io/docs/

---

**Questions?** Check the troubleshooting section or review the comparison report in the repository.

🚀 **Happy deploying!**
