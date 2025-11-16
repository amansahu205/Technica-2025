#!/bin/bash
# Test script for InvestIQ Backend API

BACKEND_URL="http://127.0.0.1:8080"

echo "🧪 Testing InvestIQ Backend API"
echo "================================"
echo ""
echo "Backend URL: $BACKEND_URL"
echo ""

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

test_endpoint() {
    local name=$1
    local url=$2
    local method=${3:-GET}

    echo -n "Testing $name... "

    if [ "$method" = "GET" ]; then
        response=$(curl -s -w "\n%{http_code}" "$url")
    else
        response=$(curl -s -w "\n%{http_code}" -X POST -H "Content-Type: application/json" "$url" -d '{}')
    fi

    http_code=$(echo "$response" | tail -n 1)
    body=$(echo "$response" | head -n -1)

    if [ "$http_code" = "200" ]; then
        echo -e "${GREEN}✅ PASS${NC} (HTTP $http_code)"
        if command -v jq &> /dev/null; then
            echo "$body" | jq -C '.' | head -20
        else
            echo "$body" | head -20
        fi
    else
        echo -e "${RED}❌ FAIL${NC} (HTTP $http_code)"
        echo "$body"
    fi
    echo ""
}

# Test 1: Market Ticker
test_endpoint "Market Ticker (NEW!)" "$BACKEND_URL/market-ticker"

# Test 2: Market Ticker Cache Status
test_endpoint "Cache Status" "$BACKEND_URL/market-ticker/cache-status"

# Test 3: Company Data (AAPL)
test_endpoint "Company Data (AAPL)" "$BACKEND_URL/company/AAPL"

# Test 4: Company Data (MSFT)
test_endpoint "Company Data (MSFT)" "$BACKEND_URL/company/MSFT"

# Test 5: Insights (if implemented)
echo -e "${YELLOW}ℹ️  Skipping POST endpoints (insights, learn, assessment)${NC}"
echo "   These require specific payload data"
echo ""

echo "================================"
echo "🎉 Testing Complete!"
echo ""
echo "Next steps:"
echo "  1. Start backend: cd backend && ./start-backend.sh"
echo "  2. Start frontend: cd code && pnpm dev"
echo "  3. Open: http://localhost:3000"
