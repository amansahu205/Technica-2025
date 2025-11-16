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
  questionIds: string[] // Array of question IDs that were asked
  answers: string[] // Array of answer letters: ['A', 'B', 'C', ...]
}

interface AssessmentResponse {
  profile: 'beginner' | 'intermediate' | 'advanced'
  score: number
  totalQuestions: number
  correctAnswers: number
  assessmentId: string
}

// Load questions from D1 database
async function getQuestions(db: D1Database, questionIds: string[]) {
  if (!questionIds || questionIds.length === 0) {
    return []
  }

  // Build parameterized query for the specific question IDs
  const placeholders = questionIds.map(() => '?').join(',')
  const query = `SELECT id, correct_answer, difficulty_score FROM questions WHERE id IN (${placeholders})`

  const result = await db.prepare(query).bind(...questionIds).all()

  if (!result.success) {
    throw new Error('Failed to query questions from database')
  }

  // Return questions in the same order as questionIds
  return questionIds.map((id) => {
    const question = result.results.find((q: any) => q.id === id)
    if (!question) {
      throw new Error(`Question ${id} not found in database`)
    }
    return {
      id: question.id,
      correctAnswer: question.correct_answer,
      difficultyScore: question.difficulty_score,
    }
  })
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
    const { userId, questionIds, answers } = body

    if (!answers || !Array.isArray(answers)) {
      return new Response(
        JSON.stringify({ error: 'answers array is required' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      )
    }

    if (!questionIds || !Array.isArray(questionIds)) {
      return new Response(
        JSON.stringify({ error: 'questionIds array is required' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      )
    }

    if (questionIds.length !== answers.length) {
      return new Response(
        JSON.stringify({ error: 'questionIds and answers arrays must have the same length' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      )
    }

    // Get questions from database
    const questions = await getQuestions(context.env.DB, questionIds)
    const totalQuestions = questions.length

    // Calculate score and track individual answers
    let correctAnswers = 0
    const answersDetail: any[] = []

    for (let i = 0; i < totalQuestions; i++) {
      const isCorrect = answers[i]?.toUpperCase() === questions[i].correctAnswer.toUpperCase()
      if (isCorrect) {
        correctAnswers++
      }

      answersDetail.push({
        questionId: questions[i].id,
        userAnswer: answers[i],
        correctAnswer: questions[i].correctAnswer,
        isCorrect,
        difficultyScore: questions[i].difficultyScore,
      })
    }

    const percentage = (correctAnswers / totalQuestions) * 100
    const detectedLevel = calculateSkillLevel(correctAnswers, totalQuestions)

    // Store assessment in database if userId provided
    const assessmentId = `assess_${Date.now()}`

    if (userId) {
      try {
        // Insert assessment record
        await context.env.DB.prepare(
          `INSERT INTO assessments (id, user_id, total_questions, correct_answers, score_percentage, detected_level, answers_detail, completed_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'))`
        )
          .bind(
            assessmentId,
            userId,
            totalQuestions,
            correctAnswers,
            percentage,
            detectedLevel,
            JSON.stringify(answersDetail)
          )
          .run()

        // Save individual answers to user_question_answers table
        for (const answer of answersDetail) {
          await context.env.DB.prepare(
            `INSERT INTO user_question_answers (user_id, question_id, assessment_id, user_answer, is_correct, answered_at)
             VALUES (?, ?, ?, ?, ?, datetime('now'))`
          )
            .bind(
              userId,
              answer.questionId,
              assessmentId,
              answer.userAnswer,
              answer.isCorrect ? 1 : 0
            )
            .run()
        }

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
