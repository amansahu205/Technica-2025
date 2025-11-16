# InvestIQ Beginner Curriculum

## Overview

The InvestIQ platform features a comprehensive **15-lesson beginner curriculum** organized into **3 progressive modules**. This curriculum is designed to take complete beginners from basic investment concepts to building their first real portfolio.

## Curriculum Structure

### Module 1: Investment Fundamentals (Days 1-5)

**Goal:** Build a strong foundation in core investment concepts

1. **Investing vs. Saving: What's the Difference?** (15 min)
   - Topics: investing basics, saving vs investing, financial goals, wealth building

2. **Understanding Asset Types: Stocks, Bonds & Real Estate** (20 min)
   - Topics: asset types, stocks, bonds, real estate, portfolio basics

3. **The Power of Compound Interest & Time Value of Money** (18 min)
   - Topics: compound interest, time value of money, exponential growth, long-term investing

4. **Inflation & Why Your Money Loses Value** (15 min)
   - Topics: inflation, purchasing power, cash vs investing, wealth preservation

5. **Risk vs. Reward: The Fundamental Trade-off** (20 min)
   - Topics: risk and reward, risk tolerance, investment returns, risk assessment

**Total Duration:** 88 minutes (1.5 hours)

---

### Module 2: Stock Markets & Portfolio Basics (Days 6-10)

**Goal:** Understand how markets work and learn portfolio construction principles

6. **How Stock Exchanges Work: From Buy Orders to Trades** (18 min)
   - Topics: stock exchanges, trading, market mechanics, bid-ask spread, NYSE, NASDAQ

7. **Reading Stock Information: Price, Volume & P/E Ratio** (22 min)
   - Topics: stock quotes, P/E ratio, trading volume, market cap, stock valuation, financial metrics

8. **Portfolio Construction: The 60/40 Rule & Asset Allocation** (20 min)
   - Topics: portfolio construction, asset allocation, 60/40 rule, diversification, balanced portfolio

9. **Index Funds vs. Individual Stocks: The Great Debate** (18 min)
   - Topics: index funds, individual stocks, passive investing, active investing, ETFs, mutual funds

10. **Portfolio Rebalancing: Keeping Your Investments on Track** (16 min)
    - Topics: portfolio rebalancing, portfolio maintenance, asset allocation, risk management

**Total Duration:** 94 minutes (1.6 hours)

---

### Module 3: Getting Started & Building Your First Portfolio (Days 11-15)

**Goal:** Take action and build your first real investment portfolio

11. **Setting Investment Goals & Creating Your Timeline** (18 min)
    - Topics: investment goals, financial planning, SMART goals, timeline planning, goal setting

12. **Choosing a Brokerage Platform: Features & Fees** (20 min)
    - Topics: brokerage platforms, online brokers, trading fees, account setup, platform comparison

13. **Account Types: 401(k), IRA, Roth IRA & Taxable Accounts** (22 min)
    - Topics: 401k, IRA, Roth IRA, retirement accounts, tax-advantaged investing, account types

14. **Avoiding Behavioral Pitfalls: Psychology of Investing** (20 min)
    - Topics: behavioral finance, investing psychology, emotional investing, panic selling, FOMO, discipline

15. **Building Your First Portfolio: Step-by-Step Action Plan** (25 min)
    - Topics: first portfolio, dollar-cost averaging, portfolio building, getting started, action plan, beginner strategy

**Total Duration:** 105 minutes (1.75 hours)

---

## Total Curriculum

- **15 lessons**
- **3 modules**
- **~287 minutes total** (4.8 hours)
- **91 quiz questions** across all lessons
- **60+ topics** covered

---

## Setup Instructions

### 1. Apply Schema Changes

The curriculum requires additional columns in the `lessons` table:

```bash
cd backend
./apply-curriculum.sh
```

This script will:
1. Add `module_number`, `module_title`, and `module_description` columns
2. Clear old lesson data
3. Seed all 15 lessons with module grouping
4. Verify the data

### 2. Manual Setup (Alternative)

If you prefer to run commands manually:

```bash
# Add module support to schema
wrangler d1 execute investiq --file=schema-modules.sql --remote

# Clear old data
wrangler d1 execute investiq --command "DELETE FROM lessons" --remote

# Seed curriculum
wrangler d1 execute investiq --file=seed-curriculum.sql --remote

# Verify
wrangler d1 execute investiq --command "SELECT COUNT(*) FROM lessons" --remote
```

---

## API Usage

### Get Full Curriculum

```bash
GET /api/curriculum
```

**Response:**
```json
{
  "modules": [
    {
      "number": 1,
      "title": "Investment Fundamentals",
      "description": "Build a strong foundation...",
      "lessons": [
        {
          "id": "lesson-1",
          "day": 1,
          "title": "Investing vs. Saving: What's the Difference?",
          "description": "Learn the fundamental difference...",
          "durationMinutes": 15,
          "difficulty": "beginner",
          "topics": ["investing basics", "saving vs investing", ...],
          "quizQuestions": 5
        },
        ...
      ]
    },
    ...
  ],
  "totalLessons": 15
}
```

### Get Curriculum with User Progress

```bash
GET /api/curriculum?userId=user123
```

**Response includes:**
```json
{
  "modules": [
    {
      "number": 1,
      "title": "Investment Fundamentals",
      "lessons": [
        {
          "id": "lesson-1",
          "status": "completed",
          "quizScore": 100,
          "completedAt": "2024-01-15T10:30:00Z",
          ...
        }
      ],
      "progress": {
        "totalLessons": 5,
        "completedLessons": 3,
        "percentComplete": 60
      }
    }
  ],
  "userProgress": {
    "overallProgress": 40,
    "completedLessons": 6,
    "currentLesson": { ... }
  }
}
```

### Get Specific Module

```bash
GET /api/curriculum?module=1
```

Returns only Module 1 lessons.

---

## Database Schema

### Lessons Table (Updated)

```sql
CREATE TABLE lessons (
  id TEXT PRIMARY KEY,
  day INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  duration_minutes INTEGER,
  difficulty TEXT CHECK(difficulty IN ('beginner', 'intermediate', 'advanced')),
  topics TEXT, -- JSON array
  quiz_questions INTEGER DEFAULT 0,

  -- NEW: Module grouping
  module_number INTEGER,
  module_title TEXT,
  module_description TEXT
);

CREATE INDEX idx_lessons_module ON lessons(module_number, day);
```

---

## Frontend Integration

### Example: Display Curriculum

```typescript
import { useEffect, useState } from 'react'

function CurriculumPage() {
  const [curriculum, setCurriculum] = useState(null)
  const { user } = useUser()

  useEffect(() => {
    fetch(`/api/curriculum${user ? `?userId=${user.id}` : ''}`)
      .then(res => res.json())
      .then(data => setCurriculum(data))
  }, [user])

  return (
    <div>
      <h1>Your Learning Path</h1>
      {curriculum?.modules.map(module => (
        <div key={module.number}>
          <h2>{module.title}</h2>
          <p>{module.description}</p>
          {module.progress && (
            <p>Progress: {module.progress.percentComplete}%</p>
          )}

          {module.lessons.map(lesson => (
            <div key={lesson.id}>
              <h3>{lesson.title}</h3>
              <p>{lesson.description}</p>
              <span>{lesson.durationMinutes} min</span>
              {lesson.status && <Badge>{lesson.status}</Badge>}
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}
```

---

## Personalization Features

The curriculum integrates with the personalization system:

1. **Adaptive Difficulty**: Lessons can be presented at different complexity levels (ELI5, beginner, advanced) based on user preference
2. **Topic Tracking**: The `topics` JSON array enables weak topic identification
3. **Progress Tracking**: `user_lesson_progress` table tracks completion, quiz scores, and time spent
4. **Recommended Next Lesson**: API returns `currentLesson` based on user progress

---

## Future Enhancements

Potential additions to the curriculum system:

1. **Prerequisites**: Add `prerequisite_lesson_ids` field to enforce lesson order
2. **Dynamic Unlocking**: Auto-unlock next lesson on quiz completion
3. **Certificates**: Award completion certificates for each module
4. **Learning Paths**: Add intermediate/advanced curricula
5. **Micro-lessons**: Break lessons into smaller 5-minute segments
6. **Video Content**: Add video URLs to lessons
7. **Practice Problems**: Interactive coding/calculation exercises

---

## Files

- `schema-modules.sql` - Schema updates to add module support
- `seed-curriculum.sql` - All 15 lessons with module grouping
- `apply-curriculum.sh` - Automated setup script
- `frontend/functions/api/curriculum.ts` - Curriculum API endpoint

---

## Questions?

See the main `DATABASE_SETUP.md` for general database information.
