# Database Setup Checklist - InvestIQ

Now that your frontend is deploying correctly, you need to populate the database with the curriculum and questions.

## ✅ Complete Setup Checklist

### 1. Apply All Schemas & Import Questions (30 questions)

This script applies all 3 schemas and imports the 30 questions:

```bash
cd backend
./apply-all-schemas.sh
```

**What this does:**
- ✅ Applies `schema.sql` (11 core tables)
- ✅ Applies `schema-questions.sql` (questions tables)
- ✅ Applies `schema-adaptive.sql` (adaptive quiz tables)
- ✅ Imports 30 questions (10 beginner, 10 intermediate, 10 advanced)
- ✅ Verifies data with colored output

---

### 2. Apply Curriculum (15 lessons across 3 modules)

This script adds the module support and seeds all 15 lessons:

```bash
cd backend
./apply-curriculum.sh
```

**What this does:**
- ✅ Adds module_number, module_title, module_description columns
- ✅ Seeds 15 lessons organized into 3 modules
- ✅ Verifies 15 lessons and 3 modules exist
- ✅ Shows curriculum summary

---

### 3. Verify Database Setup

Check that everything is in place:

```bash
cd backend

# Check questions count (should be 30)
wrangler d1 execute investiq --command "SELECT COUNT(*) as count FROM questions" --remote

# Check lessons count (should be 15)
wrangler d1 execute investiq --command "SELECT COUNT(*) as count FROM lessons" --remote

# Check modules (should be 3)
wrangler d1 execute investiq --command "SELECT DISTINCT module_number, module_title FROM lessons ORDER BY module_number" --remote
```

**Expected output:**
```
Questions: 30
Lessons: 15
Modules: 3 (Investment Fundamentals, Stock Markets & Portfolio Basics, Getting Started)
```

---

## 🧪 Test Your APIs

Once database is set up, test these endpoints:

### Test 1: Get Questions
```bash
curl https://26983f8d.technica-2025.pages.dev/api/questions?count=5
```

**Expected:** JSON array with 5 questions from database

---

### Test 2: Get Curriculum
```bash
curl https://26983f8d.technica-2025.pages.dev/api/curriculum
```

**Expected:** JSON with 3 modules, each containing 5 lessons

---

### Test 3: Get Specific Module
```bash
curl https://26983f8d.technica-2025.pages.dev/api/curriculum?module=1
```

**Expected:** JSON with Module 1 (Investment Fundamentals) and its 5 lessons

---

### Test 4: Get Lessons (existing endpoint)
```bash
curl https://26983f8d.technica-2025.pages.dev/api/lessons
```

**Expected:** JSON array with all 15 lessons

---

## 📊 Database Contents After Setup

| Table | Records | Description |
|-------|---------|-------------|
| `questions` | 30 | Quiz questions (10 per difficulty level) |
| `lessons` | 15 | Learning curriculum (3 modules × 5 lessons) |
| `users` | 0 | Empty initially (created on signup) |
| `assessments` | 0 | Empty initially (created when users take quizzes) |
| `user_question_answers` | 0 | Empty initially (tracks individual answers) |
| `quiz_sessions` | 0 | Empty initially (adaptive quiz sessions) |

---

## 🎯 Frontend Features Now Working

After database setup, these features will work:

### ✅ Assessment Page
- Fetches 10 random questions from database
- Submits answers and saves to `user_question_answers`
- Calculates skill level (beginner/intermediate/advanced)
- Updates user profile with detected level

### ✅ Curriculum API
- Returns 15 lessons organized into 3 modules
- Shows user progress if userId provided
- Calculates completion percentages
- Identifies current lesson for user

### ✅ Adaptive Quiz
- Already working (was implemented before)
- Uses database questions
- Adjusts difficulty in real-time

### ✅ Question Bank
- 30 questions ready to use
- Properly tagged with topics and difficulty
- Supports filtering by difficulty level

---

## 🚨 Troubleshooting

### Issue: Scripts fail with "wrangler: command not found"

**Fix:**
```bash
npm install -g wrangler
wrangler login
```

### Issue: "Database not found"

**Fix:**
```bash
# List your databases
wrangler d1 list

# Make sure investiq database exists
# If not, create it:
wrangler d1 create investiq
```

### Issue: "Table already exists" error

This is **normal** if you've run the scripts before. The scripts handle this gracefully.

### Issue: API returns empty array

**Cause:** Database not seeded yet

**Fix:** Run `./apply-all-schemas.sh` and `./apply-curriculum.sh`

---

## 📋 Quick Command Reference

```bash
# 1. Setup everything at once
cd backend
./apply-all-schemas.sh && ./apply-curriculum.sh

# 2. Verify setup
wrangler d1 execute investiq --command "SELECT COUNT(*) FROM questions" --remote
wrangler d1 execute investiq --command "SELECT COUNT(*) FROM lessons" --remote

# 3. View sample data
wrangler d1 execute investiq --command "SELECT id, text, difficulty_score FROM questions LIMIT 5" --remote
wrangler d1 execute investiq --command "SELECT day, title, module_title FROM lessons ORDER BY day" --remote
```

---

## ✅ You're Done When...

- ✅ `apply-all-schemas.sh` shows "30 questions imported"
- ✅ `apply-curriculum.sh` shows "15 lessons, 3 modules"
- ✅ `/api/questions` returns real questions
- ✅ `/api/curriculum` returns 3 modules with 15 lessons
- ✅ Assessment page loads questions from database

---

## 🎉 Next Steps After Setup

1. **Test the assessment flow** - Take a quiz on your site
2. **Check data persistence** - Verify answers saved to database
3. **Create lesson content** - Write the actual lesson materials for each topic
4. **Build quiz questions** - Expand from 30 to more questions
5. **Implement personalization** - Use the topic mastery data

---

Need help with any of these steps? Let me know!
