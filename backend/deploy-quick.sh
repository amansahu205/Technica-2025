#!/bin/bash
# Quick deployment script for your Vultr server
# IP: 155.138.234.168

set -e

echo "🚀 Deploying InvestIQ Backend to Vultr"
echo "======================================"
echo ""
echo "Server IP: 155.138.234.168"
echo ""

# SSH and deploy in one script
sshpass -p 's[A3dUt6!6,Ad7j*' ssh -o StrictHostKeyChecking=no root@155.138.234.168 << 'ENDSSH'

echo "📦 Installing dependencies..."

# Update system
apt-get update -qq
apt-get install -y git curl

# Install Docker if not installed
if ! command -v docker &> /dev/null; then
    echo "🐳 Installing Docker..."
    curl -fsSL https://get.docker.com -o get-docker.sh
    sh get-docker.sh
    rm get-docker.sh
fi

# Create app directory
mkdir -p /app
cd /app

# Clone repository (or we'll upload manually)
echo "📂 Setting up application directory..."

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

echo "✅ Server prepared!"
echo ""
echo "Next: Upload your backend code to /app/"
echo "Then run: docker build -t investiq-backend . && docker run -d -p 80:8080 --name investiq-backend --restart always --env-file .env investiq-backend"

ENDSSH

echo ""
echo "======================================"
echo "✅ Server setup complete!"
echo ""
echo "Next steps:"
echo "1. Upload your backend code"
echo "2. Build and run Docker container"
echo ""
