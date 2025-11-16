# 🎯 Personalized Learning - Complete Setup Guide

You're absolutely right - storing questions in the database enables powerful personalization!

---

## ❌ Current Problem

**Questions are hardcoded in frontend** → Can't personalize based on specific topics user struggles with

**What we're missing:**
- Questions aren't in D1 database
- Individual answers aren't tracked
- Can't recommend lessons based on weak topics
- Can't show "You got diversification questions wrong" insights

---

## ✅ Solution: Question Bank + Answer Tracking

### **New Database Tables**

**1. `questions` table**
- Stores all 30 questions from `questions.json`
- Each question tagged with:
  - `difficulty_score` (1, 2, 3)
  - `concept` (e.g., "diversification", "P/E ratio")
  - `topics` (JSON array for multi-topic questions)
  - `explanation` (for learning after quiz)

**2. `user_question_answers` table**
- Tracks every question every user answers
- Records:
  - Which question
  - User's answer (A/B/C/D)
  - Whether correct
  - Time taken
  - Linked to assessment session

**3. Enhanced `topic_mastery` tracking**
- Auto-updates based on question performance
- Tracks accuracy per topic
- Flags topics needing review

---

## 🚀 Setup Instructions

### **Step 1: Apply New Schema**

Add questions table to your D1 database:

```bash
cd backend

# Apply new schema
wrangler d1 execute investiq --remote --file=schema-questions.sql
```

This creates:
- ✅ `questions` table
- ✅ `user_question_answers` table
- ✅ 3 personalization views

### **Step 2: Import 30 Questions**

Import your `questions.json` into D1:

```bash
# Generate SQL import (already done)
node import-questions.js > questions-import.sql

# Import into D1
wrangler d1 execute investiq --remote --file=questions-import.sql
```

This adds all 30 questions with:
- ✅ 10 beginner questions (difficulty: 1)
- ✅ 10 intermediate questions (difficulty: 2)
- ✅ 10 advanced questions (difficulty: 3)
- ✅ Each tagged with concept & topics

### **Step 3: Verify Import**

Check questions were imported:

```bash
wrangler d1 execute investiq --remote --command "SELECT COUNT(*) as total FROM questions"
# Should show: 30

wrangler d1 execute investiq --remote --command "SELECT id, concept, difficulty_score FROM questions LIMIT 5"
```

### **Step 4: Update Frontend API Call**

Use the enhanced assessment API that saves individual answers:

**Option A: Update existing endpoint** (backend/functions/api/assessment.ts)
- Add question ID tracking
- Save to `user_question_answers` table

**Option B: Use new v2 endpoint** (backend/functions/api/assessment-v2.ts)
- Already implements full personalization
- Just change frontend to call `/api/assessment-v2`

---

## 🎨 Personalization Features Enabled

### **1. Topic-Based Recommendations**

After user completes assessment:

```sql
-- Get topics user struggles with
SELECT topic, accuracy_percentage
FROM user_weak_topics
WHERE user_id = ?
ORDER BY accuracy_percentage ASC
LIMIT 3
```

**Use case:**
> "You scored 30% on **diversification** questions. Here's a lesson to help!"

### **2. Adaptive Question Selection**

Show questions user hasn't seen yet:

```sql
-- Get unanswered questions for user
SELECT question_id, text, difficulty_score
FROM user_unanswered_questions
WHERE user_id = ?
  AND difficulty_score = ? -- Match user's level
LIMIT 10
```

**Use case:**
> Don't repeat questions. Show fresh content each time.

### **3. Learning Path Personalization**

Recommend lessons based on weak topics:

```sql
-- Find lessons covering weak topics
SELECT l.id, l.title, l.description
FROM lessons l
JOIN user_weak_topics uwt ON uwt.user_id = ?
WHERE l.topics LIKE '%' || uwt.topic || '%'
ORDER BY uwt.accuracy_percentage ASC
LIMIT 5
```

**Use case:**
> "Based on your assessment, start with these lessons: [Diversification Basics], [Risk Management], [Portfolio Theory]"

### **4. Progress Tracking**

Show improvement over time:

```sql
-- Compare first vs latest assessment on same topic
SELECT
  topic,
  MIN(quiz_accuracy) as initial_accuracy,
  MAX(quiz_accuracy) as current_accuracy,
  MAX(quiz_accuracy) - MIN(quiz_accuracy) as improvement
FROM topic_mastery
WHERE user_id = ?
GROUP BY topic
HAVING improvement > 0
```

**Use case:**
> "You improved **+45%** on P/E ratio questions! 🎉"

### **5. Difficulty Adaptation**

Auto-adjust question difficulty:

```typescript
// Get user's average accuracy
const { results } = await DB.prepare(
  'SELECT overall_accuracy FROM user_question_stats WHERE user_id = ?'
).bind(userId).all()

const accuracy = results[0].overall_accuracy

// Adjust difficulty
let difficulty = 1 // beginner
if (accuracy > 70) difficulty = 2 // intermediate
if (accuracy > 85) difficulty = 3 // advanced

// Fetch appropriate questions
const questions = await DB.prepare(
  'SELECT * FROM questions WHERE difficulty_score = ? ORDER BY RANDOM() LIMIT 10'
).bind(difficulty).all()
```

**Use case:**
> User aces beginner questions → Show intermediate questions next time

---

## 📊 Personalization Views

### **1. `user_weak_topics`**

Shows topics where user accuracy < 70%:

```sql
SELECT * FROM user_weak_topics WHERE user_id = 'user123';
```

Returns:
```
| user_id | topic            | times_attempted | times_correct | accuracy_percentage |
|---------|------------------|-----------------|---------------|---------------------|
| user123 | diversification  | 3               | 1             | 33.33               |
| user123 | P/E ratio        | 2               | 1             | 50.00               |
```

### **2. `user_unanswered_questions`**

Lists questions user hasn't seen:

```sql
SELECT * FROM user_unanswered_questions
WHERE user_id = 'user123'
  AND difficulty_score = 2 -- intermediate
LIMIT 5;
```

### **3. `user_question_stats`**

Overall performance summary:

```sql
SELECT * FROM user_question_stats WHERE user_id = 'user123';
```

Returns:
```
| user_id | total_questions_answered | correct_answers | overall_accuracy | avg_time_per_question |
|---------|--------------------------|-----------------|------------------|-----------------------|
| user123 | 20                       | 14              | 70.00            | 18.5                  |
```

---

## 🔧 Example: Personalized Learn Page

**Current:** Shows generic lessons

**After personalization:**

```typescript
// frontend/app/learn/page.tsx

// 1. Get user's weak topics
const weakTopicsResponse = await fetch(`/api/topics/weak?userId=${userId}`)
const weakTopics = await weakTopicsResponse.json()

// 2. Get recommended lessons
const lessonsResponse = await fetch(
  `/api/lessons/recommended?userId=${userId}`
)
const recommendedLessons = await lessonsResponse.json()

// 3. Display personalized message
return (
  <div>
    <h2>Your Personalized Learning Path</h2>

    {weakTopics.length > 0 && (
      <section>
        <h3>Areas to Improve</h3>
        <ul>
          {weakTopics.map(topic => (
            <li key={topic.topic}>
              {topic.topic} - {topic.accuracy_percentage}% accuracy
            </li>
          ))}
        </ul>
      </section>
    )}

    <section>
      <h3>Recommended Lessons</h3>
      {recommendedLessons.map(lesson => (
        <LessonCard
          key={lesson.id}
          lesson={lesson}
          reason={`Covers ${lesson.focus_topic} - your weak area`}
        />
      ))}
    </section>
  </div>
)
```

---

## 🎯 Real-World Example

### **Scenario: User Takes Assessment**

**User answers 10 questions:**
- 3 on "diversification" → 1 correct (33%)
- 3 on "stocks" → 3 correct (100%)
- 2 on "bonds" → 1 correct (50%)
- 2 on "P/E ratio" → 2 correct (100%)

**What gets stored:**

**`user_question_answers` table:**
```
id | user_id | question_id | is_correct | answered_at
---|---------|-------------|------------|-------------
1  | user123 | B3          | false      | 2025-11-16
2  | user123 | B1          | true       | 2025-11-16
3  | user123 | I1          | true       | 2025-11-16
... 10 rows total
```

**`topic_mastery` table:**
```
user_id | topic           | quiz_accuracy | mastery_level | needs_review
--------|-----------------|---------------|---------------|-------------
user123 | diversification | 33.33         | struggling    | true
user123 | stocks          | 100.00        | mastered      | false
user123 | bonds           | 50.00         | learning      | true
user123 | valuation       | 100.00        | mastered      | false
```

**Personalized recommendation:**
> "Great job on **stocks** and **P/E ratios**! Let's work on **diversification** (33% accuracy). We recommend starting with Lesson 4: Portfolio Diversification."

---

## 📦 Files Added

**Database Schema:**
- `backend/schema-questions.sql` - Questions & answer tracking tables
- `backend/questions-import.sql` - Generated SQL to import 30 questions

**Import Script:**
- `backend/import-questions.js` - Converts questions.json → SQL

**Enhanced API:**
- `frontend/functions/api/assessment-v2.ts` - Personalization-enabled assessment

**Documentation:**
- `PERSONALIZATION_SETUP.md` - This guide

---

## ✅ Deployment Checklist

- [ ] Apply `schema-questions.sql` to D1
- [ ] Import 30 questions from `questions-import.sql`
- [ ] Verify with: `SELECT COUNT(*) FROM questions`
- [ ] Update frontend to call `/api/assessment-v2`
- [ ] Test: Complete assessment, check `user_question_answers` table
- [ ] Build personalized learn page
- [ ] Add "weak topics" widget to dashboard

---

## 🏆 Personalization = Better Hackathon Demo

**Before:**
- Generic quiz
- Static lesson list
- No user insights

**After:**
- "You struggled with diversification → Here's a custom lesson"
- "You've improved +40% on risk management! 🎉"
- Adaptive difficulty (harder questions for advanced users)
- Data-driven recommendations

**Judge Appeal:**
- Shows sophisticated data modeling
- Demonstrates ML/AI thinking (even without ML)
- Proves you understand UX personalization
- Highlights Cloudflare D1's query capabilities

---

Your insight was spot-on! Storing questions in the database unlocks true personalization. 🎯
