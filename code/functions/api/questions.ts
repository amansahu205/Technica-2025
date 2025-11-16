/**
 * Cloudflare Pages Function: Questions API
 *
 * GET /api/questions                    - Get random assessment questions
 * GET /api/questions?difficulty=1       - Filter by difficulty (1, 2, or 3)
 * GET /api/questions?count=10           - Limit number of questions
 */

interface Env {
  DB: D1Database
}

interface Question {
  id: string
  difficultyScore: number
  text: string
  options: Array<{ key: string; value: string }>
  correctAnswer?: string // Omitted in response for security
  explanation?: string // Omitted until answer submitted
}


export const onRequestGet: PagesFunction<Env> = async (context) => {
  const { searchParams } = new URL(context.request.url)
  const difficulty = searchParams.get('difficulty')
  const count = parseInt(searchParams.get('count') || '10', 10)

  try {
    // Query questions from D1 database
    let query = 'SELECT id, difficulty_score, text, options, correct_answer, explanation FROM questions'
    const params: any[] = []

    // Filter by difficulty if specified
    if (difficulty) {
      const difficultyNum = parseInt(difficulty, 10)
      query += ' WHERE difficulty_score = ?'
      params.push(difficultyNum)
    }

    query += ' ORDER BY RANDOM()'

    const result = await context.env.DB.prepare(query).bind(...params).all()

    if (!result.success) {
      throw new Error('Database query failed')
    }

    // Parse JSON fields and transform to match expected format
    const questions = result.results.map((row: any) => ({
      id: row.id,
      difficultyScore: row.difficulty_score,
      text: row.text,
      options: JSON.parse(row.options),
      correctAnswer: row.correct_answer,
      explanation: row.explanation,
    }))

    // Limit number of questions
    const limitedQuestions = questions.slice(0, count)

    // Remove correct answers and explanations from response
    const safeQuestions = limitedQuestions.map(({ correctAnswer, explanation, ...q }) => q)

    return new Response(JSON.stringify(safeQuestions), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Questions error:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to fetch questions' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  }
}
