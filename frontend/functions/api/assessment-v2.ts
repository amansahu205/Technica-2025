/**
 * Cloudflare Pages Function: Enhanced Assessment API with Personalization
 *
 * POST /api/assessment-v2 - Submit assessment with individual question tracking
 *
 * This version stores:
 * - Overall assessment result
 * - Individual question answers (for personalization)
 * - Updates topic_mastery based on performance
 */

interface Env {
  DB: D1Database
}

interface QuestionAnswer {
  questionId: string
  userAnswer: string // 'A', 'B', 'C', 'D'
  isCorrect: boolean
  timeTaken?: number
}

interface AssessmentRequestV2 {
  userId: string
  answers: QuestionAnswer[] // Enhanced format with question IDs
}

interface AssessmentResponse {
  profile: 'beginner' | 'intermediate' | 'advanced'
  score: number
  totalQuestions: number
  correctAnswers: number
  assessmentId: string
  weakTopics: string[]
  strongTopics: string[]
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
    const body: AssessmentRequestV2 = await context.request.json()
    const { userId, answers } = body

    if (!userId || !answers || !Array.isArray(answers)) {
      return new Response(
        JSON.stringify({ error: 'userId and answers array are required' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      )
    }

    const totalQuestions = answers.length
    const correctAnswers = answers.filter((a) => a.isCorrect).length
    const percentage = (correctAnswers / totalQuestions) * 100
    const detectedLevel = calculateSkillLevel(correctAnswers, totalQuestions)

    const assessmentId = `assess_${userId}_${Date.now()}`

    // 1. Store overall assessment result
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

    // 2. Store individual question answers for personalization
    const topicPerformance = new Map<string, { correct: number; total: number }>()

    for (const answer of answers) {
      const answerId = `ans_${userId}_${answer.questionId}_${Date.now()}`

      // Save individual answer
      await context.env.DB.prepare(
        `INSERT INTO user_question_answers (id, user_id, question_id, assessment_id, user_answer, is_correct, time_taken_seconds, answered_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'))`
      )
        .bind(
          answerId,
          userId,
          answer.questionId,
          assessmentId,
          answer.userAnswer,
          answer.isCorrect ? 1 : 0,
          answer.timeTaken || null
        )
        .run()

      // Get question topic for topic_mastery update
      const { results: questionData } = await context.env.DB.prepare(
        'SELECT concept FROM questions WHERE id = ?'
      )
        .bind(answer.questionId)
        .all()

      if (questionData.length > 0) {
        const topic = (questionData[0] as any).concept
        if (!topicPerformance.has(topic)) {
          topicPerformance.set(topic, { correct: 0, total: 0 })
        }
        const perf = topicPerformance.get(topic)!
        perf.total++
        if (answer.isCorrect) perf.correct++
      }
    }

    // 3. Update topic_mastery for each topic
    for (const [topic, perf] of topicPerformance.entries()) {
      const accuracy = (perf.correct / perf.total) * 100
      const masteryLevel =
        accuracy >= 80
          ? 'mastered'
          : accuracy >= 60
          ? 'proficient'
          : accuracy >= 40
          ? 'learning'
          : 'struggling'
      const needsReview = accuracy < 70

      const masteryId = `mastery_${userId}_${topic}`

      await context.env.DB.prepare(
        `INSERT INTO topic_mastery (id, user_id, topic, times_studied, quiz_accuracy, mastery_level, needs_review, last_reviewed)
         VALUES (?, ?, ?, 1, ?, ?, ?, datetime('now'))
         ON CONFLICT(user_id, topic) DO UPDATE SET
           times_studied = times_studied + 1,
           quiz_accuracy = (quiz_accuracy * (times_studied - 1) + excluded.quiz_accuracy) / times_studied,
           mastery_level = excluded.mastery_level,
           needs_review = excluded.needs_review,
           last_reviewed = datetime('now')`
      )
        .bind(masteryId, userId, topic, accuracy, masteryLevel, needsReview ? 1 : 0)
        .run()
    }

    // 4. Update user's skill level
    await context.env.DB.prepare(
      `UPDATE users SET skill_level = ?, last_active = datetime('now') WHERE id = ?`
    )
      .bind(detectedLevel, userId)
      .run()

    // 5. Get weak and strong topics
    const weakTopics = Array.from(topicPerformance.entries())
      .filter(([_, perf]) => (perf.correct / perf.total) * 100 < 60)
      .map(([topic]) => topic)

    const strongTopics = Array.from(topicPerformance.entries())
      .filter(([_, perf]) => (perf.correct / perf.total) * 100 >= 80)
      .map(([topic]) => topic)

    const response: AssessmentResponse = {
      profile: detectedLevel,
      score: percentage,
      totalQuestions,
      correctAnswers,
      assessmentId,
      weakTopics,
      strongTopics,
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
