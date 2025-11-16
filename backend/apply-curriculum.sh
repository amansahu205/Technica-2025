#!/bin/bash

# InvestIQ Curriculum Setup Script
# Applies module schema updates and seeds the 15-lesson beginner curriculum
# Run this after setting up the base database

set -e  # Exit on error

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

DB_NAME="investiq"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo -e "${BLUE}╔════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   InvestIQ Curriculum Setup                ║${NC}"
echo -e "${BLUE}║   15 Lessons across 3 Modules              ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════╝${NC}\n"

# Check if wrangler is installed
if ! command -v wrangler &> /dev/null; then
    echo -e "${RED}✗ Error: wrangler CLI not found${NC}"
    echo "  Install with: npm install -g wrangler"
    exit 1
fi

echo -e "${YELLOW}⚠  Warning: This will modify your lessons table structure${NC}"
echo -e "${YELLOW}   and delete existing lesson data!${NC}\n"
read -p "Continue? (y/N) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}Aborted.${NC}"
    exit 0
fi

echo ""

# Step 1: Apply schema changes (add module columns)
echo -e "${BLUE}[1/4]${NC} Applying module schema updates..."
if wrangler d1 execute "$DB_NAME" --file="$SCRIPT_DIR/schema-modules.sql" --remote 2>&1 | grep -q "success"; then
    echo -e "${GREEN}✓ Schema updated successfully${NC}"
else
    echo -e "${YELLOW}⚠ Schema update may have failed (columns might already exist)${NC}"
fi

echo ""

# Step 2: Clear existing lesson data
echo -e "${BLUE}[2/4]${NC} Clearing existing lesson data..."
if wrangler d1 execute "$DB_NAME" --command "DELETE FROM lessons" --remote 2>&1; then
    echo -e "${GREEN}✓ Old lesson data cleared${NC}"
else
    echo -e "${RED}✗ Failed to clear lesson data${NC}"
    exit 1
fi

echo ""

# Step 3: Seed curriculum data
echo -e "${BLUE}[3/4]${NC} Seeding 15-lesson curriculum..."
if wrangler d1 execute "$DB_NAME" --file="$SCRIPT_DIR/seed-curriculum.sql" --remote 2>&1 | grep -q "success"; then
    echo -e "${GREEN}✓ Curriculum data seeded successfully${NC}"
else
    echo -e "${RED}✗ Failed to seed curriculum${NC}"
    exit 1
fi

echo ""

# Step 4: Verify data
echo -e "${BLUE}[4/4]${NC} Verifying curriculum data..."

# Count total lessons
LESSON_COUNT=$(wrangler d1 execute "$DB_NAME" --command "SELECT COUNT(*) as count FROM lessons" --json --remote 2>/dev/null | grep -o '"count":[0-9]*' | grep -o '[0-9]*' || echo "0")

# Count modules
MODULE_COUNT=$(wrangler d1 execute "$DB_NAME" --command "SELECT COUNT(DISTINCT module_number) as count FROM lessons" --json --remote 2>/dev/null | grep -o '"count":[0-9]*' | grep -o '[0-9]*' || echo "0")

if [ "$LESSON_COUNT" -eq 15 ] && [ "$MODULE_COUNT" -eq 3 ]; then
    echo -e "${GREEN}✓ Verification successful!${NC}"
    echo -e "${GREEN}  • 15 lessons imported${NC}"
    echo -e "${GREEN}  • 3 modules configured${NC}"
else
    echo -e "${YELLOW}⚠ Verification incomplete${NC}"
    echo -e "${YELLOW}  • Found $LESSON_COUNT lessons (expected 15)${NC}"
    echo -e "${YELLOW}  • Found $MODULE_COUNT modules (expected 3)${NC}"
fi

echo ""

# Display curriculum summary
echo -e "${BLUE}╔════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║          Curriculum Summary                ║${NC}"
echo -e "${BLUE}╠════════════════════════════════════════════╣${NC}"
echo -e "${BLUE}║${NC} Module 1: Investment Fundamentals       ${BLUE}║${NC}"
echo -e "${BLUE}║${NC}   • Days 1-5                             ${BLUE}║${NC}"
echo -e "${BLUE}║${NC}   • 5 lessons                            ${BLUE}║${NC}"
echo -e "${BLUE}║                                            ${BLUE}║${NC}"
echo -e "${BLUE}║${NC} Module 2: Stock Markets & Portfolio     ${BLUE}║${NC}"
echo -e "${BLUE}║${NC}   • Days 6-10                            ${BLUE}║${NC}"
echo -e "${BLUE}║${NC}   • 5 lessons                            ${BLUE}║${NC}"
echo -e "${BLUE}║                                            ${BLUE}║${NC}"
echo -e "${BLUE}║${NC} Module 3: Getting Started               ${BLUE}║${NC}"
echo -e "${BLUE}║${NC}   • Days 11-15                           ${BLUE}║${NC}"
echo -e "${BLUE}║${NC}   • 5 lessons                            ${BLUE}║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════╝${NC}"

echo ""
echo -e "${GREEN}✓ Curriculum setup complete!${NC}"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo -e "  1. Test the curriculum API: ${BLUE}GET /api/curriculum${NC}"
echo -e "  2. Test with user progress: ${BLUE}GET /api/curriculum?userId=xxx${NC}"
echo -e "  3. Update frontend to display the new curriculum"
echo ""
