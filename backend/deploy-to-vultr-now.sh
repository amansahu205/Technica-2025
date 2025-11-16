#!/bin/bash
# Automated deployment to your Vultr server
# Server: 155.138.234.168

set -e

SERVER_IP="155.138.234.168"
SERVER_PASSWORD='s[A3dUt6!6,Ad7j*'

echo "🚀 Deploying InvestIQ Backend to Vultr"
echo "======================================"
echo ""
echo "Server: $SERVER_IP"
echo ""

# Check if sshpass is installed
if ! command -v sshpass &> /dev/null; then
    echo "📦 Installing sshpass..."
    if [[ "$OSTYPE" == "darwin"* ]]; then
        brew install hudochenkov/sshpass/sshpass
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        sudo apt-get install -y sshpass
    fi
fi

echo "✅ Prerequisites ready"
echo ""

# Step 1: Prepare server
echo "📦 Step 1/4: Preparing server..."
sshpass -p "$SERVER_PASSWORD" ssh -o StrictHostKeyChecking=no root@$SERVER_IP << 'ENDSSH'
# Update and install Docker
apt-get update -qq
apt-get install -y docker.io git curl

# Start Docker
systemctl start docker
systemctl enable docker

# Create app directory
rm -rf /app
mkdir -p /app
cd /app

# Create data directory
mkdir -p data/f500_json

echo "✅ Server prepared"
ENDSSH

echo "✅ Server prepared"
echo ""

# Step 2: Upload backend code
echo "📤 Step 2/4: Uploading backend code..."

# Create tar of backend (exclude unnecessary files)
tar czf /tmp/backend.tar.gz \
    --exclude='*.sh' \
    --exclude='*.md' \
    --exclude='.env' \
    --exclude='__pycache__' \
    --exclude='*.pyc' \
    -C .. backend

# Upload
sshpass -p "$SERVER_PASSWORD" scp -o StrictHostKeyChecking=no \
    /tmp/backend.tar.gz root@$SERVER_IP:/tmp/

# Extract on server
sshpass -p "$SERVER_PASSWORD" ssh -o StrictHostKeyChecking=no root@$SERVER_IP << 'ENDSSH'
cd /app
tar xzf /tmp/backend.tar.gz --strip-components=1
rm /tmp/backend.tar.gz
echo "✅ Code uploaded"
ENDSSH

rm /tmp/backend.tar.gz

echo "✅ Code uploaded"
echo ""

# Step 3: Configure and build
echo "🐳 Step 3/4: Building Docker image..."
sshpass -p "$SERVER_PASSWORD" ssh -o StrictHostKeyChecking=no root@$SERVER_IP << 'ENDSSH'
cd /app

# Create Dockerfile (ensure it exists)
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

# Create .env with API keys
cat > .env << 'EOF'
ALPHAVANTAGE_API_KEY=8RHIFK2WEFG2NV7Z
FMP_API_KEY=StMvU5bLWwfPHOU2jQfw3Ao12oiRWF5J
PORT=8080
EOF

# Build Docker image
docker build -t investiq-backend .

echo "✅ Image built"
ENDSSH

echo "✅ Docker image built"
echo ""

# Step 4: Deploy
echo "🚀 Step 4/4: Starting application..."
sshpass -p "$SERVER_PASSWORD" ssh -o StrictHostKeyChecking=no root@$SERVER_IP << 'ENDSSH'
cd /app

# Stop and remove existing container
docker stop investiq-backend 2>/dev/null || true
docker rm investiq-backend 2>/dev/null || true

# Run new container
docker run -d \
    --name investiq-backend \
    --restart always \
    -p 80:8080 \
    --env-file .env \
    -v /app/data:/app/data \
    investiq-backend

# Wait for startup
sleep 5

# Check if running
if docker ps | grep -q investiq-backend; then
    echo "✅ Container running"
    docker ps --filter name=investiq-backend
else
    echo "❌ Container failed to start"
    docker logs investiq-backend
    exit 1
fi
ENDSSH

echo "✅ Application started"
echo ""

# Test the deployment
echo "🧪 Testing deployment..."
sleep 2

if curl -s -f http://$SERVER_IP/market-ticker > /dev/null; then
    echo "✅ Backend is responding!"
else
    echo "⚠️  Backend may still be starting up..."
fi

echo ""
echo "======================================"
echo "🎉 Deployment Complete!"
echo "======================================"
echo ""
echo "Your backend is now live at:"
echo "  http://$SERVER_IP"
echo ""
echo "Test it:"
echo "  curl http://$SERVER_IP/market-ticker"
echo "  curl http://$SERVER_IP/company/AAPL"
echo ""
echo "SSH Access:"
echo "  ssh root@$SERVER_IP"
echo "  Password: $SERVER_PASSWORD"
echo ""
echo "View logs:"
echo "  ssh root@$SERVER_IP 'docker logs -f investiq-backend'"
echo ""
echo "Update frontend .env.local:"
echo "  BACKEND_URL=http://$SERVER_IP"
echo ""
