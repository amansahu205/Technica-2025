# 🚀 Setup Database NOW - Copy & Paste Commands

## Quick Setup (5 Minutes)

### **Step 1: Authenticate with Cloudflare**

You mentioned your token: `w-mSUZCOB10a6g-eHUPY0hlgV02Xn8yPdT66kvh3`

```bash
cd backend
export CLOUDFLARE_API_TOKEN='w-mSUZCOB10a6g-eHUPY0hlgV02Xn8yPdT66kvh3'
```

**Verify authentication:**
```bash
wrangler whoami
```

You should see your Cloudflare account info.

---

### **Step 2: Run Automated Setup Script**

```bash
./apply-all-schemas.sh
```

**That's it!** The script will:
- ✅ Apply core schema (11 tables)
- ✅ Apply questions schema (2 tables + 3 views)
- ✅ Import 30 questions
- ✅ Apply adaptive schema (2 tables + 3 views)
- ✅ Verify everything

---

## ✅ What You'll See

Expected output:

```
🚀 InvestIQ Database Schema Setup
==================================

🔐 Checking Cloudflare authentication...
✓ Authenticated with Cloudflare
  Account: your-email@example.com

Database: investiq

📊 Step 1/5: Applying core schema (schema.sql)...
✓ Core schema applied successfully

📝 Step 2/5: Applying questions schema (schema-questions.sql)...
✓ Questions schema applied successfully

📥 Step 3/5: Importing 30 questions (questions-import.sql)...
✓ Questions imported successfully

🎯 Step 4/5: Applying adaptive quiz schema (schema-adaptive.sql)...
✓ Adaptive schema applied successfully

✅ Step 5/5: Verifying database setup...
Tables created:
  ✓ users
  ✓ assessments
  ✓ lessons
  ✓ questions
  ✓ quiz_sessions
  ✓ quiz_answers
  ... (and more)

Total tables: 13
Questions in database: 30 / 30
Lessons in database: 10

==================================
🎉 Database Setup Complete!
==================================
```

---

## 🧪 Test It Works

After setup, test with:

```bash
# Get question count
wrangler d1 execute investiq --remote --command "SELECT COUNT(*) as count FROM questions"
# Should show: 30

# Get sample questions
wrangler d1 execute investiq --remote --command "SELECT id, difficulty_score, text FROM questions LIMIT 5"

# List all tables
wrangler d1 execute investiq --remote --command "SELECT name FROM sqlite_master WHERE type='table' ORDER BY name"
```

---

## 📋 Manual Commands (If Script Fails)

If the automated script doesn't work, run these commands one by one:

```bash
# 1. Core schema
wrangler d1 execute investiq --remote --file=schema.sql

# 2. Questions schema
wrangler d1 execute investiq --remote --file=schema-questions.sql

# 3. Import questions
wrangler d1 execute investiq --remote --file=questions-import.sql

# 4. Adaptive schema
wrangler d1 execute investiq --remote --file=schema-adaptive.sql

# 5. Verify
wrangler d1 execute investiq --remote --command "SELECT COUNT(*) FROM questions"
```

---

## ⚠️ Common Issues

### **"Not authenticated"**
Set the token:
```bash
export CLOUDFLARE_API_TOKEN='w-mSUZCOB10a6g-eHUPY0hlgV02Xn8yPdT66kvh3'
```

### **"Table already exists"**
This is normal if re-running. The script handles it gracefully.

### **"UNIQUE constraint failed"**
Questions already imported. Safe to ignore.

---

## ✨ After Setup

Once database setup completes:

### **1. Test API Endpoints**

Your Cloudflare Pages Functions should now work!

**Start adaptive quiz:**
```bash
curl -X POST https://your-site.pages.dev/api/assessment-adaptive/start \
  -H "Content-Type: application/json" \
  -d '{"userId":"test123"}'
```

**Submit answer:**
```bash
curl -X POST https://your-site.pages.dev/api/assessment-adaptive/answer \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "session_test123_...",
    "questionId": "B1",
    "userAnswer": "B"
  }'
```

### **2. Generate Frontend with V0**

1. Go to: https://v0.dev
2. Copy entire prompt from: `V0_PROMPT_ADAPTIVE_QUIZ.md`
3. Paste and generate
4. Copy to: `frontend/app/assessment-adaptive/page.tsx`
5. Test locally: `cd frontend && npm run dev`

### **3. Deploy**

Everything auto-deploys when you push to GitHub!

---

## 🎯 Current Status

✅ **Backend:** Complete (8 API endpoints ready)
✅ **Database Schemas:** Created (ready to apply)
✅ **Questions:** 30 questions ready (ready to import)
✅ **Setup Scripts:** Automated (ready to run)

⏳ **You need to:**
1. Run `./apply-all-schemas.sh` (2 minutes)
2. Test API endpoints (1 minute)
3. Generate UI with V0 (2 minutes)

**Total time:** 5 minutes to fully working adaptive quiz! 🚀

---

## 🆘 Need Help?

**If script fails:** See `APPLY_SCHEMAS.md` for detailed troubleshooting

**If API doesn't work:** Check D1 binding in Cloudflare Pages Settings → Functions

**If V0 needs tweaking:** Ask V0 to modify specific components

---

Ready? Copy these commands:

```bash
cd backend
export CLOUDFLARE_API_TOKEN='w-mSUZCOB10a6g-eHUPY0hlgV02Xn8yPdT66kvh3'
wrangler whoami
./apply-all-schemas.sh
```

🎉 **Your adaptive assessment system is minutes away!**
