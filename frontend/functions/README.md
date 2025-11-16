# Cloudflare Pages Functions

This directory contains serverless API endpoints that run on Cloudflare's edge network alongside your Next.js static site.

## 🚀 **How It Works**

Pages Functions are serverless functions that:
- Run on Cloudflare's global network
- Have direct access to D1 database and KV storage
- Are deployed automatically with your Pages site
- Support TypeScript out of the box

## 📁 **API Endpoints**

All functions are accessible at `/api/*` routes:

### **1. Profile API** - `/api/profile`

**GET** `/api/profile?userId=xxx`
- Fetch user profile from D1 database
- Returns: user object with skill level, preferences, etc.

**POST** `/api/profile`
```json
{
  "id": "user123",
  "email": "user@example.com",
  "name": "John Doe",
  "skill_level": "beginner"
}
```
- Create or update user profile
- Upserts user data in D1

### **2. Assessment API** - `/api/assessment`

**POST** `/api/assessment`
```json
{
  "userId": "user123",
  "answers": ["b", "c", "b", "a", ...]
}
```
- Submit quiz answers
- Returns: skill level, score, total questions
- Stores assessment result in D1
- Updates user's skill level

### **3. Lessons API** - `/api/lessons`

**GET** `/api/lessons`
- Get all lessons from D1 database
- Returns: array of lesson objects

**GET** `/api/lessons?userId=xxx`
- Get lessons with user progress
- Includes: status (locked/in_progress/completed), quiz scores

**GET** `/api/lessons?lessonId=lesson-1`
- Get specific lesson details

**POST** `/api/lessons`
```json
{
  "userId": "user123",
  "lessonId": "lesson-1",
  "status": "completed",
  "quizScore": 85
}
```
- Update lesson progress

### **4. Questions API** - `/api/questions`

**GET** `/api/questions`
- Get random assessment questions
- Omits correct answers (for security)

**GET** `/api/questions?difficulty=1`
- Filter by difficulty (1=beginner, 2=intermediate, 3=advanced)

**GET** `/api/questions?count=10`
- Limit number of questions returned

### **5. Insights API** - `/api/insights`

**POST** `/api/insights`
```json
{
  "headline": "Apple announces new product",
  "ticker": "AAPL",
  "userId": "user123"
}
```
- Analyze news headline
- Returns: explanation, related concepts
- Stores insight in D1

**GET** `/api/insights?userId=xxx`
- Get user's past insights history

## 🔧 **Environment Bindings**

Functions have access to:
- **`env.DB`** - D1 Database (investiq)
  - Database ID: `fdb7c213-b732-4155-88c6-000900224c56`
  - Binding name: `DB`
- **`env.AI`** (optional) - Cloudflare Workers AI
  - For AI-powered explanations and insights

## 📦 **Database Schema**

The D1 database includes these tables:
- `users` - User profiles and preferences
- `assessments` - Quiz results and skill assessments
- `lessons` - Learning content (10 lessons seeded)
- `user_lesson_progress` - Track user progress through lessons
- `learning_streaks` - Engagement tracking
- `concept_queries` - AI interaction history
- `news_insights` - Analyzed headlines
- `simulations` - Portfolio simulations
- `topic_mastery` - Per-topic performance tracking

## 🧪 **Testing Locally**

### **1. Install Wrangler**
```bash
npm install -g wrangler
```

### **2. Test Functions Locally**
```bash
cd frontend
npx wrangler pages dev . --binding DB=fdb7c213-b732-4155-88c6-000900224c56
```

This starts a local dev server with access to your remote D1 database.

### **3. Test API Endpoints**

**Test profile:**
```bash
curl http://localhost:8788/api/profile?userId=user123
```

**Test lessons:**
```bash
curl http://localhost:8788/api/lessons
```

**Test assessment submission:**
```bash
curl -X POST http://localhost:8788/api/assessment \
  -H "Content-Type: application/json" \
  -d '{"userId":"user123","answers":["b","c","b","a","b","c","b","b","b","c"]}'
```

## 🌐 **Deployment**

Functions are automatically deployed when you push to your repository:

1. **Push changes:**
   ```bash
   git add frontend/functions/
   git commit -m "Add Pages Functions"
   git push origin main
   ```

2. **Cloudflare Pages automatically:**
   - Builds your Next.js site
   - Deploys functions to the edge
   - Binds D1 database

3. **Access in production:**
   - `https://your-site.pages.dev/api/profile`
   - `https://your-site.pages.dev/api/lessons`
   - etc.

## 🔗 **Connecting Frontend**

Your existing API client in `frontend/lib/api/` will automatically use these endpoints:

```typescript
// frontend/lib/api/client.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || ''

// In production on Cloudflare Pages, this becomes:
// https://your-site.pages.dev/api/...
```

No changes needed! The frontend API client will use relative URLs in production.

## 📚 **Resources**

- [Cloudflare Pages Functions Docs](https://developers.cloudflare.com/pages/platform/functions/)
- [D1 Database Docs](https://developers.cloudflare.com/d1/)
- [Workers AI Docs](https://developers.cloudflare.com/workers-ai/)

## 🏆 **Hackathon Tips**

✅ **Qualifies for Cloudflare Prize:**
- Using Cloudflare Pages ✓
- Using D1 Database ✓
- Using Workers AI (optional) ✓
- Serverless architecture ✓

✅ **Free tier limits:**
- D1: 5M reads/month, 100K writes/month
- Pages Functions: 100K requests/day
- Workers AI: 10K requests/day

Perfect for hackathon demos!
