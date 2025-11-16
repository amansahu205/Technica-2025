/**
 * Cloudflare Pages Function: Submit Answer to Adaptive Assessment
 *
 * POST /api/assessment-adaptive/answer
 *
 * Submits an answer, updates adaptive level, and returns next question or final results
 */

interface Env {
  DB: D1Database
}

interface AnswerRequest {
  sessionId: string
  questionId: string
  userAnswer: string // 'A', 'B', 'C', 'D'
}

interface Question {
  id: string
  difficultyScore: number
  text: string
  options: Array<{ key: string; value: string }>
}

interface AnswerResponse {
  quizComplete: boolean
  correctAnswer: string
  explanation: string
  isCorrect: boolean

  // If quiz continues
  nextQuestion?: Question
  questionNumber?: number
  currentLevel?: number
  levelChange?: number

  // If quiz complete
  finalScore?: number
  finalTier?: string
  progression?: Array<{
    questionNumber: number
    level: number
    difficulty: number
    correct: boolean
  }>
}

/**
 * Calculate level change based on difficulty and correctness
 * Same logic as Flask app
 */
function calculateLevelChange(questionDifficulty: number, isCorrect: boolean): number {
  if (isCorrect) {
    // Correct: gain points based on difficulty
    return 0.2 * questionDifficulty
  } else {
    // Wrong: lose points (harder questions lose less)
    return -(0.2 * (4 - questionDifficulty))
  }
}

/**
 * Get tier from final score
 */
function getTierFromScore(finalScore: number): string {
  if (finalScore <= 1.66) return 'Beginner'
  if (finalScore <= 2.33) return 'Intermediate'
  return 'Advanced'
}

/**
 * Select next question based on current level
 */
async function selectNextQuestion(
  db: D1Database,
  currentLevel: number,
  askedIds: string[]
): Promise<Question | null> {
  const targetDifficulty = Math.max(1, Math.min(3, Math.round(currentLevel)))

  let query = `
    SELECT id, difficulty_score as difficultyScore, text, options
    FROM questions
    WHERE difficulty_score = ?
      AND id NOT IN (${askedIds.length > 0 ? askedIds.map(() => '?').join(',') : 'NULL'})
    ORDER BY RANDOM()
    LIMIT 1
  `
  let bindings = [targetDifficulty, ...askedIds]
  let { results } = await db.prepare(query).bind(...bindings).all()

  if (results.length === 0) {
    query = `
      SELECT id, difficulty_score as difficultyScore, text, options
      FROM questions
      WHERE id NOT IN (${askedIds.length > 0 ? askedIds.map(() => '?').join(',') : 'NULL'})
      ORDER BY RANDOM()
      LIMIT 1
    `
    bindings = askedIds
    const fallback = await db.prepare(query).bind(...bindings).all()
    results = fallback.results
  }

  if (results.length === 0) return null

  const question = results[0] as any
  return {
    id: question.id,
    difficultyScore: question.difficultyScore,
    text: question.text,
    options: JSON.parse(question.options),
  }
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const body: AnswerRequest = await context.request.json()
    const { sessionId, questionId, userAnswer } = body

    if (!sessionId || !questionId || !userAnswer) {
      return new Response(
        JSON.stringify({ error: 'sessionId, questionId, and userAnswer are required' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      )
    }

    // Get current session state
    const { results: sessions } = await context.env.DB.prepare(
      'SELECT * FROM quiz_sessions WHERE id = ?'
    )
      .bind(sessionId)
      .all()

    if (sessions.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Session not found or expired' }),
        {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        }
      )
    }

    const session = sessions[0] as any
    const currentLevel = session.current_level
    const askedIds: string[] = JSON.parse(session.asked_question_ids || '[]')
    const questionCount = session.question_count

    // Get the question to check correctness
    const { results: questions } = await context.env.DB.prepare(
      'SELECT * FROM questions WHERE id = ?'
    )
      .bind(questionId)
      .all()

    if (questions.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Question not found' }),
        {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        }
      )
    }

    const question = questions[0] as any
    const correctAnswer = question.correct_answer
    const explanation = question.explanation
    const difficulty = question.difficulty_score
    const isCorrect = userAnswer.toUpperCase() === correctAnswer.toUpperCase()

    // Calculate level change using adaptive algorithm
    const levelChange = calculateLevelChange(difficulty, isCorrect)
    let newLevel = currentLevel + levelChange
    newLevel = Math.max(1.0, Math.min(3.0, newLevel)) // Clamp between 1 and 3

    // Save this answer to quiz_answers table
    const answerId = `ans_${sessionId}_${questionId}`
    await context.env.DB.prepare(
      `INSERT INTO quiz_answers (id, session_id, question_id, user_answer, is_correct, question_difficulty, level_before, level_after, level_change, answered_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))`
    )
      .bind(
        answerId,
        sessionId,
        questionId,
        userAnswer,
        isCorrect ? 1 : 0,
        difficulty,
        currentLevel,
        newLevel,
        levelChange
      )
      .run()

    // Also save to user_question_answers for personalization (if table exists)
    try {
      const userAnswerId = `uans_${session.user_id}_${questionId}_${Date.now()}`
      await context.env.DB.prepare(
        `INSERT INTO user_question_answers (id, user_id, question_id, assessment_id, user_answer, is_correct, answered_at)
         VALUES (?, ?, ?, ?, ?, ?, datetime('now'))`
      )
        .bind(
          userAnswerId,
          session.user_id,
          questionId,
          sessionId,
          userAnswer,
          isCorrect ? 1 : 0
        )
        .run()
    } catch (e) {
      // Table might not exist yet, ignore
      console.log('user_question_answers table not found, skipping')
    }

    // Check if quiz is complete (10 questions)
    if (questionCount >= 10) {
      // Quiz complete!
      const finalScore = Math.round(newLevel * 100) / 100
      const finalTier = getTierFromScore(finalScore)

      // Update session as completed
      await context.env.DB.prepare(
        `UPDATE quiz_sessions
         SET completed = TRUE, final_score = ?, final_tier = ?, current_level = ?, last_updated = datetime('now')
         WHERE id = ?`
      )
        .bind(finalScore, finalTier, newLevel, sessionId)
        .run()

      // Update user's skill level in users table
      await context.env.DB.prepare(
        `UPDATE users SET skill_level = ?, last_active = datetime('now') WHERE id = ?`
      )
        .bind(finalTier.toLowerCase(), session.user_id)
        .run()

      // Get progression data
      const { results: progressionData } = await context.env.DB.prepare(
        'SELECT * FROM quiz_answers WHERE session_id = ? ORDER BY answered_at ASC'
      )
        .bind(sessionId)
        .all()

      const progression = progressionData.map((ans: any, index: number) => ({
        questionNumber: index + 1,
        level: ans.level_after,
        difficulty: ans.question_difficulty,
        correct: ans.is_correct === 1,
      }))

      const response: AnswerResponse = {
        quizComplete: true,
        correctAnswer,
        explanation,
        isCorrect,
        finalScore,
        finalTier,
        progression,
      }

      return new Response(JSON.stringify(response), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // Quiz not complete - get next question
    const nextQuestion = await selectNextQuestion(context.env.DB, newLevel, askedIds)

    if (!nextQuestion) {
      return new Response(
        JSON.stringify({ error: 'No more questions available' }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
      )
    }

    // Update session with new question
    const updatedAskedIds = [...askedIds, nextQuestion.id]
    await context.env.DB.prepare(
      `UPDATE quiz_sessions
       SET current_level = ?, asked_question_ids = ?, question_count = ?, last_updated = datetime('now')
       WHERE id = ?`
    )
      .bind(
        newLevel,
        JSON.stringify(updatedAskedIds),
        questionCount + 1,
        sessionId
      )
      .run()

    const response: AnswerResponse = {
      quizComplete: false,
      correctAnswer,
      explanation,
      isCorrect,
      nextQuestion,
      questionNumber: questionCount + 1,
      currentLevel: newLevel,
      levelChange,
    }

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Answer submission error:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to process answer' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  }
}
