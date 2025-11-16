# 🚀 Deploy to Your Vultr Server NOW

**Server:** 155.138.234.168
**Password:** s[A3dUt6!6,Ad7j*

---

## Quick Deploy (Copy-Paste Commands)

### **Step 1: Prepare deployment package** (Run on your LOCAL machine)

```bash
cd /home/user/Technica-2025/backend

# Create deployment package
tar czf investiq-backend.tar.gz \
  investiq_server.py \
  src/

# You now have: investiq-backend.tar.gz
```

### **Step 2: Upload to server** (Run on your LOCAL machine)

```bash
# Upload the package
scp investiq-backend.tar.gz root@155.138.234.168:/tmp/

# When prompted for password, enter:
# s[A3dUt6!6,Ad7j*
```

### **Step 3: SSH into server** (Run on your LOCAL machine)

```bash
ssh root@155.138.234.168
# Password: s[A3dUt6!6,Ad7j*
```

### **Step 4: Deploy on server** (Run these commands INSIDE SSH session)

Copy-paste this entire block:

```bash
# Update system and install Docker
apt-get update
apt-get install -y docker.io

# Start Docker
systemctl start docker
systemctl enable docker

# Create app directory
mkdir -p /app
cd /app

# Extract uploaded code
tar xzf /tmp/investiq-backend.tar.gz
rm /tmp/investiq-backend.tar.gz

# Create Dockerfile
cat > Dockerfile << 'DOCKERFILE_EOF'
FROM python:3.11-slim
WORKDIR /app
COPY . .
RUN mkdir -p data/f500_json
EXPOSE 8080
ENV PORT=8080
ENV PYTHONUNBUFFERED=1
CMD ["python3", "investiq_server.py"]
DOCKERFILE_EOF

# Create environment file with API keys
cat > .env << 'ENV_EOF'
ALPHAVANTAGE_API_KEY=8RHIFK2WEFG2NV7Z
FMP_API_KEY=StMvU5bLWwfPHOU2jQfw3Ao12oiRWF5J
PORT=8080
ENV_EOF

# Build Docker image
docker build -t investiq-backend .

# Stop any existing container
docker stop investiq-backend 2>/dev/null || true
docker rm investiq-backend 2>/dev/null || true

# Run container
docker run -d \
  --name investiq-backend \
  --restart always \
  -p 80:8080 \
  -v /app/data:/app/data \
  --env-file .env \
  investiq-backend

# Check status
echo ""
echo "Checking deployment status..."
sleep 3
docker ps | grep investiq-backend

# View logs
echo ""
echo "Recent logs:"
docker logs --tail 20 investiq-backend
```

### **Step 5: Test deployment** (Run on your LOCAL machine, new terminal)

```bash
# Test market ticker
curl http://155.138.234.168/market-ticker

# Test company data
curl http://155.138.234.168/company/AAPL
```

**Expected output:**
```json
[
  {
    "symbol": "AAPL",
    "price": 185.32,
    ...
  }
]
```

---

## ✅ If Everything Works

Your backend is now live at:
```
http://155.138.234.168
```

Update your frontend:
```bash
cd /home/user/Technica-2025/code
echo "BACKEND_URL=http://155.138.234.168" > .env.local
pnpm dev
```

---

## 🐛 Troubleshooting

### Issue: "Connection refused"

```bash
# SSH into server
ssh root@155.138.234.168

# Check if Docker is running
systemctl status docker

# Check if container is running
docker ps

# View logs
docker logs investiq-backend
```

### Issue: "Container keeps restarting"

```bash
# View full logs
docker logs investiq-backend

# Common issue: Missing files
# Solution: Re-upload the tar.gz file
```

### Issue: "Can't SSH into server"

```bash
# Test connection
ping 155.138.234.168

# Verify SSH service
nc -zv 155.138.234.168 22
```

---

## 🔍 Useful Commands

**View real-time logs:**
```bash
ssh root@155.138.234.168
docker logs -f investiq-backend
```

**Restart container:**
```bash
ssh root@155.138.234.168
docker restart investiq-backend
```

**Rebuild and redeploy:**
```bash
ssh root@155.138.234.168
cd /app
docker build -t investiq-backend .
docker stop investiq-backend
docker rm investiq-backend
docker run -d --name investiq-backend --restart always -p 80:8080 --env-file .env investiq-backend
```

---

## 🎉 Success Checklist

- [ ] Package created (investiq-backend.tar.gz)
- [ ] Uploaded to server (/tmp/)
- [ ] Docker installed and running
- [ ] Container built successfully
- [ ] Container is running (docker ps shows it)
- [ ] curl http://155.138.234.168/market-ticker works
- [ ] Frontend .env.local updated with BACKEND_URL

---

**Your backend should be live in ~10 minutes!** 🚀
