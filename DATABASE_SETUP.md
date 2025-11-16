# Database Setup Guide

## Recommended: Cloudflare D1 + KV (FREE Tier)

Perfect for your hackathon! Both are **completely free** to start.

---

## 📊 **Database Architecture**

```
┌─────────────────────────────────────┐
│         Frontend (Next.js)          │
│      Deployed on Cloudflare Pages   │
└─────────────────┬───────────────────┘
                  │
                  ▼
┌─────────────────────────────────────┐
│      Cloudflare Workers             │
│    (API Layer - 4 endpoints)        │
└──────┬──────────────────────┬───────┘
       │                      │
       ▼                      ▼
┌──────────────┐      ┌──────────────┐
│ D1 Database  │      │  KV Storage  │
│ (Relational) │      │  (Cache)     │
└──────────────┘      └──────────────┘
```

---

## 🚀 **Quick Setup (15 minutes)**

### **Step 1: Install Wrangler CLI**
```bash
npm install -g wrangler
wrangler login
```

### **Step 2: Create D1 Database**
```bash
cd /home/user/Technica-2025/backend

# Create database
wrangler d1 create investiq-db

# Output will show:
# binding_name = "DB"
# database_id = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
```

### **Step 3: Initialize Schema**
```bash
# Apply schema
wrangler d1 execute investiq-db --file=schema.sql

# Verify tables created
wrangler d1 execute investiq-db --command="SELECT name FROM sqlite_master WHERE type='table'"
```

### **Step 4: Create KV Namespace**
```bash
# Production KV
wrangler kv:namespace create "CACHE"

# Dev KV (optional)
wrangler kv:namespace create "CACHE" --preview
```

### **Step 5: Seed Initial Data**
```bash
# Create seed file
cat > seed.sql << 'EOF'
-- Insert default lessons
INSERT INTO lessons (id, day, title, description, duration_minutes, difficulty, topics, quiz_questions) VALUES
  ('lesson-1', 1, 'Introduction to Investing', 'Learn the fundamental concepts of investing', 15, 'beginner', '["basics", "stocks", "bonds"]', 3),
  ('lesson-2', 2, 'Stocks vs Bonds', 'Understand the key differences between stocks and bonds', 20, 'beginner', '["stocks", "bonds", "asset-classes"]', 4),
  ('lesson-3', 3, 'Understanding Risk', 'Explore investment risk and management', 18, 'beginner', '["risk", "diversification"]', 5),
  ('lesson-4', 4, 'Portfolio Diversification', 'Learn how to spread investments', 22, 'intermediate', '["diversification", "portfolio"]', 4),
  ('lesson-5', 5, 'Market Indices Explained', 'What are indices and how they work', 16, 'beginner', '["indices", "market"]', 3),
  ('lesson-6', 6, 'Dividend Investing', 'How companies share profits', 19, 'intermediate', '["dividends", "income"]', 4);
EOF

wrangler d1 execute investiq-db --file=seed.sql
```

---

## 🔧 **Configuration**

### **Create `wrangler.toml`**
```bash
cd /home/user/Technica-2025/backend
cat > wrangler.toml << 'EOF'
name = "investiq-api"
main = "src/worker.js"
compatibility_date = "2024-01-01"

# D1 Database Binding
[[d1_databases]]
binding = "DB"
database_name = "investiq-db"
database_id = "YOUR_DATABASE_ID_HERE"  # From step 2

# KV Namespace Binding
[[kv_namespaces]]
binding = "CACHE"
id = "YOUR_KV_ID_HERE"  # From step 4

# Workers AI Binding (for Cloudflare prize!)
[ai]
binding = "AI"
EOF
```

---

## 💾 **Data Model Usage Examples**

### **1. Store User After Assessment**
```javascript
// After quiz completion
const result = await env.DB.prepare(
  `INSERT INTO users (id, email, name, skill_level)
   VALUES (?, ?, ?, ?)`
).bind(userId, email, name, detectedLevel).run();

await env.DB.prepare(
  `INSERT INTO assessments (id, user_id, total_questions, correct_answers, score_percentage, detected_level, answers_detail, knowledge_gaps)
   VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
).bind(
  assessmentId,
  userId,
  10,
  correctCount,
  percentage,
  detectedLevel,
  JSON.stringify(answers),
  JSON.stringify(gaps)
).run();
```

### **2. Track Lesson Progress**
```javascript
// When user starts a lesson
await env.DB.prepare(
  `INSERT INTO user_lesson_progress (id, user_id, lesson_id, status, started_at)
   VALUES (?, ?, ?, 'in_progress', datetime('now'))
   ON CONFLICT(user_id, lesson_id) DO UPDATE SET
     status = 'in_progress',
     started_at = datetime('now')`
).bind(progressId, userId, lessonId).run();

// When user completes lesson
await env.DB.prepare(
  `UPDATE user_lesson_progress
   SET status = 'completed',
       completed_at = datetime('now'),
       quiz_score = ?,
       complexity_level_used = ?
   WHERE user_id = ? AND lesson_id = ?`
).bind(quizScore, complexityLevel, userId, lessonId).run();
```

### **3. Cache User Context in KV (Fast Access)**
```javascript
// Build user context
const context = {
  skill_level: user.skill_level,
  completed_lessons: completedLessonIds,
  current_lesson: currentLessonId,
  knowledge_gaps: knowledgeGaps,
  topics_of_interest: topicsOfInterest,
  current_streak: streakDays,
  last_active: new Date().toISOString()
};

// Cache in KV (5 minute TTL)
await env.CACHE.put(
  `user:${userId}:context`,
  JSON.stringify(context),
  { expirationTtl: 300 } // 5 minutes
);

// Fast retrieval
const cachedContext = await env.CACHE.get(`user:${userId}:context`, 'json');
```

### **4. Track AI Queries (for Personalization)**
```javascript
// When user asks a question
await env.DB.prepare(
  `INSERT INTO concept_queries (id, user_id, query_text, topic, complexity_requested)
   VALUES (?, ?, ?, ?, ?)`
).bind(queryId, userId, question, extractedTopic, complexityLevel).run();

// Update topic mastery
await env.DB.prepare(
  `INSERT INTO topic_mastery (id, user_id, topic, times_queried, last_reviewed)
   VALUES (?, ?, ?, 1, datetime('now'))
   ON CONFLICT(user_id, topic) DO UPDATE SET
     times_queried = times_queried + 1,
     last_reviewed = datetime('now')`
).bind(masteryId, userId, topic).run();
```

### **5. Get Personalized Recommendations**
```javascript
// Fetch user's weak topics
const { results } = await env.DB.prepare(
  `SELECT topic, mastery_level, quiz_accuracy
   FROM topic_mastery
   WHERE user_id = ? AND needs_review = TRUE
   ORDER BY quiz_accuracy ASC
   LIMIT 3`
).bind(userId).all();

// Find lessons covering weak topics
const weakTopics = results.map(r => r.topic);
const { results: recommendedLessons } = await env.DB.prepare(
  `SELECT id, title, description, difficulty
   FROM lessons
   WHERE json_extract(topics, '$') LIKE ?
     AND id NOT IN (
       SELECT lesson_id FROM user_lesson_progress
       WHERE user_id = ? AND status = 'completed'
     )
   LIMIT 5`
).bind(`%${weakTopics[0]}%`, userId).all();
```

---

## 📈 **Free Tier Limits**

### **Cloudflare D1**
- ✅ **5 GB** database storage
- ✅ **5 million** reads/month
- ✅ **100,000** writes/month
- ✅ Unlimited databases

**Your Usage Estimate (100 users):**
- Reads: ~10k/month (well within limit)
- Writes: ~5k/month (well within limit)
- Storage: ~50 MB (tons of room)

### **Cloudflare KV**
- ✅ **1 GB** stored data
- ✅ **100,000** reads/day
- ✅ **1,000** writes/day

**Your Usage Estimate:**
- Reads: ~1k/day (user context lookups)
- Writes: ~200/day (context updates)
- Storage: ~10 MB

---

## 🎯 **Alternative: Supabase (Also FREE)**

If you prefer PostgreSQL with built-in auth:

### **Setup**
```bash
# Install Supabase CLI
npm install -g supabase

# Initialize
supabase init
supabase start

# Apply schema (convert SQLite → PostgreSQL)
supabase db push
```

### **Free Tier**
- ✅ 500 MB database
- ✅ Built-in Auth
- ✅ Real-time subscriptions
- ✅ Automatic REST API

---

## 🏆 **Recommended for Hackathon**

**Use Cloudflare D1 + KV because:**

1. ✅ **Faster setup** (one platform)
2. ✅ **Better for prize** (qualifies for Cloudflare prize)
3. ✅ **Edge computing** (faster for users worldwide)
4. ✅ **Integrated AI** (Workers AI for free LLM calls)
5. ✅ **Auto-scaling** (no server management)

---

## 📝 **Next Steps**

1. ✅ Run setup commands above
2. ✅ Create Workers to replace Python backend
3. ✅ Update frontend to call Workers instead of Python
4. ✅ Deploy frontend to Cloudflare Pages

Want me to help with any of these steps?
