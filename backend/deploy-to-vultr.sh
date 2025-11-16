#!/bin/bash
# Deploy InvestIQ Backend to Vultr Cloud
# MLH Hackathon - Best Use of Vultr Prize!

set -e

echo "🚀 Deploying InvestIQ Backend to Vultr Cloud"
echo "============================================="
echo ""
echo "🏆 Competing for: MLH Best Use of Vultr Prize"
echo "   Prize: Portable Screens for the team!"
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Check if vultr-cli is installed
if ! command -v vultr-cli &> /dev/null; then
    echo -e "${YELLOW}📦 vultr-cli not found. Installing...${NC}"
    echo ""

    # Detect OS and install
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        brew tap vultr/vultr-cli
        brew install vultr-cli
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        # Linux
        wget -O vultr-cli.tar.gz https://github.com/vultr/vultr-cli/releases/latest/download/vultr-cli_$(uname -s)_$(uname -m).tar.gz
        tar xf vultr-cli.tar.gz
        sudo mv vultr-cli /usr/local/bin/
        rm vultr-cli.tar.gz
    else
        echo -e "${RED}❌ Unsupported OS. Please install vultr-cli manually:${NC}"
        echo "   https://github.com/vultr/vultr-cli"
        exit 1
    fi

    echo -e "${GREEN}✅ vultr-cli installed${NC}"
    echo ""
fi

echo -e "${GREEN}✅ vultr-cli is installed${NC}"
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo -e "${RED}❌ .env file not found${NC}"
    echo ""
    echo "Create .env with your API keys:"
    echo "  ALPHAVANTAGE_API_KEY=your_key"
    echo "  FMP_API_KEY=your_key"
    exit 1
fi

echo -e "${GREEN}✅ .env file found${NC}"
echo ""

# Load environment variables
export $(cat .env | grep -v '^#' | xargs)

# Check if authenticated
echo -e "${BLUE}🔐 Checking Vultr authentication...${NC}"
if ! vultr-cli account info &> /dev/null; then
    echo -e "${YELLOW}⚠️  Not authenticated with Vultr${NC}"
    echo ""
    echo "Get your API key from:"
    echo "  https://my.vultr.com/settings/#settingsapi"
    echo ""
    read -p "Enter your Vultr API Key: " VULTR_API_KEY
    export VULTR_API_KEY

    # Test authentication
    if ! vultr-cli account info &> /dev/null; then
        echo -e "${RED}❌ Invalid API key${NC}"
        exit 1
    fi
fi

echo -e "${GREEN}✅ Authenticated with Vultr${NC}"
echo ""

# Configuration
APP_NAME="investiq-backend"
REGION="ewr"  # New Jersey (change if needed)
PLAN="vc2-1c-1gb"  # 1 CPU, 1GB RAM - $6/month (free with credits!)
OS_ID=1743  # Docker on Ubuntu 22.04

echo "Configuration:"
echo "  App Name: $APP_NAME"
echo "  Region: $REGION (New Jersey)"
echo "  Plan: $PLAN (1 CPU, 1GB RAM)"
echo ""

# Build Docker image
echo -e "${BLUE}🐳 Building Docker image...${NC}"
docker build -t investiq-backend:latest .
echo -e "${GREEN}✅ Docker image built${NC}"
echo ""

# Save Docker image as tar
echo -e "${BLUE}📦 Preparing Docker image for upload...${NC}"
docker save investiq-backend:latest > /tmp/investiq-backend.tar
echo -e "${GREEN}✅ Image saved${NC}"
echo ""

# Create startup script
cat > /tmp/startup-script.sh << 'SCRIPT_EOF'
#!/bin/bash
# Load Docker image
docker load < /tmp/investiq-backend.tar

# Stop existing container if running
docker stop investiq-backend 2>/dev/null || true
docker rm investiq-backend 2>/dev/null || true

# Run container
docker run -d \
  --name investiq-backend \
  --restart always \
  -p 80:8080 \
  -e PORT=8080 \
  -e ALPHAVANTAGE_API_KEY="${ALPHAVANTAGE_API_KEY}" \
  -e FMP_API_KEY="${FMP_API_KEY}" \
  investiq-backend:latest

echo "InvestIQ Backend started on port 80"
SCRIPT_EOF

echo -e "${BLUE}🚀 Creating Vultr instance...${NC}"
echo ""

# Create instance
INSTANCE_ID=$(vultr-cli instance create \
  --region "$REGION" \
  --plan "$PLAN" \
  --os "$OS_ID" \
  --label "$APP_NAME" \
  --host "$APP_NAME" \
  --tag "hackathon" \
  --tag "mlh" \
  --output json | jq -r '.id')

if [ -z "$INSTANCE_ID" ]; then
    echo -e "${RED}❌ Failed to create instance${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Instance created: $INSTANCE_ID${NC}"
echo ""

# Wait for instance to be ready
echo -e "${BLUE}⏳ Waiting for instance to be ready...${NC}"
while true; do
    STATUS=$(vultr-cli instance get "$INSTANCE_ID" --output json | jq -r '.status')
    if [ "$STATUS" = "active" ]; then
        break
    fi
    echo "   Status: $STATUS (waiting...)"
    sleep 5
done

echo -e "${GREEN}✅ Instance is active${NC}"
echo ""

# Get instance IP
IP_ADDRESS=$(vultr-cli instance get "$INSTANCE_ID" --output json | jq -r '.main_ip')
echo -e "${GREEN}Instance IP: $IP_ADDRESS${NC}"
echo ""

# Wait for SSH to be ready
echo -e "${BLUE}⏳ Waiting for SSH to be ready...${NC}"
sleep 30

# Get root password
ROOT_PASSWORD=$(vultr-cli instance get "$INSTANCE_ID" --output json | jq -r '.default_password')

# Upload Docker image and startup script
echo -e "${BLUE}📤 Uploading Docker image to server...${NC}"
sshpass -p "$ROOT_PASSWORD" scp -o StrictHostKeyChecking=no \
  /tmp/investiq-backend.tar \
  root@$IP_ADDRESS:/tmp/

sshpass -p "$ROOT_PASSWORD" scp -o StrictHostKeyChecking=no \
  /tmp/startup-script.sh \
  root@$IP_ADDRESS:/tmp/

# Run startup script
echo -e "${BLUE}🚀 Starting application...${NC}"
sshpass -p "$ROOT_PASSWORD" ssh -o StrictHostKeyChecking=no \
  root@$IP_ADDRESS \
  "chmod +x /tmp/startup-script.sh && ALPHAVANTAGE_API_KEY='$ALPHAVANTAGE_API_KEY' FMP_API_KEY='$FMP_API_KEY' /tmp/startup-script.sh"

# Cleanup
rm /tmp/investiq-backend.tar
rm /tmp/startup-script.sh

echo ""
echo "============================================="
echo -e "${GREEN}🎉 Deployment Complete!${NC}"
echo "============================================="
echo ""
echo "Your backend is now live at:"
echo -e "${BLUE}http://$IP_ADDRESS${NC}"
echo ""
echo "Test it:"
echo "  curl http://$IP_ADDRESS/market-ticker"
echo "  curl http://$IP_ADDRESS/company/AAPL"
echo ""
echo "Instance details:"
echo "  Instance ID: $INSTANCE_ID"
echo "  IP Address: $IP_ADDRESS"
echo "  Root Password: $ROOT_PASSWORD"
echo ""
echo "SSH Access:"
echo "  ssh root@$IP_ADDRESS"
echo "  Password: $ROOT_PASSWORD"
echo ""
echo "View logs:"
echo "  ssh root@$IP_ADDRESS 'docker logs -f investiq-backend'"
echo ""
echo "🏆 Good luck with the MLH Vultr Prize!"
echo ""
