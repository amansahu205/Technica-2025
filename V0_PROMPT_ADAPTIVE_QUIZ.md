# V0 Prompt: Adaptive Assessment Quiz Interface

Copy and paste this prompt into V0.dev to generate your adaptive quiz frontend.

---

## 📋 V0 Prompt

```
Create a modern, adaptive investment quiz application using Next.js 14 with the following specifications:

DESIGN REQUIREMENTS:
- Use glassmorphism design (backdrop-blur, semi-transparent backgrounds)
- Dark theme with gradient accents (purple to blue)
- Smooth animations using framer-motion
- Fully accessible (ARIA labels, keyboard navigation)
- Mobile-responsive layout

QUIZ FLOW:
1. Start screen with "Begin Assessment" button
2. Question display (one question at a time)
3. Answer submission with immediate feedback
4. Progress indicator showing:
   - Question number (e.g., "Question 5 of 10")
   - Current skill level (visual indicator, e.g., bar chart)
   - Level change indicator (+0.4 or -0.2)
5. Results screen with:
   - Final tier (Beginner/Intermediate/Advanced)
   - Final score (1.0 - 3.0)
   - Progression graph showing level changes over 10 questions
   - Breakdown of questions by difficulty

UI COMPONENTS NEEDED:

1. START SCREEN:
   - Hero section with title "Investment Knowledge Assessment"
   - Subtitle: "Adaptive quiz that adjusts to your skill level"
   - Large "Start Quiz" button
   - Features list:
     * "10 personalized questions"
     * "Adaptive difficulty"
     * "Real-time skill tracking"

2. QUESTION CARD:
   - Question text (large, readable)
   - 4 multiple choice options (A, B, C, D)
   - Options should:
     * Have hover effects
     * Show selected state
     * Be keyboard navigable
   - Submit button (disabled until option selected)
   - Skip button (optional)

3. PROGRESS DISPLAY:
   - Top bar showing "Question X of 10"
   - Linear progress bar (0-100%)
   - Current level indicator:
     * Visual representation (e.g., "Level 2.3")
     * Tier label (Beginner/Intermediate/Advanced)
     * Small icon or badge

4. FEEDBACK MODAL:
   - Shows after submitting answer
   - Displays:
     * "Correct!" or "Incorrect" with icon
     * Correct answer highlighted
     * Explanation text
     * Level change (e.g., "+0.6" in green or "-0.4" in red)
   - "Next Question" button
   - Auto-dismiss after 3 seconds (optional)

5. RESULTS SCREEN:
   - Large final tier badge (Beginner/Intermediate/Advanced)
   - Final score displayed prominently (e.g., "2.45")
   - Stats grid showing:
     * Total questions: 10
     * Correct answers: 7
     * Accuracy: 70%
   - PROGRESSION GRAPH:
     * Line chart showing level over 10 questions
     * X-axis: Question number (1-10)
     * Y-axis: Skill level (1.0-3.0)
     * Points colored by correctness (green=correct, red=incorrect)
     * Difficulty markers (1=easy, 2=medium, 3=hard)
   - Breakdown section:
     * Questions by difficulty answered
     * Accuracy per difficulty tier
   - "Retake Quiz" and "View Learning Path" buttons

TECHNICAL REQUIREMENTS:

STATE MANAGEMENT:
- Track: sessionId, currentQuestion, questionNumber, currentLevel
- Use React useState and useEffect
- Handle loading states

API INTEGRATION:
- POST /api/assessment-adaptive/start
  Request: { userId: string }
  Response: { sessionId, question, questionNumber, currentLevel }

- POST /api/assessment-adaptive/answer
  Request: { sessionId, questionId, userAnswer }
  Response: {
    quizComplete: boolean,
    correctAnswer, explanation, isCorrect,
    nextQuestion?, questionNumber?, currentLevel?, levelChange?,
    finalScore?, finalTier?, progression?
  }

ANIMATIONS:
- Question transitions (slide in/out)
- Answer selection (scale, glow)
- Feedback appear/disappear (fade + scale)
- Progress bar fill animation
- Results reveal (stagger elements)
- Graph drawing animation

ACCESSIBILITY:
- Proper heading hierarchy
- ARIA labels on all interactive elements
- Keyboard navigation (Tab, Enter, Arrow keys)
- Focus indicators
- Screen reader announcements for:
  * Question changes
  * Answer feedback
  * Quiz completion

COLOR SCHEME:
- Background: Dark gradient (purple-900 to blue-900)
- Cards: Glass effect (bg-white/10, backdrop-blur-lg)
- Primary accent: Purple (#8B5CF6)
- Success: Green (#10B981)
- Error: Red (#EF4444)
- Text: White/gray scale

EXAMPLE COMPONENT STRUCTURE:
```typescript
'use client'

export default function AdaptiveQuiz() {
  const [quizState, setQuizState] = useState<'start' | 'quiz' | 'results'>('start')
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null)
  const [questionNumber, setQuestionNumber] = useState(1)
  const [currentLevel, setCurrentLevel] = useState(1.5)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [showFeedback, setShowFeedback] = useState(false)
  const [feedback, setFeedback] = useState<FeedbackData | null>(null)
  const [results, setResults] = useState<QuizResults | null>(null)

  // ... implementation
}
```

PROGRESSION GRAPH SPECIFICATIONS:
- Use recharts library
- Line chart with:
  * Data points for each question
  * Smooth curve
  * Gradient fill under line
  * Tooltip showing:
    - Question number
    - Level at that point
    - Difficulty of question
    - Correct/incorrect
- Responsive sizing
- Animate on mount

ADDITIONAL FEATURES:
- Loading spinner during API calls
- Error handling with retry button
- Confetti animation on quiz completion (if Advanced tier)
- Share results button (optional)
- Timer per question (optional)

Make it visually stunning, smooth, and professional. Use modern React patterns and best practices.
```

---

## 🎨 Design References

**Glassmorphism Card Example:**
```css
.glass-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}
```

**Gradient Background:**
```css
.background {
  background: linear-gradient(135deg, #1e1b4b 0%, #1e3a8a 100%);
}
```

---

## 📊 Data Structures

**Question Interface:**
```typescript
interface Question {
  id: string
  difficultyScore: number // 1, 2, or 3
  text: string
  options: Array<{ key: string; value: string }> // [{key: 'A', value: '...'}, ...]
}
```

**Feedback Data:**
```typescript
interface FeedbackData {
  isCorrect: boolean
  correctAnswer: string
  explanation: string
  levelChange: number
}
```

**Quiz Results:**
```typescript
interface QuizResults {
  finalScore: number
  finalTier: 'Beginner' | 'Intermediate' | 'Advanced'
  progression: Array<{
    questionNumber: number
    level: number
    difficulty: number
    correct: boolean
  }>
}
```

---

## 🎯 Key Features to Emphasize

1. **Real-time Adaptation**
   - Show level bar that grows/shrinks with each answer
   - Visual feedback: green for correct, red for incorrect
   - Difficulty indicator on each question

2. **Progress Visualization**
   - Animated progress bar
   - Question counter with smooth transitions
   - Level indicator that updates in real-time

3. **Engaging Feedback**
   - Celebrate correct answers (confetti, checkmark animation)
   - Encouraging message for incorrect (lightbulb icon, "Let's learn!")
   - Show explanation after each answer

4. **Beautiful Results**
   - Large, prominent tier badge
   - Animated progression graph
   - Stats breakdown with icons
   - Call-to-action buttons

---

## 💡 V0 Tips

**When pasting into V0:**

1. **Be specific:** V0 works best with detailed requirements
2. **Request iterations:** Ask V0 to:
   - "Make the graph more colorful"
   - "Add more animations"
   - "Improve mobile responsiveness"
3. **Component breakdown:** If output is too complex, ask for individual components:
   - "Generate just the QuestionCard component"
   - "Generate just the ProgressionGraph component"

**Example follow-up prompts:**

```
"Add a pulsing animation to the Submit button when an answer is selected"

"Make the progression graph show difficulty with different colored dots:
 green=easy, yellow=medium, red=hard"

"Add a celebration animation when user achieves Advanced tier"

"Improve the glassmorphism effect - make it more prominent with better blur"
```

---

## 🚀 Integration Steps

After V0 generates the code:

1. **Copy the component** to `frontend/app/assessment-adaptive/page.tsx`

2. **Update API calls** to match your backend:
   ```typescript
   // Replace userId with actual user ID from auth
   const userId = 'user123' // TODO: Get from auth context
   ```

3. **Test locally:**
   ```bash
   cd frontend
   npm run dev
   ```

4. **Check API endpoints are working:**
   - Start quiz: POST /api/assessment-adaptive/start
   - Submit answer: POST /api/assessment-adaptive/answer

5. **Deploy to Cloudflare Pages** and test live

---

## 📸 Visual Examples to Request from V0

**Question Screen:**
```
┌─────────────────────────────────────┐
│  Question 3 of 10          Level 2.1│
│  ████████░░░░░░░░  (30% complete)   │
├─────────────────────────────────────┤
│                                     │
│  What is diversification?           │
│                                     │
│  ◯ A. Investing all in one stock   │
│  ● B. Spreading across assets      │ ← Selected
│  ◯ C. Only cash                     │
│  ◯ D. Only gold                     │
│                                     │
│         [Submit Answer]             │
│                                     │
└─────────────────────────────────────┘
```

**Results Screen:**
```
┌─────────────────────────────────────┐
│        🎓 Advanced!                 │
│       Final Score: 2.45             │
├─────────────────────────────────────┤
│                                     │
│   📊 Progression Graph              │
│   3.0 ┤                        •    │
│   2.5 ┤              •  •  •       │
│   2.0 ┤        •  •                 │
│   1.5 ┤   •                         │
│   1.0 ┤                             │
│       └─────────────────────────    │
│         1  2  3  4  5  6  7  8  9 10│
│                                     │
├─────────────────────────────────────┤
│  Correct: 7/10         Accuracy: 70%│
│  Easy: 2/3   Medium: 3/4   Hard: 2/3│
│                                     │
│  [Retake]    [View Learning Path]  │
└─────────────────────────────────────┘
```

---

## ✨ Final V0 Request

After initial generation, ask V0 to:

```
"Enhance this component with:
1. Add framer-motion animations for all transitions
2. Make the progression graph interactive (hover to see details)
3. Add confetti animation using react-confetti when user gets Advanced
4. Improve the glassmorphism cards with better shadows and borders
5. Add sound effects option for correct/incorrect answers
6. Make it fully TypeScript with proper interfaces
7. Add error boundaries for API failures
8. Include loading skeletons while fetching questions"
```

---

Good luck with V0! The adaptive quiz will look amazing! 🎨✨
