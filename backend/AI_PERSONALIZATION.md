# AI Personalization Strategy

## How We Use Database for Personalized Learning

### 1. **Adaptive Difficulty Selection**

**Data Used:**
- `users.skill_level` - Overall proficiency
- `topic_mastery.mastery_level` - Per-topic proficiency
- `user_lesson_progress.complexity_level_used` - Past preferences

**AI Logic:**
```python
def get_personalized_explanation(user_id, topic, query):
    # Fetch user context
    skill_level = db.get_user_skill_level(user_id)
    topic_mastery = db.get_topic_mastery(user_id, topic)

    # Determine complexity
    if topic_mastery == 'struggling':
        complexity = 'eli5'  # Simplify for struggling topics
    elif topic_mastery == 'proficient':
        complexity = 'advanced'  # Challenge them
    else:
        complexity = skill_level  # Use their general level

    # Generate explanation
    return ai.explain(query, complexity_level=complexity)
```

### 2. **Personalized Learning Path**

**Data Used:**
- `assessments.knowledge_gaps` - Topics to prioritize
- `user_lesson_progress.status` - Current progress
- `topic_mastery.needs_review` - Topics requiring review

**AI Logic:**
```python
def generate_next_lesson(user_id):
    gaps = db.get_knowledge_gaps(user_id)
    completed = db.get_completed_lessons(user_id)
    needs_review = db.get_topics_needing_review(user_id)

    # Prioritize review topics
    if needs_review:
        return find_lesson_for_topic(needs_review[0])

    # Fill knowledge gaps
    if gaps:
        return find_lesson_for_gap(gaps[0])

    # Continue sequential path
    return get_next_sequential_lesson(completed)
```

### 3. **Contextual Question Answering**

**Data Used:**
- `concept_queries.query_text` - Past questions
- `user_recent_activity` - Recent learning context
- `user_lesson_progress.context_lesson_id` - Current lesson

**AI Logic:**
```python
def answer_with_context(user_id, question):
    # Get recent activity
    recent_topics = db.get_recent_topics(user_id, limit=5)
    current_lesson = db.get_current_lesson(user_id)

    # Build AI context
    context = f"""
    User is currently learning: {current_lesson.title}
    Recently studied topics: {', '.join(recent_topics)}
    User's skill level: {db.get_skill_level(user_id)}
    """

    return ai.answer(question, context=context)
```

### 4. **Smart Recommendations**

**Data Used:**
- `news_insights.ticker` - User's stock interests
- `simulations.stocks_percentage` - Risk tolerance
- `concept_queries.topic` - Interest patterns

**AI Logic:**
```python
def recommend_insights(user_id):
    # Analyze user interests
    favorite_tickers = db.get_most_viewed_tickers(user_id)
    interest_topics = db.get_frequent_topics(user_id)

    # Find relevant news
    news = fetch_market_news(tickers=favorite_tickers)

    # Rank by relevance to user's interests
    ranked = ai.rank_by_relevance(news, interest_topics)

    return ranked[:5]  # Top 5 recommendations
```

### 5. **Adaptive Quiz Difficulty**

**Data Used:**
- `user_lesson_progress.quiz_score` - Past performance
- `topic_mastery.quiz_accuracy` - Topic-specific accuracy
- `assessments.correct_answers` - Overall competency

**AI Logic:**
```python
def generate_quiz(user_id, lesson_id):
    # Get performance history
    avg_score = db.get_avg_quiz_score(user_id)
    topic_accuracy = db.get_topic_accuracy(user_id, lesson_id)

    # Adjust difficulty
    if avg_score > 0.8 and topic_accuracy > 0.7:
        difficulty = 'hard'
    elif avg_score < 0.5 or topic_accuracy < 0.5:
        difficulty = 'easy'
    else:
        difficulty = 'medium'

    return generate_questions(lesson_id, difficulty)
```

### 6. **Streak & Engagement Personalization**

**Data Used:**
- `learning_streaks.current_streak_days` - Engagement level
- `learning_streaks.last_activity_date` - Recent activity
- `user_lesson_progress.time_spent_seconds` - Session length

**AI Logic:**
```python
def personalized_greeting(user_id):
    streak = db.get_current_streak(user_id)
    last_active = db.get_last_activity(user_id)

    if streak >= 7:
        tone = "enthusiastic"  # Celebrate their dedication
    elif days_since(last_active) > 7:
        tone = "encouraging"  # Welcome them back gently
    else:
        tone = "supportive"  # Standard encouragement

    return ai.generate_greeting(user_id, tone=tone)
```

### 7. **Voice-First Adaptations**

**Data Used:**
- `users.voice_first` - Preference flag
- `users.audio_first` - Audio preference
- `concept_queries.complexity_requested` - Verbal complexity level

**AI Logic:**
```python
def format_for_voice(user_id, content):
    if db.is_voice_first(user_id):
        # Simplify for audio consumption
        return ai.convert_to_conversational(
            content,
            max_sentence_length=15,  # Shorter sentences
            avoid_jargon=True,
            add_pauses=True
        )
    return content
```

---

## Database Access Patterns for AI

### Fast Reads (for real-time AI)
Use **Cloudflare KV** to cache:
- Current user context (last 5 queries, current lesson)
- Topic mastery summary
- User preferences (complexity, voice-first, etc.)

```
KV Key Pattern:
- user:{user_id}:context → Recent activity JSON
- user:{user_id}:mastery → Topic mastery summary
- user:{user_id}:prefs → User preferences
```

### Structured Queries (for analytics)
Use **Cloudflare D1** for:
- User profile lookups
- Learning progress tracking
- Assessment history
- Topic performance aggregation

---

## AI Personalization Features

| Feature | Data Sources | Personalization |
|---------|--------------|-----------------|
| **Concept Explanations** | skill_level, topic_mastery, complexity_preference | Auto-select ELI5 vs Advanced |
| **Lesson Recommendations** | knowledge_gaps, completed_lessons, needs_review | Prioritize weak areas |
| **Quiz Generation** | quiz_scores, topic_accuracy | Adaptive difficulty |
| **News Insights** | viewed_tickers, interest_topics | Filter relevant news |
| **Voice Responses** | voice_first, audio_first | Simplify for audio |
| **Encouragement Messages** | streaks, last_active, time_spent | Tone & motivation level |

---

## Example: Full Personalization Flow

```python
def personalized_dashboard(user_id):
    # 1. Fetch user profile (D1)
    user = db.users.get(user_id)

    # 2. Get cached context (KV - fast!)
    context = kv.get(f"user:{user_id}:context")

    # 3. Calculate next lesson
    next_lesson = ai.recommend_next_lesson(
        skill_level=user.skill_level,
        completed=context['completed_lessons'],
        gaps=context['knowledge_gaps']
    )

    # 4. Get relevant insights
    insights = ai.filter_news(
        user_interests=context['topics_of_interest'],
        tickers=context['favorite_tickers']
    )

    # 5. Personalized greeting
    greeting = ai.generate_greeting(
        name=user.name,
        streak=context['current_streak'],
        tone=calculate_tone(context['last_active'])
    )

    return {
        'greeting': greeting,
        'next_lesson': next_lesson,
        'recommended_insights': insights,
        'progress_summary': calculate_progress(user_id)
    }
```

---

## Performance Optimization

### Caching Strategy (KV)
- **User Context**: Cache for 5 minutes
- **Topic Mastery**: Cache for 1 hour
- **Recent Activity**: Cache for 15 minutes

### Lazy Loading
- Load full assessment history only when viewing analytics
- Load detailed lesson progress on-demand
- Batch-fetch topic mastery for dashboard

### Pre-computation
- Daily job: Update `topic_mastery` metrics
- On lesson completion: Update streak calculations
- On assessment: Recalculate knowledge gaps

---

This database design enables **real-time, context-aware AI personalization** while maintaining performance through smart caching!
