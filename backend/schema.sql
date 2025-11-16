-- InvestIQ Database Schema
-- Optimized for AI-powered personalization

-- ============================================
-- USERS & AUTHENTICATION
-- ============================================

CREATE TABLE users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  last_active DATETIME DEFAULT CURRENT_TIMESTAMP,

  -- Profile
  skill_level TEXT CHECK(skill_level IN ('beginner', 'intermediate', 'advanced')) DEFAULT 'beginner',
  onboarding_complete BOOLEAN DEFAULT FALSE,

  -- Preferences
  language TEXT DEFAULT 'en',
  complexity_preference TEXT CHECK(complexity_preference IN ('eli5', 'beginner', 'advanced')) DEFAULT 'beginner',

  -- Accessibility
  voice_first BOOLEAN DEFAULT FALSE,
  high_contrast BOOLEAN DEFAULT FALSE,
  dyslexia_font BOOLEAN DEFAULT FALSE,
  reduced_animations BOOLEAN DEFAULT FALSE,
  audio_first BOOLEAN DEFAULT FALSE
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_skill_level ON users(skill_level);


-- ============================================
-- ASSESSMENTS & KNOWLEDGE TRACKING
-- ============================================

CREATE TABLE assessments (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  completed_at DATETIME DEFAULT CURRENT_TIMESTAMP,

  -- Results
  total_questions INTEGER NOT NULL,
  correct_answers INTEGER NOT NULL,
  score_percentage REAL NOT NULL,
  detected_level TEXT CHECK(detected_level IN ('beginner', 'intermediate', 'advanced')),

  -- Analysis (JSON)
  answers_detail TEXT, -- JSON array of {question_id, answer, correct, topic}
  strengths TEXT,      -- JSON array of topic strengths
  knowledge_gaps TEXT, -- JSON array of topics to improve

  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_assessments_user ON assessments(user_id);
CREATE INDEX idx_assessments_date ON assessments(completed_at);


-- ============================================
-- LEARNING PROGRESS
-- ============================================

CREATE TABLE lessons (
  id TEXT PRIMARY KEY,
  day INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  duration_minutes INTEGER,
  difficulty TEXT CHECK(difficulty IN ('beginner', 'intermediate', 'advanced')),
  topics TEXT, -- JSON array of topics covered
  quiz_questions INTEGER DEFAULT 0
);

CREATE TABLE user_lesson_progress (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  lesson_id TEXT NOT NULL,

  -- Progress
  status TEXT CHECK(status IN ('locked', 'in_progress', 'completed')) DEFAULT 'locked',
  started_at DATETIME,
  completed_at DATETIME,
  time_spent_seconds INTEGER DEFAULT 0,

  -- Performance
  quiz_score REAL,
  quiz_attempts INTEGER DEFAULT 0,
  complexity_level_used TEXT, -- Which level they studied (eli5, beginner, advanced)

  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (lesson_id) REFERENCES lessons(id) ON DELETE CASCADE,
  UNIQUE(user_id, lesson_id)
);

CREATE INDEX idx_progress_user ON user_lesson_progress(user_id);
CREATE INDEX idx_progress_status ON user_lesson_progress(status);


-- ============================================
-- LEARNING STREAK & ENGAGEMENT
-- ============================================

CREATE TABLE learning_streaks (
  user_id TEXT PRIMARY KEY,
  current_streak_days INTEGER DEFAULT 0,
  longest_streak_days INTEGER DEFAULT 0,
  last_activity_date DATE,
  total_learning_minutes INTEGER DEFAULT 0,

  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);


-- ============================================
-- AI INTERACTION HISTORY (for personalization)
-- ============================================

CREATE TABLE concept_queries (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  queried_at DATETIME DEFAULT CURRENT_TIMESTAMP,

  -- Query details
  query_text TEXT NOT NULL,
  topic TEXT, -- Extracted topic (e.g., "diversification", "P/E ratio")
  complexity_requested TEXT CHECK(complexity_requested IN ('eli5', 'beginner', 'advanced')),

  -- Context
  context_lesson_id TEXT, -- If asked during a lesson

  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (context_lesson_id) REFERENCES lessons(id) ON DELETE SET NULL
);

CREATE INDEX idx_queries_user ON concept_queries(user_id);
CREATE INDEX idx_queries_topic ON concept_queries(topic);
CREATE INDEX idx_queries_date ON concept_queries(queried_at);


CREATE TABLE news_insights (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  analyzed_at DATETIME DEFAULT CURRENT_TIMESTAMP,

  -- Input
  headline TEXT NOT NULL,
  ticker TEXT, -- Stock ticker if provided

  -- AI Output (cached)
  explanation TEXT,
  related_chunks TEXT, -- JSON array from backend

  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_insights_user ON news_insights(user_id);
CREATE INDEX idx_insights_ticker ON news_insights(ticker);


-- ============================================
-- PORTFOLIO SIMULATIONS (for tracking interests)
-- ============================================

CREATE TABLE simulations (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

  -- Allocation
  stocks_percentage INTEGER,
  bonds_percentage INTEGER,
  cash_percentage INTEGER,

  -- Results
  expected_return REAL,
  risk_level TEXT CHECK(risk_level IN ('low', 'medium', 'high')),

  -- User action
  saved BOOLEAN DEFAULT FALSE,

  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_simulations_user ON simulations(user_id);


-- ============================================
-- TOPIC PERFORMANCE (for AI personalization)
-- ============================================

CREATE TABLE topic_mastery (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  topic TEXT NOT NULL,

  -- Mastery metrics
  times_studied INTEGER DEFAULT 0,
  times_queried INTEGER DEFAULT 0,
  quiz_accuracy REAL DEFAULT 0.0, -- Average accuracy on this topic
  last_reviewed DATETIME,

  -- AI-derived insights
  mastery_level TEXT CHECK(mastery_level IN ('struggling', 'learning', 'proficient', 'mastered')) DEFAULT 'learning',
  needs_review BOOLEAN DEFAULT FALSE,

  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE(user_id, topic)
);

CREATE INDEX idx_mastery_user ON topic_mastery(user_id);
CREATE INDEX idx_mastery_needs_review ON topic_mastery(user_id, needs_review);


-- ============================================
-- VIEWS FOR AI CONTEXT
-- ============================================

-- User learning profile for AI personalization
CREATE VIEW user_learning_profile AS
SELECT
  u.id AS user_id,
  u.name,
  u.skill_level,
  u.complexity_preference,
  ls.current_streak_days,
  ls.total_learning_minutes,
  COUNT(DISTINCT ulp.lesson_id) FILTER (WHERE ulp.status = 'completed') AS lessons_completed,
  AVG(ulp.quiz_score) AS avg_quiz_score,
  (SELECT topic FROM topic_mastery tm WHERE tm.user_id = u.id AND tm.needs_review = TRUE LIMIT 3) AS topics_needing_review
FROM users u
LEFT JOIN learning_streaks ls ON u.id = ls.user_id
LEFT JOIN user_lesson_progress ulp ON u.id = ulp.user_id
GROUP BY u.id;


-- Recent activity for contextual AI responses
CREATE VIEW user_recent_activity AS
SELECT
  user_id,
  'query' AS activity_type,
  query_text AS content,
  topic,
  queried_at AS timestamp
FROM concept_queries
UNION ALL
SELECT
  user_id,
  'insight' AS activity_type,
  headline AS content,
  ticker AS topic,
  analyzed_at AS timestamp
FROM news_insights
ORDER BY timestamp DESC;
