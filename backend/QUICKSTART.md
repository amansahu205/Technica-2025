# 🚀 Backend Quick Start Guide

## ⚡ 1-Minute Setup

```bash
# 1. You already have the API key configured! ✅
cat .env
# Should show: ALPHAVANTAGE_API_KEY=8RHIFK2WEFG2NV7Z

# 2. Start the backend
./start-backend.sh

# 3. In a new terminal, test it
./test-backend.sh
```

## 📋 What's Running

When you start the backend, you'll have these endpoints available:

### **New Endpoints** (Added for new frontend):
- `GET /market-ticker` - Real-time stock prices (10 tickers)
- `GET /market-ticker/cache-status` - Cache debug info

### **Existing Endpoints**:
- `GET /company/{ticker}` - Company data (profile, financials, charts)
- `POST /insights/news` - Analyze news headlines
- `POST /learn/explain` - Explain financial concepts
- `POST /assessment/profile` - User profile assessment

## 🧪 Quick Test

```bash
# Test market ticker
curl http://127.0.0.1:8080/market-ticker | jq

# Test company data
curl http://127.0.0.1:8080/company/AAPL | jq

# Check cache status
curl http://127.0.0.1:8080/market-ticker/cache-status | jq
```

## ⚙️ Environment Variables

Your `.env` file is configured with:
- ✅ **ALPHAVANTAGE_API_KEY**: For market data (already set!)
- ✅ **PORT**: Server port (default: 8080)

## 📊 AlphaVantage API Limits

- **Free tier**: 25 requests/day
- **Our caching**: 5 minutes per ticker
- **Smart fetching**: Only fetches when cache expires

This means with 10 tickers:
- First load: Uses 10 API calls
- Next 5 minutes: Uses 0 API calls (served from cache)
- After 5 minutes: Refreshes only expired tickers

You can make ~100+ frontend requests per day without hitting limits! 🎉

## 🐛 Troubleshooting

### "Module not found" error
```bash
# Install Python dependencies
pip3 install -r requirements.txt
```

### "API key not set" error
```bash
# Verify .env file exists
cat .env

# Should show your API key
# If not, create it:
echo "ALPHAVANTAGE_API_KEY=8RHIFK2WEFG2NV7Z" > .env
```

### CORS errors in browser
Already handled! The server sends:
```
Access-Control-Allow-Origin: *
```

## 📁 Project Structure

```
backend/
├── .env                    ← Your API keys (✅ configured)
├── start-backend.sh        ← Quick start script
├── test-backend.sh         ← Test all endpoints
├── investiq_server.py      ← Entry point
└── src/
    ├── main.py            ← HTTP server & routing
    ├── config.py          ← Environment config
    └── api/
        ├── company.py         ← Company data endpoint
        ├── market_ticker.py   ← NEW: Market ticker (cached)
        ├── insights.py        ← News insights
        ├── learn.py           ← Learn explanations
        └── assessment.py      ← Profile assessment
```

## 🎯 Next Steps

1. **Start backend**: `./start-backend.sh`
2. **Test endpoints**: `./test-backend.sh`
3. **Start frontend**: `cd ../code && pnpm dev`
4. **Open app**: http://localhost:3000

See `FRONTEND_BACKEND_INTEGRATION.md` for full deployment guide!
