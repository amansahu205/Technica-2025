# 📁 File Locations - Where Everything Is

## 📍 Your Local Repository

**Location:** `/home/user/Technica-2025`

---

## 🗂️ Complete File Structure

```
/home/user/Technica-2025/
│
├── 📚 DOCUMENTATION (Root Directory)
│   ├── SETUP_NOW.md ⭐                    ← START HERE! Quick setup commands
│   ├── APPLY_SCHEMAS.md                   ← Detailed schema setup guide
│   ├── ADAPTIVE_SYSTEM_READY.md           ← How adaptive system works
│   ├── V0_PROMPT_ADAPTIVE_QUIZ.md         ← V0 frontend generation prompt
│   ├── PERSONALIZATION_SETUP.md           ← Personalization features guide
│   ├── PAGES_FUNCTIONS_SETUP.md           ← API endpoints documentation
│   ├── DATABASE_SETUP.md                  ← Original D1 setup guide
│   └── README.md                          ← Project overview
│
├── 📊 DATA FILES (Root Directory)
│   ├── questions.json (15KB)              ← 30 assessment questions
│   └── users.json (196 bytes)             ← Sample user data
│
├── 🔧 BACKEND (backend/)
│   │
│   ├── 🚀 SETUP SCRIPTS
│   │   ├── apply-all-schemas.sh ⭐         ← Run this to setup database!
│   │   ├── setup-database.sh              ← Alternative setup script
│   │   └── import-questions.js            ← Generates questions-import.sql
│   │
│   ├── 🗄️ DATABASE SCHEMAS
│   │   ├── schema.sql (7.4KB)             ← Core database (11 tables)
│   │   ├── schema-questions.sql (3.1KB)   ← Question bank (2 tables + 3 views)
│   │   ├── schema-adaptive.sql (3.1KB)    ← Adaptive quiz (2 tables + 3 views)
│   │   ├── questions-import.sql (15KB)    ← 30 questions ready to import
│   │   └── seed.sql (2.0KB)               ← 10 lesson seeds
│   │
│   ├── ⚙️ CONFIGURATION
│   │   └── wrangler.toml                  ← D1 database configuration
│   │
│   ├── 📖 DOCUMENTATION
│   │   ├── AUTHENTICATE.md                ← Cloudflare auth guide
│   │   └── AI_PERSONALIZATION.md          ← AI strategy
│   │
│   └── 🐍 PYTHON (legacy)
│       ├── investiq_server.py             ← Old Python backend
│       └── src/                           ← Python modules
│
├── 💻 FRONTEND (frontend/)
│   │
│   ├── 🎯 CLOUDFLARE PAGES FUNCTIONS (frontend/functions/)
│   │   │
│   │   ├── api/
│   │   │   ├── 🎮 ADAPTIVE QUIZ API
│   │   │   │   ├── assessment-adaptive/
│   │   │   │   │   ├── start.ts          ← Start adaptive quiz
│   │   │   │   │   └── answer.ts         ← Submit answer, get next question
│   │   │   │
│   │   │   ├── 📝 STANDARD API
│   │   │   │   ├── assessment.ts         ← Basic quiz
│   │   │   │   ├── assessment-v2.ts      ← Enhanced with personalization
│   │   │   │   ├── profile.ts            ← User management
│   │   │   │   ├── lessons.ts            ← Learning content
│   │   │   │   ├── questions.ts          ← Question bank API
│   │   │   │   └── insights.ts           ← News analysis
│   │   │
│   │   ├── README.md                     ← API documentation
│   │   └── tsconfig.json                 ← TypeScript config
│   │
│   ├── 🎨 UI PAGES (frontend/app/)
│   │   ├── page.tsx                      ← Home page
│   │   ├── assessment/                   ← Current quiz page (static)
│   │   ├── learn/                        ← Learning dashboard
│   │   ├── insights/                     ← Market insights
│   │   ├── simulator/                    ← Portfolio simulator
│   │   ├── login/                        ← Login page
│   │   ├── signup/                       ← Signup page
│   │   └── settings/                     ← User settings
│   │
│   ├── 🔗 API CLIENT (frontend/lib/api/)
│   │   ├── client.ts                     ← Base API client
│   │   ├── assessment.ts                 ← Assessment API calls
│   │   ├── insights.ts                   ← Insights API calls
│   │   ├── learn.ts                      ← Learning API calls
│   │   ├── company.ts                    ← Company API calls
│   │   └── index.ts                      ← Exports
│   │
│   ├── 📦 TYPES (frontend/types/)
│   │   └── api.ts                        ← TypeScript interfaces
│   │
│   └── ⚙️ CONFIG
│       ├── next.config.mjs               ← Next.js config (static export)
│       ├── package.json                  ← Dependencies
│       └── tsconfig.json                 ← TypeScript config
│
└── 📜 PROJECT FILES
    ├── .git/                             ← Git repository
    ├── .gitignore                        ← Git ignore rules
    └── LICENSE                           ← MIT License
```

---

## 🎯 Key Files You Need

### **1. Database Setup (Run This First!)**

**Location:** `/home/user/Technica-2025/backend/apply-all-schemas.sh`

**What it does:**
- Applies all 3 database schemas
- Imports 30 questions
- Verifies setup

**How to run:**
```bash
cd /home/user/Technica-2025/backend
./apply-all-schemas.sh
```

---

### **2. Quick Setup Guide**

**Location:** `/home/user/Technica-2025/SETUP_NOW.md`

**What's inside:**
- Copy-paste commands
- Your API token included
- Expected output
- Test commands

**View it:**
```bash
cat /home/user/Technica-2025/SETUP_NOW.md
```

---

### **3. V0 Frontend Prompt**

**Location:** `/home/user/Technica-2025/V0_PROMPT_ADAPTIVE_QUIZ.md`

**What's inside:**
- Complete V0.dev prompt
- Design specifications
- Component structure
- Integration examples

**View it:**
```bash
cat /home/user/Technica-2025/V0_PROMPT_ADAPTIVE_QUIZ.md
```

---

### **4. Database Schemas**

**Location:** `/home/user/Technica-2025/backend/`

- `schema.sql` - Core database (11 tables)
- `schema-questions.sql` - Question bank (2 tables + 3 views)
- `schema-adaptive.sql` - Adaptive quiz (2 tables + 3 views)
- `questions-import.sql` - 30 questions ready to import

---

### **5. API Functions (Serverless Backend)**

**Location:** `/home/user/Technica-2025/frontend/functions/api/`

**Adaptive Quiz:**
- `assessment-adaptive/start.ts` - Start quiz endpoint
- `assessment-adaptive/answer.ts` - Submit answer endpoint

**Standard APIs:**
- `assessment.ts` - Basic quiz
- `assessment-v2.ts` - Enhanced quiz
- `profile.ts` - User management
- `lessons.ts` - Learning content
- `questions.ts` - Question bank
- `insights.ts` - News analysis

---

## 🚀 Quick Access Commands

### **Navigate to Backend**
```bash
cd /home/user/Technica-2025/backend
ls -lh *.sh *.sql
```

### **Navigate to Frontend Functions**
```bash
cd /home/user/Technica-2025/frontend/functions
ls -R
```

### **View Documentation**
```bash
cd /home/user/Technica-2025
ls -lh *.md
```

### **View Questions Data**
```bash
cd /home/user/Technica-2025
cat questions.json | head -50
```

---

## 📋 File Sizes Reference

### **Documentation**
- SETUP_NOW.md - 4.8KB (quick start)
- APPLY_SCHEMAS.md - 6.4KB (detailed guide)
- V0_PROMPT_ADAPTIVE_QUIZ.md - 12KB (frontend prompt)
- ADAPTIVE_SYSTEM_READY.md - 11KB (system overview)

### **Database Files**
- schema.sql - 7.4KB
- schema-questions.sql - 3.1KB
- schema-adaptive.sql - 3.1KB
- questions-import.sql - 15KB
- apply-all-schemas.sh - 5.1KB ⭐

### **Data Files**
- questions.json - 15KB (30 questions)
- users.json - 196 bytes (sample data)

### **API Functions**
- assessment-adaptive/start.ts - 5.1KB
- assessment-adaptive/answer.ts - 9.9KB
- assessment.ts - 4.0KB
- assessment-v2.ts - 6.0KB

---

## 🎯 What to Do Next

### **Step 1: Apply Database Schemas**

```bash
cd /home/user/Technica-2025/backend
export CLOUDFLARE_API_TOKEN='w-mSUZCOB10a6g-eHUPY0hlgV02Xn8yPdT66kvh3'
./apply-all-schemas.sh
```

### **Step 2: Generate Frontend**

1. Open: https://v0.dev
2. Copy content from: `/home/user/Technica-2025/V0_PROMPT_ADAPTIVE_QUIZ.md`
3. Paste and generate
4. Save to: `/home/user/Technica-2025/frontend/app/assessment-adaptive/page.tsx`

### **Step 3: Test Locally**

```bash
cd /home/user/Technica-2025/frontend
npm run dev
```

---

## ✨ Summary

**Everything is in:** `/home/user/Technica-2025/`

**Start here:**
1. Read: `SETUP_NOW.md`
2. Run: `backend/apply-all-schemas.sh`
3. Use: `V0_PROMPT_ADAPTIVE_QUIZ.md` for frontend

All files are local and ready to use! 🚀
