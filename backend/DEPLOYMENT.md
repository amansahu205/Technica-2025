# 🚀 Backend Deployment Guide

Complete guide for deploying the InvestIQ backend to production on **Fly.io**.

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Quick Deploy (1 Command)](#quick-deploy-1-command)
3. [Manual Deployment](#manual-deployment)
4. [Post-Deployment Setup](#post-deployment-setup)
5. [Monitoring & Logs](#monitoring--logs)
6. [Updating the Deployment](#updating-the-deployment)
7. [Troubleshooting](#troubleshooting)

---

## ✅ Prerequisites

### 1. Create Fly.io Account

Sign up at: https://fly.io/app/sign-up

**Why Fly.io?**
- ✅ Free tier includes 3 VMs (enough for this project)
- ✅ Global edge deployment
- ✅ Automatic HTTPS
- ✅ Easy scaling
- ✅ Persistent volumes for data caching

### 2. Install Fly.io CLI

```bash
# macOS / Linux
curl -L https://fly.io/install.sh | sh

# Windows (PowerShell)
iwr https://fly.io/install.ps1 -useb | iex

# Verify installation
flyctl version
```

### 3. Login to Fly.io

```bash
flyctl auth login
```

This opens your browser to authenticate.

### 4. Verify API Keys

Make sure your `.env` file has your API keys:

```bash
cd backend
cat .env
```

Should show:
```
ALPHAVANTAGE_API_KEY=8RHIFK2WEFG2NV7Z
FMP_API_KEY=StMvU5bLWwfPHOU2jQfw3Ao12oiRWF5J
PORT=8080
```

✅ You're ready to deploy!

---

## 🚀 Quick Deploy (1 Command)

**Automated deployment script does everything:**

```bash
cd backend
./deploy-to-fly.sh
```

This script will:
1. ✅ Check if flyctl is installed
2. ✅ Verify you're logged in
3. ✅ Create the app (if doesn't exist)
4. ✅ Create persistent volume for data cache
5. ✅ Set API key secrets
6. ✅ Build and deploy the Docker container
7. ✅ Show you the live URL

**Expected output:**
```
🚀 Deploying InvestIQ Backend to Fly.io
========================================

✅ flyctl is installed
✅ .env file found
✅ Logged in to Fly.io
✅ App 'investiq-backend' already exists
🔑 Setting API key secrets...
  ✅ ALPHAVANTAGE_API_KEY set
  ✅ FMP_API_KEY set
🚢 Deploying to Fly.io...

========================================
🎉 Deployment Complete!
========================================

Your backend is now live at:
https://investiq-backend.fly.dev
```

---

## 🔧 Manual Deployment

If you prefer step-by-step control:

### Step 1: Create Fly.io App

```bash
cd backend
flyctl apps create investiq-backend
```

### Step 2: Create Persistent Volume

For caching company data:

```bash
flyctl volumes create investiq_data --region iad --size 1
```

**Regions:**
- `iad` - Washington DC (US East)
- `lax` - Los Angeles (US West)
- `lhr` - London (Europe)
- `syd` - Sydney (Asia Pacific)

Choose the region closest to your users.

### Step 3: Set API Key Secrets

```bash
# AlphaVantage API Key
flyctl secrets set ALPHAVANTAGE_API_KEY=8RHIFK2WEFG2NV7Z

# FMP API Key
flyctl secrets set FMP_API_KEY=StMvU5bLWwfPHOU2jQfw3Ao12oiRWF5J
```

**Important:** Never commit API keys to git! They're set as secrets on Fly.io.

### Step 4: Deploy

```bash
flyctl deploy
```

This will:
- Build the Docker image
- Push to Fly.io registry
- Deploy to production
- Show you the URL

---

## 🔗 Post-Deployment Setup

### 1. Test the Deployment

```bash
# Test market ticker
curl https://investiq-backend.fly.dev/market-ticker

# Test company endpoint
curl https://investiq-backend.fly.dev/company/AAPL

# Check cache status
curl https://investiq-backend.fly.dev/market-ticker/cache-status
```

**Expected responses:**
- ✅ HTTP 200 OK
- ✅ JSON data returned
- ✅ Market ticker shows 10 stocks

### 2. Update Frontend Environment Variable

Update your frontend to use the production backend:

#### For Local Development:
```bash
cd code
cat > .env.local << 'EOF'
BACKEND_URL=https://investiq-backend.fly.dev
EOF
```

#### For Cloudflare Pages:

Go to: Cloudflare Dashboard → Pages → investiq-frontend → Settings → Environment Variables

Add:
```
BACKEND_URL = https://investiq-backend.fly.dev
```

### 3. Test Frontend Integration

```bash
cd code
pnpm dev
```

Open http://localhost:3000 and verify:
- ✅ Ticker tape loads with real data
- ✅ Company dashboard works
- ✅ Charts display correctly

---

## 📊 Monitoring & Logs

### View Live Logs

```bash
flyctl logs
```

**Real-time logs showing:**
- API requests
- AlphaVantage calls
- Cache hits/misses
- Errors

### View Metrics Dashboard

```bash
flyctl dashboard
```

Opens web dashboard with:
- Request rate
- Response times
- Memory usage
- CPU usage
- Geographic distribution

### Check App Status

```bash
flyctl status
```

Shows:
- Deployment status
- Running instances
- Health checks
- Recent deploys

### Monitor API Usage

```bash
# Check cache hit rate
curl https://investiq-backend.fly.dev/market-ticker/cache-status | jq
```

This shows:
- Which tickers are cached
- Cache age
- Time until expiry

---

## 🔄 Updating the Deployment

### Deploy Code Changes

After making code changes:

```bash
cd backend
flyctl deploy
```

**Zero-downtime deployment:**
- Fly.io keeps old version running
- Deploys new version
- Health checks new version
- Switches traffic to new version
- Shuts down old version

### Update Secrets

```bash
# Update AlphaVantage key
flyctl secrets set ALPHAVANTAGE_API_KEY=new_key_here

# Update FMP key
flyctl secrets set FMP_API_KEY=new_key_here
```

**Secrets are encrypted and never exposed in logs.**

### Scale Up/Down

```bash
# Scale to 2 instances (for high traffic)
flyctl scale count 2

# Scale back to 1 instance
flyctl scale count 1

# Increase memory
flyctl scale memory 1024
```

**Free tier includes:**
- 3 shared-cpu-1x VMs
- 160GB outbound transfer/month

---

## 🐛 Troubleshooting

### Issue 1: "App not found"

**Error:**
```
Error: Could not find App "investiq-backend"
```

**Fix:**
```bash
# Create the app first
flyctl apps create investiq-backend
```

### Issue 2: "Health check failed"

**Error:**
```
Health check failed: GET /market-ticker returned 500
```

**Possible causes:**
- API keys not set
- AlphaVantage API limit exceeded

**Fix:**
```bash
# Check logs
flyctl logs

# Verify secrets are set
flyctl secrets list

# Re-set API keys
flyctl secrets set ALPHAVANTAGE_API_KEY=8RHIFK2WEFG2NV7Z
```

### Issue 3: "Out of memory"

**Error:**
```
Error: Out of memory
```

**Fix:**
```bash
# Increase memory to 1GB
flyctl scale memory 1024
```

### Issue 4: "Volume not found"

**Error:**
```
Error: volume investiq_data not found
```

**Fix:**
```bash
# Create the volume
flyctl volumes create investiq_data --region iad --size 1
```

### Issue 5: AlphaVantage Rate Limit

**Error in logs:**
```
AlphaVantage API limit exceeded
```

**Fix:**
- Wait 24 hours for reset
- Our 5-minute cache minimizes API calls
- Or upgrade to AlphaVantage paid tier

**Check cache status:**
```bash
curl https://investiq-backend.fly.dev/market-ticker/cache-status
```

### Issue 6: CORS Errors

**Error in frontend:**
```
Access to fetch at 'https://investiq-backend.fly.dev' has been blocked by CORS
```

**This shouldn't happen** - we set CORS headers in Python backend.

**Verify:**
```bash
curl -I https://investiq-backend.fly.dev/market-ticker

# Should show:
# Access-Control-Allow-Origin: *
```

If missing, check `backend/src/main.py` has CORS headers.

---

## 🔐 Security Best Practices

### 1. Never Commit Secrets

✅ Good:
```bash
flyctl secrets set ALPHAVANTAGE_API_KEY=xxx
```

❌ Bad:
```python
API_KEY = "hardcoded_key_here"  # NEVER DO THIS
```

### 2. Use Environment Variables

Our `.env` is gitignored and loaded only locally.

Production uses Fly.io secrets.

### 3. Rotate Keys Regularly

```bash
# Every 6 months, rotate API keys
flyctl secrets set ALPHAVANTAGE_API_KEY=new_key
```

### 4. Monitor Logs for Anomalies

```bash
flyctl logs | grep ERROR
```

---

## 💰 Cost Estimate

**Fly.io Free Tier:**
- ✅ 3 shared-cpu-1x VMs (enough for 1 app)
- ✅ 3GB persistent storage
- ✅ 160GB outbound transfer/month

**This project uses:**
- 1 VM (512MB RAM)
- 1GB persistent storage
- ~5-10GB transfer/month (estimated)

**Cost:** **$0/month** (within free tier) 🎉

**If you need to scale:**
- Additional VM: $1.94/month
- Additional storage: $0.15/GB/month

---

## 📚 Additional Resources

- **Fly.io Docs:** https://fly.io/docs/
- **Fly.io Pricing:** https://fly.io/docs/about/pricing/
- **Docker Best Practices:** https://docs.docker.com/develop/dev-best-practices/
- **AlphaVantage Docs:** https://www.alphavantage.co/documentation/

---

## ✅ Deployment Checklist

Before deploying:
- [ ] Fly.io account created
- [ ] flyctl installed and logged in
- [ ] API keys added to `.env`
- [ ] Tested locally with `./start-backend.sh`
- [ ] Ready to deploy

Deployment:
- [ ] Run `./deploy-to-fly.sh`
- [ ] Verify deployment at https://investiq-backend.fly.dev/market-ticker
- [ ] Update frontend BACKEND_URL environment variable
- [ ] Test frontend integration

Post-deployment:
- [ ] Monitor logs for errors
- [ ] Check cache hit rates
- [ ] Verify AlphaVantage usage is within limits

---

## 🎉 You're Done!

Your backend is now live and globally distributed! 🌍

**Next steps:**
1. Deploy frontend to Cloudflare Pages
2. Update `BACKEND_URL` in Cloudflare Pages settings
3. Test the full integration
4. Monitor usage and performance

See `FRONTEND_BACKEND_INTEGRATION.md` for frontend deployment.
