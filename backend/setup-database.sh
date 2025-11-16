#!/bin/bash
# InvestIQ Database Setup Script

set -e  # Exit on error

echo "🚀 InvestIQ Database Setup"
echo "=========================="
echo ""

# Check if wrangler is installed
if ! command -v wrangler &> /dev/null; then
    echo "❌ Wrangler CLI not found. Installing..."
    npm install -g wrangler
fi

echo "✓ Wrangler CLI is installed ($(wrangler --version))"
echo ""

# Check authentication
echo "🔐 Checking Cloudflare authentication..."
if ! wrangler whoami &> /dev/null; then
    echo "❌ Not authenticated with Cloudflare"
    echo ""
    echo "Please authenticate using ONE of these methods:"
    echo ""
    echo "Option 1: Browser Authentication"
    echo "  Run: wrangler login"
    echo ""
    echo "Option 2: API Token (Recommended for CLI)"
    echo "  1. Go to: https://dash.cloudflare.com/profile/api-tokens"
    echo "  2. Create Token → Use template 'Edit Cloudflare Workers'"
    echo "  3. Add D1 and KV permissions"
    echo "  4. Copy the token and run:"
    echo "     export CLOUDFLARE_API_TOKEN='your-token-here'"
    echo ""
    exit 1
fi

echo "✓ Authenticated with Cloudflare"
echo ""

# Create D1 Database
echo "📊 Creating D1 database..."
DB_OUTPUT=$(wrangler d1 create investiq-db 2>&1) || true

if echo "$DB_OUTPUT" | grep -q "already exists"; then
    echo "✓ Database 'investiq-db' already exists"
    DB_ID=$(wrangler d1 list | grep investiq-db | awk '{print $2}')
else
    echo "✓ Database created successfully"
    DB_ID=$(echo "$DB_OUTPUT" | grep "database_id" | cut -d'"' -f2)
fi

echo "  Database ID: $DB_ID"
echo ""

# Apply Schema
echo "🏗️  Applying database schema..."
wrangler d1 execute investiq-db --file=schema.sql
echo "✓ Schema applied successfully"
echo ""

# Seed Data
echo "🌱 Adding seed data..."
wrangler d1 execute investiq-db --file=seed.sql
echo "✓ Seed data added successfully"
echo ""

# Verify Tables
echo "🔍 Verifying tables..."
wrangler d1 execute investiq-db --command="SELECT name FROM sqlite_master WHERE type='table' ORDER BY name"
echo ""

# Create KV Namespace
echo "💾 Creating KV namespace..."
KV_OUTPUT=$(wrangler kv:namespace create "CACHE" 2>&1) || true

if echo "$KV_OUTPUT" | grep -q "already exists"; then
    echo "✓ KV namespace 'CACHE' already exists"
    KV_ID=$(wrangler kv:namespace list | grep CACHE | grep -v preview | awk '{print $2}')
else
    echo "✓ KV namespace created successfully"
    KV_ID=$(echo "$KV_OUTPUT" | grep "id =" | cut -d'"' -f2)
fi

echo "  KV Namespace ID: $KV_ID"
echo ""

# Create wrangler.toml
echo "⚙️  Creating wrangler.toml configuration..."
cat > wrangler.toml << EOF
name = "investiq-api"
main = "src/worker.js"
compatibility_date = "2024-01-01"

# D1 Database Binding
[[d1_databases]]
binding = "DB"
database_name = "investiq-db"
database_id = "$DB_ID"

# KV Namespace Binding
[[kv_namespaces]]
binding = "CACHE"
id = "$KV_ID"

# Workers AI Binding (for Cloudflare AI prize!)
[ai]
binding = "AI"
EOF

echo "✓ Configuration file created"
echo ""

# Summary
echo "✅ Database Setup Complete!"
echo "=========================="
echo ""
echo "Next steps:"
echo "1. Create Cloudflare Workers to replace Python backend"
echo "2. Update frontend API_URL to point to Workers"
echo "3. Deploy Workers: wrangler deploy"
echo ""
echo "Database Info:"
echo "  - D1 Database ID: $DB_ID"
echo "  - KV Namespace ID: $KV_ID"
echo "  - Tables: 9 tables + 2 views created"
echo "  - Seed Data: 10 lessons added"
echo ""
echo "Test your database:"
echo "  wrangler d1 execute investiq-db --command=\"SELECT * FROM lessons LIMIT 3\""
echo ""
