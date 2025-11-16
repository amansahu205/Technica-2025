# 🚀 Deploy InvestIQ Backend to Fly.io

**Time needed:** 5-10 minutes
**Cost:** FREE (Fly.io free tier)

---

## Step 1: Create Fly.io Account (2 minutes)

1. **Go to:** https://fly.io/app/sign-up
2. **Sign up with:**
   - GitHub account (easiest), OR
   - Email address
3. **Verify your email** (check inbox)
4. **Add credit card** (required but FREE tier doesn't charge)
   - Fly.io needs it for verification
   - You won't be charged on free tier

---

## Step 2: Install Fly.io CLI

**Already installed!** ✅

To verify:
```bash
export PATH="/root/.fly/bin:$PATH"
flyctl version
```

---

## Step 3: Login to Fly.io

**Run this command:**
```bash
export PATH="/root/.fly/bin:$PATH"
flyctl auth login
```

**What happens:**
1. Opens browser window
2. Login with your Fly.io account
3. Authorize the CLI
4. Returns to terminal

**Or use auth token:**
```bash
flyctl auth token
# Paste the token when prompted
```

---

## Step 4: Deploy Backend

**Navigate to backend directory:**
```bash
cd /home/user/Technica-2025/backend
```

**Set environment variables:**
```bash
export PATH="/root/.fly/bin:$PATH"
```

**Create/verify fly.toml exists:**
```bash
ls -la fly.toml
```

**Deploy to Fly.io:**
```bash
flyctl deploy
```

**What this does:**
- Creates Fly.io app (first time)
- Builds Docker image
- Deploys to Fly.io edge network
- Gives you a URL: `https://investiq-backend.fly.dev`

---

## Step 5: Set API Keys (Secrets)

**Set your API keys as secrets:**
```bash
flyctl secrets set ALPHAVANTAGE_API_KEY=8RHIFK2WEFG2NV7Z
flyctl secrets set FMP_API_KEY=StMvU5bLWwfPHOU2jQfw3Ao12oiRWF5J
flyctl secrets set PORT=8080
```

---

## Step 6: Test Backend

**Test the deployed backend:**
```bash
curl https://investiq-backend.fly.dev/market-ticker
curl https://investiq-backend.fly.dev/company/AAPL
```

**Or open in browser:**
- https://investiq-backend.fly.dev/market-ticker
- https://investiq-backend.fly.dev/company/AAPL

---

## Step 7: Update Frontend

**Update Cloudflare Pages to use Fly.io backend:**

1. Go to Cloudflare Pages dashboard
2. Click your **Technica-2025** project
3. Go to **Settings** → **Environment variables**
4. Add variable:
   - **Name:** `BACKEND_URL`
   - **Value:** `https://investiq-backend.fly.dev`
5. Click **Save**
6. Go to **Deployments** → **Retry deployment**

---

## Useful Fly.io Commands

### View logs:
```bash
flyctl logs
```

### Check app status:
```bash
flyctl status
```

### Open dashboard:
```bash
flyctl dashboard
```

### View app info:
```bash
flyctl info
```

### SSH into app:
```bash
flyctl ssh console
```

### Scale app:
```bash
flyctl scale count 1
```

### Restart app:
```bash
flyctl apps restart
```

---

## Troubleshooting

### Error: "Could not find App"
```bash
# Create app first
flyctl apps create investiq-backend
# Then deploy
flyctl deploy
```

### Error: "Not authenticated"
```bash
flyctl auth login
```

### Error: "Dockerfile not found"
```bash
# Make sure you're in backend directory
cd /home/user/Technica-2025/backend
ls Dockerfile
```

### Backend returns errors:
```bash
# Check logs
flyctl logs
# Check if secrets are set
flyctl secrets list
```

### Slow deployment:
- First deployment takes 2-3 minutes (building Docker image)
- Subsequent deployments are faster (~1 minute)

---

## Quick Deploy Script

**One-command deployment (after login):**

```bash
cd /home/user/Technica-2025/backend && \
export PATH="/root/.fly/bin:$PATH" && \
flyctl deploy && \
flyctl secrets set ALPHAVANTAGE_API_KEY=8RHIFK2WEFG2NV7Z && \
flyctl secrets set FMP_API_KEY=StMvU5bLWwfPHOU2jQfw3Ao12oiRWF5J && \
echo "✅ Backend deployed to:" && \
flyctl info --json | grep hostname
```

---

## Free Tier Limits

✅ **What you get FREE:**
- 3 shared-cpu-1x VMs
- 256MB RAM per VM
- 3GB storage
- 160GB bandwidth/month
- **More than enough for hackathon!**

---

## Next Steps After Deployment

1. ✅ Backend live at: `https://investiq-backend.fly.dev`
2. ✅ Test endpoints work
3. ✅ Update Cloudflare Pages `BACKEND_URL`
4. ✅ Redeploy frontend
5. ✅ Test full application!

---

## Support

- **Fly.io Docs:** https://fly.io/docs/
- **Community:** https://community.fly.io/
- **Status:** https://status.fly.io/

---

**Ready to deploy? Run:**
```bash
export PATH="/root/.fly/bin:$PATH"
flyctl auth login
```

Then follow the steps above!
