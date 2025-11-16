/**
 * Cloudflare Pages Function: Start Adaptive Assessment
 *
 * POST /api/assessment-adaptive/start
 *
 * Starts a new adaptive quiz session and returns the first question
 */

interface Env {
  DB: D1Database
}

interface StartRequest {
  userId: string
}

interface Question {
  id: string
  question: string
  options: string[]
  difficulty: number
}

interface StartResponse {
  sessionId: string
  question: Question
  questionNumber: number
  currentLevel: number
}

/**
 * Select next question based on current level and asked questions
 */
async function selectNextQuestion(
  db: D1Database,
  currentLevel: number,
  askedIds: string[]
): Promise<Question | null> {
  // Calculate target difficulty (1, 2, or 3)
  const targetDifficulty = Math.max(1, Math.min(3, Math.round(currentLevel)))

  // Try to find a question matching target difficulty that hasn't been asked
  let query = `
    SELECT id, difficulty_score as difficulty, text, options
    FROM questions
    WHERE difficulty_score = ?
      AND id NOT IN (${askedIds.length > 0 ? askedIds.map(() => '?').join(',') : 'NULL'})
    ORDER BY RANDOM()
    LIMIT 1
  `

  let bindings = [targetDifficulty, ...askedIds]

  let { results } = await db.prepare(query).bind(...bindings).all()

  // If no questions found at target difficulty, try any difficulty
  if (results.length === 0) {
    query = `
      SELECT id, difficulty_score as difficulty, text, options
      FROM questions
      WHERE id NOT IN (${askedIds.length > 0 ? askedIds.map(() => '?').join(',') : 'NULL'})
      ORDER BY RANDOM()
      LIMIT 1
    `
    bindings = askedIds

    const fallback = await db.prepare(query).bind(...bindings).all()
    results = fallback.results
  }

  if (results.length === 0) {
    return null // No more questions available
  }

  const row = results[0] as any

  // Parse options from JSON string
  const optionsData = JSON.parse(row.options)

  // Convert to array of strings (handle both formats)
  let optionsArray: string[]
  if (Array.isArray(optionsData)) {
    if (typeof optionsData[0] === 'string') {
      optionsArray = optionsData
    } else if (optionsData[0]?.value) {
      optionsArray = optionsData.map((opt: any) => opt.value)
    } else {
      optionsArray = optionsData
    }
  } else {
    optionsArray = []
  }

  return {
    id: row.id,
    question: row.text,
    options: optionsArray,
    difficulty: row.difficulty,
  }
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const body: StartRequest = await context.request.json()
    const { userId } = body

    if (!userId) {
      return new Response(JSON.stringify({ error: 'userId is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // Check if user already has an active session
    const { results: existingSessions } = await context.env.DB.prepare(
      'SELECT id FROM quiz_sessions WHERE user_id = ? AND completed = FALSE ORDER BY started_at DESC LIMIT 1'
    )
      .bind(userId)
      .all()

    // If active session exists, delete it (start fresh)
    if (existingSessions.length > 0) {
      const oldSessionId = (existingSessions[0] as any).id
      await context.env.DB.prepare('DELETE FROM quiz_sessions WHERE id = ?')
        .bind(oldSessionId)
        .run()
    }

    // Create new quiz session
    const sessionId = `session_${userId}_${Date.now()}`
    const initialLevel = 1.5 // Start at beginner-intermediate level

    await context.env.DB.prepare(
      `INSERT INTO quiz_sessions (id, user_id, current_level, asked_question_ids, question_count, started_at, last_updated, completed)
       VALUES (?, ?, ?, ?, ?, datetime('now'), datetime('now'), FALSE)`
    )
      .bind(sessionId, userId, initialLevel, '[]', 0)
      .run()

    // Get first question
    const firstQuestion = await selectNextQuestion(context.env.DB, initialLevel, [])

    if (!firstQuestion) {
      return new Response(
        JSON.stringify({ error: 'No questions available' }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
      )
    }

    // Update session with first question
    await context.env.DB.prepare(
      `UPDATE quiz_sessions
       SET asked_question_ids = ?, question_count = 1, last_updated = datetime('now')
       WHERE id = ?`
    )
      .bind(JSON.stringify([firstQuestion.id]), sessionId)
      .run()

    const response: StartResponse = {
      sessionId,
      question: firstQuestion,
      questionNumber: 1,
      currentLevel: initialLevel,
    }

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Start quiz error:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to start quiz' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  }
}
