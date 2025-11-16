-- Additional schema for question bank and detailed answer tracking
-- Add this to your existing D1 database for personalization

-- ============================================
-- QUESTION BANK
-- ============================================

CREATE TABLE questions (
  id TEXT PRIMARY KEY,
  difficulty_score INTEGER NOT NULL CHECK(difficulty_score IN (1, 2, 3)),
  text TEXT NOT NULL,
  options TEXT NOT NULL, -- JSON array: [{"key":"A","value":"..."},...]
  correct_answer TEXT NOT NULL, -- 'A', 'B', 'C', or 'D'
  explanation TEXT,

  -- For personalization
  topics TEXT, -- JSON array: ["diversification", "risk-management"]
  concept TEXT, -- Main concept: "diversification", "P/E ratio", etc.

  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_questions_difficulty ON questions(difficulty_score);
CREATE INDEX idx_questions_concept ON questions(concept);


-- ============================================
-- USER ANSWER TRACKING (For Personalization)
-- ============================================

CREATE TABLE user_question_answers (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  question_id TEXT NOT NULL,
  assessment_id TEXT, -- Link to assessment session

  -- Answer data
  user_answer TEXT NOT NULL, -- 'A', 'B', 'C', or 'D'
  is_correct BOOLEAN NOT NULL,
  time_taken_seconds INTEGER,
  answered_at DATETIME DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE,
  FOREIGN KEY (assessment_id) REFERENCES assessments(id) ON DELETE SET NULL
);

CREATE INDEX idx_user_answers_user ON user_question_answers(user_id);
CREATE INDEX idx_user_answers_question ON user_question_answers(question_id);
CREATE INDEX idx_user_answers_correct ON user_question_answers(user_id, is_correct);


-- ============================================
-- VIEWS FOR PERSONALIZATION
-- ============================================

-- Get topics user struggles with
CREATE VIEW user_weak_topics AS
SELECT
  uqa.user_id,
  q.concept AS topic,
  COUNT(*) AS times_attempted,
  SUM(CASE WHEN uqa.is_correct THEN 1 ELSE 0 END) AS times_correct,
  ROUND(100.0 * SUM(CASE WHEN uqa.is_correct THEN 1 ELSE 0 END) / COUNT(*), 2) AS accuracy_percentage
FROM user_question_answers uqa
JOIN questions q ON uqa.question_id = q.id
GROUP BY uqa.user_id, q.concept
HAVING accuracy_percentage < 70
ORDER BY accuracy_percentage ASC;


-- Get questions user hasn't seen yet
CREATE VIEW user_unanswered_questions AS
SELECT
  u.id AS user_id,
  q.id AS question_id,
  q.difficulty_score,
  q.concept,
  q.text
FROM users u
CROSS JOIN questions q
WHERE NOT EXISTS (
  SELECT 1
  FROM user_question_answers uqa
  WHERE uqa.user_id = u.id
    AND uqa.question_id = q.id
);


-- Get user's question performance summary
CREATE VIEW user_question_stats AS
SELECT
  user_id,
  COUNT(*) AS total_questions_answered,
  SUM(CASE WHEN is_correct THEN 1 ELSE 0 END) AS correct_answers,
  ROUND(100.0 * SUM(CASE WHEN is_correct THEN 1 ELSE 0 END) / COUNT(*), 2) AS overall_accuracy,
  AVG(time_taken_seconds) AS avg_time_per_question
FROM user_question_answers
GROUP BY user_id;
