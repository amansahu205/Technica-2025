#!/bin/bash
# Deploy InvestIQ Backend to Fly.io

set -e  # Exit on error

echo "🚀 Deploying InvestIQ Backend to Fly.io"
echo "========================================"
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if flyctl is installed
if ! command -v flyctl &> /dev/null; then
    echo -e "${RED}❌ flyctl is not installed${NC}"
    echo ""
    echo "Install it with:"
    echo "  curl -L https://fly.io/install.sh | sh"
    echo ""
    exit 1
fi

echo -e "${GREEN}✅ flyctl is installed${NC}"
echo ""

# Check if .env file exists
if [ ! -f .env ]; then
    echo -e "${RED}❌ .env file not found${NC}"
    echo ""
    echo "Create .env with your API keys:"
    echo "  ALPHAVANTAGE_API_KEY=your_key"
    echo "  FMP_API_KEY=your_key"
    echo ""
    exit 1
fi

echo -e "${GREEN}✅ .env file found${NC}"
echo ""

# Load environment variables
export $(cat .env | grep -v '^#' | xargs)

# Check if user is logged in
echo -e "${BLUE}🔐 Checking Fly.io authentication...${NC}"
if ! flyctl auth whoami &> /dev/null; then
    echo -e "${YELLOW}⚠️  Not logged in to Fly.io${NC}"
    echo ""
    echo "Logging in..."
    flyctl auth login
fi

echo -e "${GREEN}✅ Logged in to Fly.io${NC}"
echo ""

# Check if app exists
APP_NAME="investiq-backend"
if ! flyctl apps list | grep -q "$APP_NAME"; then
    echo -e "${YELLOW}📦 App '$APP_NAME' doesn't exist. Creating...${NC}"
    echo ""
    flyctl apps create $APP_NAME
    echo ""
    echo -e "${GREEN}✅ App created${NC}"
    echo ""

    # Create volume for persistent data
    echo -e "${BLUE}💾 Creating persistent volume...${NC}"
    flyctl volumes create investiq_data --region iad --size 1
    echo -e "${GREEN}✅ Volume created${NC}"
    echo ""
else
    echo -e "${GREEN}✅ App '$APP_NAME' already exists${NC}"
    echo ""
fi

# Set secrets (API keys)
echo -e "${BLUE}🔑 Setting API key secrets...${NC}"
echo ""

if [ -n "$ALPHAVANTAGE_API_KEY" ]; then
    echo "  Setting ALPHAVANTAGE_API_KEY..."
    flyctl secrets set ALPHAVANTAGE_API_KEY="$ALPHAVANTAGE_API_KEY" --app $APP_NAME
    echo -e "${GREEN}  ✅ ALPHAVANTAGE_API_KEY set${NC}"
else
    echo -e "${YELLOW}  ⚠️  ALPHAVANTAGE_API_KEY not found in .env${NC}"
fi

if [ -n "$FMP_API_KEY" ]; then
    echo "  Setting FMP_API_KEY..."
    flyctl secrets set FMP_API_KEY="$FMP_API_KEY" --app $APP_NAME
    echo -e "${GREEN}  ✅ FMP_API_KEY set${NC}"
else
    echo -e "${YELLOW}  ⚠️  FMP_API_KEY not found in .env (optional)${NC}"
fi

echo ""

# Deploy
echo -e "${BLUE}🚢 Deploying to Fly.io...${NC}"
echo ""
flyctl deploy --app $APP_NAME

echo ""
echo "========================================"
echo -e "${GREEN}🎉 Deployment Complete!${NC}"
echo "========================================"
echo ""
echo "Your backend is now live at:"
echo -e "${BLUE}https://$APP_NAME.fly.dev${NC}"
echo ""
echo "Test it:"
echo "  curl https://$APP_NAME.fly.dev/market-ticker"
echo "  curl https://$APP_NAME.fly.dev/company/AAPL"
echo ""
echo "View logs:"
echo "  flyctl logs --app $APP_NAME"
echo ""
echo "Open dashboard:"
echo "  flyctl dashboard --app $APP_NAME"
echo ""
