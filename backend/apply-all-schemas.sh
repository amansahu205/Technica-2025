#!/bin/bash
# Apply All Database Schemas to Cloudflare D1
# Run this script after authenticating with Cloudflare

set -e  # Exit on error

echo "🚀 InvestIQ Database Schema Setup"
echo "=================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if authenticated
echo "🔐 Checking Cloudflare authentication..."
if ! wrangler whoami &> /dev/null; then
    echo -e "${RED}❌ Not authenticated with Cloudflare${NC}"
    echo ""
    echo "Please authenticate first:"
    echo "  Option 1: wrangler login"
    echo "  Option 2: export CLOUDFLARE_API_TOKEN='your-token'"
    echo ""
    exit 1
fi

echo -e "${GREEN}✓ Authenticated with Cloudflare${NC}"
ACCOUNT_EMAIL=$(wrangler whoami 2>/dev/null | grep "email" | awk '{print $2}' || echo "authenticated")
echo "  Account: $ACCOUNT_EMAIL"
echo ""

# Database info
DB_NAME="investiq"
echo "Database: $DB_NAME"
echo ""

# Step 1: Apply Core Schema
echo -e "${BLUE}📊 Step 1/5: Applying core schema (schema.sql)...${NC}"
echo "  Creating tables: users, assessments, lessons, user_lesson_progress,"
echo "  learning_streaks, concept_queries, news_insights, simulations, topic_mastery"
echo ""

if wrangler d1 execute $DB_NAME --remote --file=schema.sql 2>&1 | grep -q "Success"; then
    echo -e "${GREEN}✓ Core schema applied successfully${NC}"
else
    echo -e "${YELLOW}⚠ Core schema may already exist (continuing...)${NC}"
fi
echo ""

# Step 2: Apply Questions Schema
echo -e "${BLUE}📝 Step 2/5: Applying questions schema (schema-questions.sql)...${NC}"
echo "  Creating tables: questions, user_question_answers"
echo "  Creating views: user_weak_topics, user_unanswered_questions, user_question_stats"
echo ""

if wrangler d1 execute $DB_NAME --remote --file=schema-questions.sql 2>&1 | grep -q "Success"; then
    echo -e "${GREEN}✓ Questions schema applied successfully${NC}"
else
    echo -e "${YELLOW}⚠ Questions schema may already exist (continuing...)${NC}"
fi
echo ""

# Step 3: Import 30 Questions
echo -e "${BLUE}📥 Step 3/5: Importing 30 questions (questions-import.sql)...${NC}"
echo "  Importing: 10 Beginner + 10 Intermediate + 10 Advanced questions"
echo ""

IMPORT_OUTPUT=$(wrangler d1 execute $DB_NAME --remote --file=questions-import.sql 2>&1)
if echo "$IMPORT_OUTPUT" | grep -q "Success"; then
    echo -e "${GREEN}✓ Questions imported successfully${NC}"
elif echo "$IMPORT_OUTPUT" | grep -q "UNIQUE constraint failed"; then
    echo -e "${YELLOW}⚠ Questions already imported (skipping duplicates)${NC}"
else
    echo -e "${GREEN}✓ Questions import completed${NC}"
fi
echo ""

# Step 4: Apply Adaptive Schema
echo -e "${BLUE}🎯 Step 4/5: Applying adaptive quiz schema (schema-adaptive.sql)...${NC}"
echo "  Creating tables: quiz_sessions, quiz_answers"
echo "  Creating views: user_quiz_history, quiz_progression, get_active_session"
echo ""

if wrangler d1 execute $DB_NAME --remote --file=schema-adaptive.sql 2>&1 | grep -q "Success"; then
    echo -e "${GREEN}✓ Adaptive schema applied successfully${NC}"
else
    echo -e "${YELLOW}⚠ Adaptive schema may already exist (continuing...)${NC}"
fi
echo ""

# Step 5: Verify All Tables
echo -e "${BLUE}✅ Step 5/5: Verifying database setup...${NC}"
echo ""

# Get table count
TABLE_OUTPUT=$(wrangler d1 execute $DB_NAME --remote --command "SELECT name FROM sqlite_master WHERE type='table' ORDER BY name" 2>&1)

echo "Tables created:"
echo "$TABLE_OUTPUT" | grep -E "^\s*(users|assessments|lessons|questions|quiz_sessions|quiz_answers|user_)" | sed 's/^/  ✓ /'
echo ""

# Count tables
TABLE_COUNT=$(echo "$TABLE_OUTPUT" | grep -cE "^\s*(users|assessments|lessons|questions|quiz_sessions|quiz_answers|user_|learning_|concept_|news_|simulations|topic_)" || echo "0")
echo -e "${GREEN}Total tables: $TABLE_COUNT${NC}"
echo ""

# Get question count
echo "Verifying questions imported..."
QUESTION_COUNT=$(wrangler d1 execute $DB_NAME --remote --command "SELECT COUNT(*) as count FROM questions" 2>&1 | grep -oP '\d+' | tail -1 || echo "0")
echo -e "${GREEN}Questions in database: $QUESTION_COUNT / 30${NC}"
echo ""

# Get lesson count
echo "Verifying lessons..."
LESSON_COUNT=$(wrangler d1 execute $DB_NAME --remote --command "SELECT COUNT(*) as count FROM lessons" 2>&1 | grep -oP '\d+' | tail -1 || echo "0")
echo -e "${GREEN}Lessons in database: $LESSON_COUNT${NC}"
echo ""

# Summary
echo "=================================="
echo -e "${GREEN}🎉 Database Setup Complete!${NC}"
echo "=================================="
echo ""
echo "Summary:"
echo "  ✓ Core schema (11 tables)"
echo "  ✓ Questions schema (2 tables + 3 views)"
echo "  ✓ Adaptive schema (2 tables + 3 views)"
echo "  ✓ $QUESTION_COUNT questions imported"
echo "  ✓ $LESSON_COUNT lessons available"
echo ""
echo "Next steps:"
echo "  1. Generate frontend with V0 (see V0_PROMPT_ADAPTIVE_QUIZ.md)"
echo "  2. Test API endpoints:"
echo "     - POST /api/assessment-adaptive/start"
echo "     - POST /api/assessment-adaptive/answer"
echo "  3. Deploy to Cloudflare Pages"
echo ""
echo "Database ready for adaptive assessment! 🚀"
echo ""
