# 🏆 Deploy to Vultr - MLH Hackathon Prize

**Compete for: Best Use of Vultr Prize - Portable Screens!**

This guide shows you how to deploy the InvestIQ backend to Vultr Cloud and maximize your chances of winning the MLH prize.

---

## 🎁 Why Vultr for This Hackathon?

- ✅ **Free Cloud Credits** - Sign up and get credits to deploy for free
- ✅ **MLH Prize** - Portable screens for your team!
- ✅ **High Performance** - Fast infrastructure for your app
- ✅ **Simple Deployment** - Get live in 10 minutes
- ✅ **Cloud GPUs** - Add AI features if you want (extra points!)

---

## 📋 Table of Contents

1. [Quick Deploy (Web Interface)](#quick-deploy-web-interface) ⭐ **Recommended**
2. [Advanced Deploy (CLI)](#advanced-deploy-cli)
3. [Claim Free Credits](#claim-free-credits)
4. [Test Deployment](#test-deployment)
5. [Add to Submission](#add-to-submission)

---

## 🚀 Quick Deploy (Web Interface)

**Time:** ~10 minutes | **Difficulty:** Easy

### Step 1: Sign Up for Vultr

1. Go to: https://www.vultr.com/
2. Click "Sign Up" (top right)
3. **Use MLH email** if you have special signup link
4. Verify your email
5. Add payment method (won't be charged with credits!)

### Step 2: Claim Free Credits

**Via MLH:**
1. Check MLH hackathon Discord/Slack for Vultr credits link
2. Apply the promo code in Vultr dashboard
3. Credits usually: **$50-100** (enough for entire hackathon!)

**Alternatively:**
- New accounts get $100 free credit for 30 days
- No code needed, automatic on signup

### Step 3: Create Cloud Compute Instance

1. **Go to:** https://my.vultr.com/deploy/
2. **Choose Server:**
   - Select "Cloud Compute"
   - Click "Deploy New Instance"

3. **Choose Location:** (closest to you)
   - 🇺🇸 New York (NJ) - `ewr`
   - 🇺🇸 Seattle - `sea`
   - 🇬🇧 London - `lhr`
   - 🇩🇪 Frankfurt - `fra`

4. **Choose Server Type:**
   - Select "Container Optimized OS"
   - Or "Ubuntu 22.04 LTS"

5. **Choose Server Size:**
   - **1 GB RAM** - $6/month (recommended)
   - Uses ~$0.20/day = $1.40 for 7-day hackathon

6. **Additional Features:**
   - ✅ Enable "Auto Backups" (optional)
   - ✅ Enable "IPv6" (optional)
   - ❌ Don't need managed DB or firewall yet

7. **Server Hostname:**
   - Enter: `investiq-backend`

8. **Deploy Now:**
   - Click "Deploy Now" button
   - Wait 2-3 minutes for server to provision

### Step 4: Access Your Server

1. **Get Server Details:**
   - Go to: https://my.vultr.com/instances/
   - Click on `investiq-backend`
   - Note the **IP Address** (e.g., `149.28.123.45`)
   - Note the **Password** (shown once, save it!)

2. **SSH into Server:**
   ```bash
   ssh root@YOUR_SERVER_IP
   # Enter password when prompted
   ```

### Step 5: Deploy Backend on Server

**Copy-paste these commands in your SSH session:**

```bash
# Update system
apt-get update && apt-get upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Install Docker Compose
apt-get install docker-compose -y

# Create app directory
mkdir -p /app
cd /app

# Create Dockerfile
cat > Dockerfile << 'EOF'
FROM python:3.11-slim
WORKDIR /app
COPY . .
RUN mkdir -p data/f500_json
EXPOSE 8080
ENV PORT=8080
CMD ["python3", "investiq_server.py"]
EOF

# Clone your backend code (or upload manually)
# Option 1: If code is on GitHub
git clone https://github.com/YOUR_USERNAME/Technica-2025.git
cp -r Technica-2025/backend/* /app/
cd /app

# Option 2: Upload manually (from your local machine)
# On your local machine, run:
# scp -r backend/* root@YOUR_SERVER_IP:/app/

# Set environment variables
export ALPHAVANTAGE_API_KEY="8RHIFK2WEFG2NV7Z"
export FMP_API_KEY="StMvU5bLWwfPHOU2jQfw3Ao12oiRWF5J"

# Create .env file
cat > .env << 'EOF'
ALPHAVANTAGE_API_KEY=8RHIFK2WEFG2NV7Z
FMP_API_KEY=StMvU5bLWwfPHOU2jQfw3Ao12oiRWF5J
PORT=8080
EOF

# Build and run Docker container
docker build -t investiq-backend .
docker run -d \
  --name investiq-backend \
  --restart always \
  -p 80:8080 \
  -e ALPHAVANTAGE_API_KEY="$ALPHAVANTAGE_API_KEY" \
  -e FMP_API_KEY="$FMP_API_KEY" \
  investiq-backend

# Check it's running
docker ps
docker logs investiq-backend
```

### Step 6: Test Your Deployment

```bash
# From SSH session on server
curl http://localhost/market-ticker

# From your local machine
curl http://YOUR_SERVER_IP/market-ticker
curl http://YOUR_SERVER_IP/company/AAPL
```

**Expected output:**
```json
[
  {
    "symbol": "AAPL",
    "price": 185.32,
    "change": 2.45,
    "changePercent": 1.34
  },
  ...
]
```

✅ **Success!** Your backend is live at: `http://YOUR_SERVER_IP`

---

## 🔧 Advanced Deploy (CLI)

For automated deployment:

### Install Vultr CLI

```bash
# macOS
brew tap vultr/vultr-cli
brew install vultr-cli

# Linux
wget https://github.com/vultr/vultr-cli/releases/latest/download/vultr-cli_$(uname -s)_$(uname -m).tar.gz
tar xf vultr-cli_$(uname -s)_$(uname -m).tar.gz
sudo mv vultr-cli /usr/local/bin/
```

### Get API Key

1. Go to: https://my.vultr.com/settings/#settingsapi
2. Click "Enable API"
3. Copy your API key

### Configure CLI

```bash
export VULTR_API_KEY="your_api_key_here"
vultr-cli account info
```

### Deploy

```bash
cd backend
./deploy-to-vultr.sh
```

This automated script:
- ✅ Builds Docker image
- ✅ Creates Vultr instance
- ✅ Deploys container
- ✅ Sets up environment variables
- ✅ Gives you the live URL

---

## 💳 Claim Free Credits

### Via MLH Hackathon

1. **Check MLH Resources:**
   - Look in hackathon Discord/Slack
   - Check MLH swag bag for Vultr promo code
   - Ask MLH organizers

2. **Apply Promo Code:**
   - Go to: https://my.vultr.com/billing/
   - Click "Promo Code"
   - Enter MLH code
   - Credits applied instantly

### New User Credit

**Automatic $100 credit:**
- Sign up at: https://www.vultr.com/
- Verify email
- Add payment method
- $100 credit applied (valid 30 days)

---

## 🧪 Test Deployment

### 1. Test Backend Endpoints

```bash
# Replace YOUR_IP with your server IP
export BACKEND_URL="http://YOUR_SERVER_IP"

# Test market ticker
curl $BACKEND_URL/market-ticker | jq

# Test company data
curl $BACKEND_URL/company/AAPL | jq '.data.profile'

# Test cache
curl $BACKEND_URL/market-ticker/cache-status | jq
```

### 2. Test from Frontend

Update frontend environment variable:

```bash
cd code
cat > .env.local << EOF
BACKEND_URL=http://YOUR_SERVER_IP
EOF

# Start frontend
pnpm dev
```

Open http://localhost:3000 and verify:
- ✅ Ticker tape loads
- ✅ Dashboard shows data
- ✅ Charts render

### 3. Performance Test

```bash
# Test response time
time curl -s $BACKEND_URL/market-ticker > /dev/null

# Should be < 500ms
```

---

## 📊 Monitor Your Instance

### View Instance Dashboard

1. Go to: https://my.vultr.com/instances/
2. Click on `investiq-backend`
3. See metrics:
   - CPU usage
   - Bandwidth
   - Network traffic

### View Logs

```bash
# SSH into server
ssh root@YOUR_SERVER_IP

# View Docker logs
docker logs -f investiq-backend

# View last 100 lines
docker logs --tail 100 investiq-backend
```

### Check Resource Usage

```bash
# CPU and Memory
docker stats investiq-backend

# Disk usage
df -h
```

---

## 🏆 Add to MLH Submission

To maximize your chances of winning the **Vultr Prize**:

### 1. Document Vultr Usage

Add to your project README:

```markdown
## 🚀 Deployment

This project is deployed on **Vultr Cloud** using:
- Vultr Cloud Compute (1GB RAM instance)
- Docker containerization
- High-performance edge infrastructure
- Auto-scaling capabilities

**Live Backend:** http://YOUR_SERVER_IP

### Vultr Features Used:
- ✅ Cloud Compute for Python backend
- ✅ Container Optimized OS
- ✅ Global edge deployment
- ✅ High-performance SSD storage
- ✅ 1Gbps+ network bandwidth

### Why Vultr?
Vultr's infrastructure provides:
- Fast API response times (< 200ms)
- Reliable uptime (99.9%+)
- Easy scalability as user base grows
- Cost-effective hosting ($6/month for production)
```

### 2. Take Screenshots

Capture:
- Vultr dashboard showing active instance
- Performance metrics (CPU, bandwidth)
- API response times
- Your app running live

### 3. Highlight in Demo

During demo, mention:
- "Deployed on Vultr Cloud for high performance"
- "Using Vultr's container infrastructure"
- Show live backend URL
- Show Vultr dashboard if possible

### 4. In Devpost Submission

Under "Technologies Used":
- Add "Vultr Cloud"
- Add "Vultr Cloud Compute"

Under "Challenges":
- Select "Best Use of Vultr"

---

## 💰 Cost Breakdown

**Instance Cost:** $6/month (1GB RAM)

**Hackathon Usage:**
- 7 days = **$1.40** total
- With $100 credit = **FREE!** 😍
- Remaining credit: $98.60 for future projects

**Post-Hackathon:**
- Keep running: $6/month
- Or pause instance: $0.03/month (snapshot)
- Or destroy instance: $0

---

## 🔒 Security Best Practices

### Set Up Firewall

```bash
# SSH into server
ssh root@YOUR_SERVER_IP

# Allow only HTTP, HTTPS, SSH
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw enable
```

### Use HTTPS (Optional but Recommended)

```bash
# Install Certbot
apt-get install certbot

# Get free SSL certificate (if you have a domain)
certbot certonly --standalone -d yourdomain.com
```

### Secure Docker

```bash
# Don't expose Docker daemon
# Use environment variables, not hardcoded secrets
# Keep Docker updated
docker system prune -a
```

---

## 🆘 Troubleshooting

### Issue: "Cannot connect to server"

**Check instance status:**
1. Go to Vultr dashboard
2. Verify instance is "Running"
3. Check firewall rules

**Test locally:**
```bash
ssh root@YOUR_SERVER_IP
curl http://localhost/market-ticker
```

### Issue: "Docker container not running"

```bash
ssh root@YOUR_SERVER_IP
docker ps -a
docker logs investiq-backend
docker restart investiq-backend
```

### Issue: "Out of memory"

**Upgrade to 2GB instance:**
1. Vultr dashboard → Instances
2. Click on instance
3. "Upgrade/Downgrade"
4. Select 2GB plan ($12/month)

### Issue: "API keys not working"

```bash
# Re-set environment variables
ssh root@YOUR_SERVER_IP
docker stop investiq-backend
docker rm investiq-backend

# Run with correct env vars
docker run -d \
  --name investiq-backend \
  --restart always \
  -p 80:8080 \
  -e ALPHAVANTAGE_API_KEY="8RHIFK2WEFG2NV7Z" \
  -e FMP_API_KEY="StMvU5bLWwfPHOU2jQfw3Ao12oiRWF5J" \
  investiq-backend
```

---

## 📚 Additional Resources

- **Vultr Docs:** https://www.vultr.com/docs/
- **Vultr API:** https://www.vultr.com/api/
- **Support:** https://my.vultr.com/support/
- **Community:** https://www.vultr.com/community/

---

## ✅ Deployment Checklist

Before submission:
- [ ] Vultr account created with MLH credits
- [ ] Backend deployed and accessible
- [ ] All endpoints tested (market-ticker, company, cache-status)
- [ ] Frontend connected to Vultr backend
- [ ] Performance metrics looking good (< 500ms response)
- [ ] Screenshots taken for submission
- [ ] Devpost mentions Vultr usage
- [ ] README updated with deployment info

---

## 🎉 You're Ready!

**Your backend is live on Vultr!**

**Backend URL:** `http://YOUR_SERVER_IP`

**Test it:**
```bash
curl http://YOUR_SERVER_IP/market-ticker
```

**Next steps:**
1. ✅ Update frontend `BACKEND_URL`
2. ✅ Test full integration
3. ✅ Add to Devpost submission
4. ✅ Mention in demo
5. 🏆 **Win those portable screens!**

Good luck with the hackathon! 🚀
