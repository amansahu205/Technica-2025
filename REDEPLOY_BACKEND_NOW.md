# 🚀 Redeploy Backend to Vultr - Quick Guide

**Server IP:** 155.138.234.168
**Password:** s[A3dUt6!6,Ad7j*

---

## Method 1: Using Vultr Console (Recommended)

### Step 1: Access Vultr Console

1. Go to: https://my.vultr.com/instances/
2. Click on **investiq-backend** server
3. Click **"View Console"** button (opens in browser)
4. Login:
   - Username: `root`
   - Password: `s[A3dUt6!6,Ad7j*`

### Step 2: Deploy Backend

**Copy and paste this ENTIRE block into the console:**

```bash
# Stop and remove old container
docker stop investiq-backend 2>/dev/null || true
docker rm investiq-backend 2>/dev/null || true

# Navigate to app directory
cd /app || mkdir -p /app && cd /app

# Create Dockerfile
cat > Dockerfile << 'EOF'
FROM python:3.11-slim
WORKDIR /app
COPY . .
RUN mkdir -p data/f500_json
EXPOSE 8080
ENV PORT=8080
ENV PYTHONUNBUFFERED=1
CMD ["python3", "investiq_server.py"]
EOF

# Create environment file
cat > .env << 'EOF'
ALPHAVANTAGE_API_KEY=8RHIFK2WEFG2NV7Z
FMP_API_KEY=StMvU5bLWwfPHOU2jQfw3Ao12oiRWF5J
PORT=8080
EOF

# Download backend code (you'll need to upload investiq_server.py and src/ folder here)
# For now, let's check if they exist
ls -la investiq_server.py src/ 2>/dev/null

# Build Docker image
docker build -t investiq-backend .

# Run container
docker run -d \
  --name investiq-backend \
  --restart always \
  -p 80:8080 \
  -v /app/data:/app/data \
  --env-file .env \
  investiq-backend

# Wait for startup
sleep 5

# Check status
echo "=== Container Status ==="
docker ps | grep investiq

echo ""
echo "=== Container Logs ==="
docker logs --tail 20 investiq-backend

echo ""
echo "=== Testing API ==="
curl -s http://localhost/market-ticker | head -50
```

### Step 3: Verify Deployment

After running the above commands, you should see:

✅ Container running in `docker ps` output
✅ No errors in logs
✅ JSON response from the API test

---

## Method 2: Upload Fresh Code (If files are missing)

If you see "No such file or directory" for `investiq_server.py`, you need to upload the code:

### Using SCP (from your local machine):

```bash
# Package the backend
cd /home/user/Technica-2025/backend
tar czf investiq-backend.tar.gz investiq_server.py src/

# Upload to server
scp investiq-backend.tar.gz root@155.138.234.168:/tmp/

# Extract on server (run in Vultr console)
cd /app
tar xzf /tmp/investiq-backend.tar.gz
rm /tmp/investiq-backend.tar.gz

# Then run the deployment commands from Step 2 above
```

---

## Verification

Once deployed, test from your browser:

**Test these URLs:**
- http://155.138.234.168/market-ticker
- http://155.138.234.168/company/AAPL

You should see JSON responses with stock data.

---

## Troubleshooting

### Container won't start:

```bash
docker logs investiq-backend
```

### Port already in use:

```bash
# Kill any process using port 80
lsof -ti:80 | xargs kill -9 2>/dev/null
# Or stop any other containers
docker ps -a
docker stop <other-container-id>
```

### Check if backend is listening:

```bash
netstat -tlnp | grep :80
curl http://localhost/market-ticker
```

---

## Quick Restart (if container exists):

```bash
docker restart investiq-backend
docker logs --tail 50 investiq-backend
```

---

**After deployment, update your Cloudflare Pages environment variable:**

Cloudflare Dashboard → Technica-2025 → Settings → Environment Variables:
```
BACKEND_URL = http://155.138.234.168
```

Then redeploy your frontend!
