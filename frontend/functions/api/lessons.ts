/**
 * Cloudflare Pages Function: Lessons API
 *
 * GET /api/lessons              - Get all lessons
 * GET /api/lessons?userId=xxx   - Get lessons with user progress
 * GET /api/lessons?lessonId=xxx - Get specific lesson
 */

interface Env {
  DB: D1Database
}

interface Lesson {
  id: string
  day: number
  title: string
  description: string
  duration_minutes: number
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  topics: string[] // Parsed from JSON
  quiz_questions: number
  status?: 'locked' | 'in_progress' | 'completed'
  quiz_score?: number
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const { searchParams } = new URL(context.request.url)
  const userId = searchParams.get('userId')
  const lessonId = searchParams.get('lessonId')

  try {
    // Get specific lesson
    if (lessonId) {
      const { results } = await context.env.DB.prepare(
        'SELECT * FROM lessons WHERE id = ?'
      )
        .bind(lessonId)
        .all()

      if (results.length === 0) {
        return new Response(JSON.stringify({ error: 'Lesson not found' }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        })
      }

      const lesson = results[0] as any
      lesson.topics = JSON.parse(lesson.topics || '[]')

      return new Response(JSON.stringify(lesson), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // Get all lessons with optional user progress
    let query = 'SELECT * FROM lessons ORDER BY day ASC'
    let lessons: any[]

    if (userId) {
      // Join with user progress
      const { results } = await context.env.DB.prepare(
        `SELECT
          l.*,
          ulp.status,
          ulp.quiz_score,
          ulp.completed_at
         FROM lessons l
         LEFT JOIN user_lesson_progress ulp ON l.id = ulp.lesson_id AND ulp.user_id = ?
         ORDER BY l.day ASC`
      )
        .bind(userId)
        .all()

      lessons = results
    } else {
      const { results } = await context.env.DB.prepare(query).all()
      lessons = results
    }

    // Parse JSON topics field
    const formattedLessons = lessons.map((lesson: any) => ({
      ...lesson,
      topics: JSON.parse(lesson.topics || '[]'),
      status: lesson.status || 'locked',
    }))

    return new Response(JSON.stringify(formattedLessons), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Database error:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to fetch lessons' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  }
}

// POST: Update lesson progress
export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const body = await context.request.json()
    const { userId, lessonId, status, quizScore } = body

    if (!userId || !lessonId) {
      return new Response(
        JSON.stringify({ error: 'userId and lessonId are required' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      )
    }

    const progressId = `prog_${userId}_${lessonId}`

    if (status === 'completed') {
      // Mark lesson as completed
      await context.env.DB.prepare(
        `INSERT INTO user_lesson_progress (id, user_id, lesson_id, status, started_at, completed_at, quiz_score)
         VALUES (?, ?, ?, 'completed', datetime('now'), datetime('now'), ?)
         ON CONFLICT(user_id, lesson_id) DO UPDATE SET
           status = 'completed',
           completed_at = datetime('now'),
           quiz_score = excluded.quiz_score`
      )
        .bind(progressId, userId, lessonId, quizScore || null)
        .run()
    } else if (status === 'in_progress') {
      // Mark lesson as in progress
      await context.env.DB.prepare(
        `INSERT INTO user_lesson_progress (id, user_id, lesson_id, status, started_at)
         VALUES (?, ?, ?, 'in_progress', datetime('now'))
         ON CONFLICT(user_id, lesson_id) DO UPDATE SET
           status = 'in_progress',
           started_at = datetime('now')`
      )
        .bind(progressId, userId, lessonId)
        .run()
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Progress updated' }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  } catch (error) {
    console.error('Database error:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to update progress' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  }
}
