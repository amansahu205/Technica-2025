# 🚀 InvestIQ Backend

Python backend for InvestIQ - AI-powered investing education platform.

---

## 🏆 Hackathon Deployment Options

### Option 1: Vultr Cloud ⭐ **Recommended for MLH Prize**

**Win portable screens for your team!**

```bash
./deploy-to-vultr.sh
```

**Benefits:**
- ✅ Compete for MLH "Best Use of Vultr" prize
- ✅ Free cloud credits ($50-100)
- ✅ High-performance infrastructure
- ✅ Simple web-based deployment
- ✅ Portable screens prize! 🏆

**See:** [DEPLOY_VULTR.md](./DEPLOY_VULTR.md) for complete guide

### Option 2: Fly.io

**Free tier, automatic deployment**

```bash
./deploy-to-fly.sh
```

**Benefits:**
- ✅ Completely free (within limits)
- ✅ Zero-downtime deployments
- ✅ Global edge network
- ✅ Automatic HTTPS

**See:** [DEPLOYMENT.md](./DEPLOYMENT.md) for complete guide

---

## 🚀 Quick Start (Local Development)

```bash
# 1. Start backend
./start-backend.sh

# 2. Test endpoints
./test-backend.sh

# 3. Backend runs on http://127.0.0.1:8080
```

**See:** [QUICKSTART.md](./QUICKSTART.md) for details

---

## 📋 API Endpoints

### Market Data
- `GET /market-ticker` - Real-time stock prices (10 tickers)
- `GET /market-ticker/cache-status` - Cache debug info
- `GET /company/{ticker}` - Company profile, financials, charts

### AI Features
- `POST /insights/news` - Analyze news headlines
- `POST /learn/explain` - Explain financial concepts
- `POST /assessment/profile` - Assess user knowledge

---

## 🔑 Environment Variables

Required in `.env`:
```bash
ALPHAVANTAGE_API_KEY=your_key_here  # Market data
FMP_API_KEY=your_key_here           # Financial statements (optional)
PORT=8080                            # Server port
```

Already configured with working keys! ✅

---

## 📁 Project Structure

```
backend/
├── investiq_server.py       # Entry point
├── src/
│   ├── main.py             # HTTP server & routing
│   ├── config.py           # Environment config
│   └── api/
│       ├── company.py      # Company data
│       ├── market_ticker.py # Market ticker (NEW!)
│       ├── insights.py     # News insights
│       ├── learn.py        # Learn explanations
│       └── assessment.py   # Assessment
├── Dockerfile              # Docker container
├── fly.toml               # Fly.io config
├── deploy-to-fly.sh       # Fly.io deployment
├── deploy-to-vultr.sh     # Vultr deployment (MLH prize!)
└── DEPLOY_VULTR.md        # Vultr deployment guide
```

---

## 🧪 Testing

```bash
# Test locally
curl http://127.0.0.1:8080/market-ticker

# Test production (Vultr)
curl http://YOUR_SERVER_IP/market-ticker

# Test production (Fly.io)
curl https://investiq-backend.fly.dev/market-ticker
```

---

## 📚 Documentation

- **Quick Start:** [QUICKSTART.md](./QUICKSTART.md) - Local development
- **Vultr Deploy:** [DEPLOY_VULTR.md](./DEPLOY_VULTR.md) - MLH prize deployment
- **Fly.io Deploy:** [DEPLOYMENT.md](./DEPLOYMENT.md) - Alternative deployment
- **Integration:** [../FRONTEND_BACKEND_INTEGRATION.md](../FRONTEND_BACKEND_INTEGRATION.md) - Full stack guide

---

## 🏆 For MLH Vultr Prize

**To maximize your chances of winning:**

1. ✅ Deploy to Vultr Cloud
2. ✅ Document Vultr usage in README
3. ✅ Take screenshots of Vultr dashboard
4. ✅ Mention Vultr in demo
5. ✅ Add "Vultr Cloud" to Devpost technologies
6. ✅ Select "Best Use of Vultr" challenge

**See [DEPLOY_VULTR.md](./DEPLOY_VULTR.md) for complete hackathon submission guide!**

---

## 🔧 Tech Stack

- **Language:** Python 3.11 (stdlib only, no external deps!)
- **Server:** Built-in `http.server`
- **APIs:** AlphaVantage, FMP, Yahoo Finance, EDGAR
- **Caching:** In-memory (5-minute TTL)
- **Deployment:** Docker + Vultr/Fly.io

---

## 💰 Cost

**Local Development:** Free

**Production:**
- Vultr: $6/month (FREE with hackathon credits!)
- Fly.io: Free tier (no credit card needed)

---

## 📞 Support

Issues? Check:
- [QUICKSTART.md](./QUICKSTART.md) - Local setup
- [DEPLOY_VULTR.md](./DEPLOY_VULTR.md) - Vultr deployment
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Fly.io deployment
- [Troubleshooting sections](#) in each guide

---

**Built for Technica 2025 Hackathon** 🚀

**Competing for:** MLH Best Use of Vultr Prize 🏆
