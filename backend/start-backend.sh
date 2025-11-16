#!/bin/bash
# Quick start script for InvestIQ backend

echo "🚀 Starting InvestIQ Backend Server"
echo "==================================="
echo ""

# Load environment variables from .env file
if [ -f .env ]; then
    echo "✅ Loading environment variables from .env"
    export $(cat .env | grep -v '^#' | xargs)
else
    echo "⚠️  Warning: .env file not found"
    echo "   Create .env with your ALPHAVANTAGE_API_KEY"
fi

# Check if API key is set
if [ -z "$ALPHAVANTAGE_API_KEY" ]; then
    echo "❌ Error: ALPHAVANTAGE_API_KEY not set"
    echo "   Please add it to backend/.env"
    exit 1
fi

echo "✅ AlphaVantage API Key: ${ALPHAVANTAGE_API_KEY:0:8}..."
echo "✅ Server Port: $PORT"
echo ""
echo "Starting server on http://127.0.0.1:$PORT"
echo "Press Ctrl+C to stop"
echo ""

# Start the server
python3 investiq_server.py
