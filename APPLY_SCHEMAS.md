# 🚀 Apply Database Schemas - Quick Guide

## ⚡ Quick Start (Automated)

### **Step 1: Authenticate**

```bash
cd backend

# Option 1: Browser login (easiest)
wrangler login

# Option 2: API Token (if browser doesn't work)
export CLOUDFLARE_API_TOKEN='your-token-here'
```

### **Step 2: Run Automated Script**

```bash
./apply-all-schemas.sh
```

**That's it!** The script applies all schemas automatically with verification.

---

## 📝 Manual Steps (Alternative)

If you prefer to run commands manually:

### **Step 1: Authenticate**

```bash
wrangler login
# OR
export CLOUDFLARE_API_TOKEN='your-token-here'
```

### **Step 2: Apply Core Schema**

```bash
wrangler d1 execute investiq --remote --file=schema.sql
```

**Creates:**
- users
- assessments
- lessons
- user_lesson_progress
- learning_streaks
- concept_queries
- news_insights
- simulations
- topic_mastery
- 2 views (user_learning_profile, user_recent_activity)

### **Step 3: Apply Questions Schema**

```bash
wrangler d1 execute investiq --remote --file=schema-questions.sql
```

**Creates:**
- questions (stores 30 questions)
- user_question_answers (tracks individual answers)
- 3 views (user_weak_topics, user_unanswered_questions, user_question_stats)

### **Step 4: Import 30 Questions**

```bash
wrangler d1 execute investiq --remote --file=questions-import.sql
```

**Imports:**
- 10 Beginner questions (difficulty: 1)
- 10 Intermediate questions (difficulty: 2)
- 10 Advanced questions (difficulty: 3)

### **Step 5: Apply Adaptive Schema**

```bash
wrangler d1 execute investiq --remote --file=schema-adaptive.sql
```

**Creates:**
- quiz_sessions (tracks adaptive quiz state)
- quiz_answers (records each answer with level changes)
- 3 views (user_quiz_history, quiz_progression, get_active_session)

### **Step 6: Verify Setup**

```bash
# Check all tables
wrangler d1 execute investiq --remote --command "SELECT name FROM sqlite_master WHERE type='table' ORDER BY name"

# Count questions
wrangler d1 execute investiq --remote --command "SELECT COUNT(*) as count FROM questions"

# Count lessons
wrangler d1 execute investiq --remote --command "SELECT COUNT(*) as count FROM lessons"
```

**Expected:**
- 15+ tables
- 30 questions
- 10 lessons (if seed.sql was run earlier)

---

## 🔍 Verification Checklist

After applying schemas, verify:

### **Core Tables** ✓
- [ ] users
- [ ] assessments
- [ ] lessons
- [ ] user_lesson_progress
- [ ] learning_streaks
- [ ] concept_queries
- [ ] news_insights
- [ ] simulations
- [ ] topic_mastery

### **Question Tables** ✓
- [ ] questions (30 rows)
- [ ] user_question_answers

### **Adaptive Tables** ✓
- [ ] quiz_sessions
- [ ] quiz_answers

### **Views** ✓
- [ ] user_learning_profile
- [ ] user_recent_activity
- [ ] user_weak_topics
- [ ] user_unanswered_questions
- [ ] user_question_stats
- [ ] user_quiz_history
- [ ] quiz_progression
- [ ] get_active_session

---

## 🧪 Test Queries

After setup, test with these queries:

### **1. Get all questions by difficulty**

```bash
wrangler d1 execute investiq --remote --command "SELECT id, difficulty_score, text FROM questions ORDER BY difficulty_score, id LIMIT 5"
```

### **2. Get all lessons**

```bash
wrangler d1 execute investiq --remote --command "SELECT id, title, difficulty FROM lessons ORDER BY day"
```

### **3. Check adaptive views**

```bash
wrangler d1 execute investiq --remote --command "SELECT name FROM sqlite_master WHERE type='view'"
```

---

## ⚠️ Troubleshooting

### **Error: "Not authenticated"**

Run: `wrangler login` or set `CLOUDFLARE_API_TOKEN`

### **Error: "table already exists"**

This is normal if you're re-running schemas. The script handles this gracefully.

### **Error: "UNIQUE constraint failed"**

Questions were already imported. This is safe to ignore.

### **Warning: "account_id in wrangler.toml"**

This warning is harmless. The database still works correctly.

---

## 📊 Expected Database Structure

```
investiq (D1 Database)
├── Core Tables (9)
│   ├── users
│   ├── assessments
│   ├── lessons
│   ├── user_lesson_progress
│   ├── learning_streaks
│   ├── concept_queries
│   ├── news_insights
│   ├── simulations
│   └── topic_mastery
│
├── Question Tables (2)
│   ├── questions (30 rows)
│   └── user_question_answers
│
├── Adaptive Tables (2)
│   ├── quiz_sessions
│   └── quiz_answers
│
└── Views (8)
    ├── user_learning_profile
    ├── user_recent_activity
    ├── user_weak_topics
    ├── user_unanswered_questions
    ├── user_question_stats
    ├── user_quiz_history
    ├── quiz_progression
    └── get_active_session
```

**Total:**
- 13 Tables
- 8 Views
- 30 Questions
- 10 Lessons (from earlier seed)

---

## 🎯 What's Next

After database setup:

1. **Test API endpoints:**
   ```bash
   # Start adaptive quiz
   curl -X POST https://your-site.pages.dev/api/assessment-adaptive/start \
     -H "Content-Type: application/json" \
     -d '{"userId":"test123"}'
   ```

2. **Generate frontend with V0:**
   - Use prompt from `V0_PROMPT_ADAPTIVE_QUIZ.md`
   - Create adaptive quiz UI

3. **Deploy to Cloudflare Pages:**
   - Push to GitHub
   - Cloudflare auto-deploys
   - Verify D1 binding (Settings → Functions → D1 Databases)

---

## ✅ Success Indicators

You'll know setup succeeded when:

- ✅ Script completes without errors
- ✅ `SELECT COUNT(*) FROM questions` returns 30
- ✅ `SELECT COUNT(*) FROM lessons` returns 10
- ✅ All 13 tables exist
- ✅ All 8 views exist
- ✅ API endpoints return data (not 500 errors)

---

## 🚀 Quick Commands Reference

```bash
# Authenticate
wrangler login

# Apply all schemas (automated)
cd backend && ./apply-all-schemas.sh

# Or manually (one by one)
wrangler d1 execute investiq --remote --file=schema.sql
wrangler d1 execute investiq --remote --file=schema-questions.sql
wrangler d1 execute investiq --remote --file=questions-import.sql
wrangler d1 execute investiq --remote --file=schema-adaptive.sql

# Verify
wrangler d1 execute investiq --remote --command "SELECT COUNT(*) FROM questions"
wrangler d1 execute investiq --remote --command "SELECT COUNT(*) FROM lessons"
wrangler d1 execute investiq --remote --command "SELECT name FROM sqlite_master WHERE type='table'"
```

---

**Time to complete:** ~5 minutes (automated) or ~10 minutes (manual)

Ready? Run `./apply-all-schemas.sh` now! 🎉
