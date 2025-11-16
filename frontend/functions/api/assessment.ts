/**
 * Cloudflare Pages Function: Assessment API
 *
 * POST /api/assessment - Submit assessment answers and get results
 */

interface Env {
  DB: D1Database
}

interface AssessmentRequest {
  userId?: string
  answers: string[] // Array of answer letters: ['a', 'b', 'c', ...]
}

interface AssessmentResponse {
  profile: 'beginner' | 'intermediate' | 'advanced'
  score: number
  totalQuestions: number
  correctAnswers: number
  assessmentId: string
}

// Load questions from the questions.json file
// In production, you'd query from D1 database instead
async function getQuestions() {
  // For now, return sample questions
  // TODO: Load from questions.json or D1 database
  return [
    { id: 'B1', correctAnswer: 'B', difficultyScore: 1 },
    { id: 'B2', correctAnswer: 'C', difficultyScore: 1 },
    { id: 'B3', correctAnswer: 'B', difficultyScore: 1 },
    { id: 'I1', correctAnswer: 'B', difficultyScore: 2 },
    { id: 'I2', correctAnswer: 'A', difficultyScore: 2 },
    { id: 'I3', correctAnswer: 'B', difficultyScore: 2 },
    { id: 'A1', correctAnswer: 'B', difficultyScore: 3 },
    { id: 'A2', correctAnswer: 'B', difficultyScore: 3 },
    { id: 'A3', correctAnswer: 'B', difficultyScore: 3 },
    { id: 'A4', correctAnswer: 'C', difficultyScore: 3 },
  ]
}

function calculateSkillLevel(
  correctAnswers: number,
  totalQuestions: number
): 'beginner' | 'intermediate' | 'advanced' {
  const percentage = (correctAnswers / totalQuestions) * 100

  if (percentage >= 70) return 'advanced'
  if (percentage >= 40) return 'intermediate'
  return 'beginner'
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const body: AssessmentRequest = await context.request.json()
    const { userId, answers } = body

    if (!answers || !Array.isArray(answers)) {
      return new Response(
        JSON.stringify({ error: 'answers array is required' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      )
    }

    // Get questions (later from database)
    const questions = await getQuestions()
    const totalQuestions = Math.min(answers.length, questions.length)

    // Calculate score
    let correctAnswers = 0
    for (let i = 0; i < totalQuestions; i++) {
      if (answers[i]?.toLowerCase() === questions[i].correctAnswer.toLowerCase()) {
        correctAnswers++
      }
    }

    const percentage = (correctAnswers / totalQuestions) * 100
    const detectedLevel = calculateSkillLevel(correctAnswers, totalQuestions)

    // Store assessment in database if userId provided
    const assessmentId = `assess_${Date.now()}`

    if (userId) {
      try {
        await context.env.DB.prepare(
          `INSERT INTO assessments (id, user_id, total_questions, correct_answers, score_percentage, detected_level, completed_at)
           VALUES (?, ?, ?, ?, ?, ?, datetime('now'))`
        )
          .bind(
            assessmentId,
            userId,
            totalQuestions,
            correctAnswers,
            percentage,
            detectedLevel
          )
          .run()

        // Update user's skill level
        await context.env.DB.prepare(
          `UPDATE users SET skill_level = ?, last_active = datetime('now') WHERE id = ?`
        )
          .bind(detectedLevel, userId)
          .run()
      } catch (dbError) {
        console.error('Failed to save assessment to database:', dbError)
        // Continue anyway - don't fail the request
      }
    }

    const response: AssessmentResponse = {
      profile: detectedLevel,
      score: percentage,
      totalQuestions,
      correctAnswers,
      assessmentId,
    }

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Assessment error:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to process assessment' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  }
}
