-- Schema for Adaptive Assessment System
-- Add this to your D1 database for adaptive quiz functionality

-- ============================================
-- QUIZ SESSIONS (Adaptive Assessment State)
-- ============================================

CREATE TABLE quiz_sessions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,

  -- Adaptive algorithm state
  current_level REAL DEFAULT 1.5, -- User's current skill level (1.0 to 3.0)
  asked_question_ids TEXT, -- JSON array of already asked question IDs
  question_count INTEGER DEFAULT 0, -- Number of questions answered so far

  -- Session metadata
  started_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  last_updated DATETIME DEFAULT CURRENT_TIMESTAMP,
  completed BOOLEAN DEFAULT FALSE,

  -- Final results (populated when completed)
  final_score REAL,
  final_tier TEXT CHECK(final_tier IN ('Beginner', 'Intermediate', 'Advanced')),

  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_quiz_sessions_user ON quiz_sessions(user_id);
CREATE INDEX idx_quiz_sessions_completed ON quiz_sessions(completed);


-- ============================================
-- QUIZ ANSWERS (Per-Session Answer Tracking)
-- ============================================

CREATE TABLE quiz_answers (
  id TEXT PRIMARY KEY,
  session_id TEXT NOT NULL,
  question_id TEXT NOT NULL,

  -- Answer data
  user_answer TEXT NOT NULL, -- 'A', 'B', 'C', or 'D'
  is_correct BOOLEAN NOT NULL,
  question_difficulty INTEGER NOT NULL, -- 1, 2, or 3

  -- Level tracking
  level_before REAL NOT NULL, -- User's level before this question
  level_after REAL NOT NULL,  -- User's level after this question
  level_change REAL NOT NULL, -- How much level changed

  -- Timing
  answered_at DATETIME DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (session_id) REFERENCES quiz_sessions(id) ON DELETE CASCADE,
  FOREIGN KEY (question_id) REFERENCES questions(id)
);

CREATE INDEX idx_quiz_answers_session ON quiz_answers(session_id);
CREATE INDEX idx_quiz_answers_question ON quiz_answers(question_id);


-- ============================================
-- VIEWS FOR ANALYTICS
-- ============================================

-- Get user's quiz history
CREATE VIEW user_quiz_history AS
SELECT
  qs.user_id,
  qs.id AS session_id,
  qs.started_at,
  qs.final_score,
  qs.final_tier,
  qs.question_count,
  COUNT(qa.id) AS answers_recorded
FROM quiz_sessions qs
LEFT JOIN quiz_answers qa ON qs.id = qa.session_id
WHERE qs.completed = TRUE
GROUP BY qs.id
ORDER BY qs.started_at DESC;


-- Get progression within a quiz
CREATE VIEW quiz_progression AS
SELECT
  qa.session_id,
  qa.question_id,
  qa.is_correct,
  qa.question_difficulty,
  qa.level_before,
  qa.level_after,
  qa.level_change,
  qa.answered_at
FROM quiz_answers qa
ORDER BY qa.answered_at ASC;


-- ============================================
-- HELPER FUNCTIONS (SQL)
-- ============================================

-- Get active (incomplete) session for user
-- Usage: SELECT * FROM get_active_session WHERE user_id = 'user123'
CREATE VIEW get_active_session AS
SELECT *
FROM quiz_sessions
WHERE completed = FALSE
ORDER BY started_at DESC;
