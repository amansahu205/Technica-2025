#!/bin/bash
# Server setup script - Run this ON THE SERVER via SSH
# SSH into server: ssh root@155.138.234.168
# Then run: bash < <(curl -s https://raw.githubusercontent.com/.../setup-server.sh)
# OR copy-paste this entire script

set -e

echo "🚀 Setting up InvestIQ Backend on Vultr"
echo "========================================"
echo ""

# Update system
echo "📦 Updating system packages..."
apt-get update -qq
apt-get install -y docker.io git curl

# Start Docker
echo "🐳 Starting Docker..."
systemctl start docker
systemctl enable docker

# Create app directory
echo "📁 Creating application directory..."
rm -rf /app
mkdir -p /app
cd /app

# Create Dockerfile
echo "📝 Creating Dockerfile..."
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

# Create environment file with API keys
echo "🔑 Setting up environment variables..."
cat > .env << 'EOF'
ALPHAVANTAGE_API_KEY=8RHIFK2WEFG2NV7Z
FMP_API_KEY=StMvU5bLWwfPHOU2jQfw3Ao12oiRWF5J
PORT=8080
EOF

# Create data directory
mkdir -p data/f500_json

echo ""
echo "✅ Server setup complete!"
echo ""
echo "Next steps:"
echo "1. Upload your backend code to /app/"
echo "2. Run: cd /app && docker build -t investiq-backend ."
echo "3. Run: docker run -d --name investiq-backend --restart always -p 80:8080 --env-file .env investiq-backend"
echo ""
