/**
 * Cloudflare Pages Function: Curriculum API
 *
 * GET /api/curriculum - Get full curriculum with modules and lessons
 * GET /api/curriculum?userId=xxx - Get curriculum with user progress
 * GET /api/curriculum?module=1 - Get specific module
 */

interface Env {
  DB: D1Database
}

interface Lesson {
  id: string
  day: number
  moduleNumber: number
  moduleTitle: string
  moduleDescription: string
  title: string
  description: string
  durationMinutes: number
  difficulty: string
  topics: string[]
  quizQuestions: number
  // User progress (if userId provided)
  status?: 'locked' | 'in_progress' | 'completed'
  quizScore?: number
  completedAt?: string
}

interface Module {
  number: number
  title: string
  description: string
  lessons: Lesson[]
  progress?: {
    totalLessons: number
    completedLessons: number
    percentComplete: number
  }
}

interface CurriculumResponse {
  modules: Module[]
  totalLessons: number
  userProgress?: {
    overallProgress: number
    completedLessons: number
    currentLesson?: Lesson
  }
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const { searchParams } = new URL(context.request.url)
  const userId = searchParams.get('userId')
  const moduleFilter = searchParams.get('module')

  try {
    // Build base query for lessons
    let lessonsQuery = `
      SELECT
        id, day, module_number, module_title, module_description,
        title, description, duration_minutes, difficulty, topics, quiz_questions
      FROM lessons
    `

    const queryParams: any[] = []

    // Filter by specific module if requested
    if (moduleFilter) {
      lessonsQuery += ' WHERE module_number = ?'
      queryParams.push(parseInt(moduleFilter, 10))
    }

    lessonsQuery += ' ORDER BY module_number, day'

    const lessonsResult = await context.env.DB.prepare(lessonsQuery)
      .bind(...queryParams)
      .all()

    if (!lessonsResult.success) {
      throw new Error('Failed to query lessons')
    }

    // Get user progress if userId provided
    let userProgressMap = new Map<string, any>()
    if (userId) {
      const progressQuery = `
        SELECT lesson_id, status, quiz_score, completed_at
        FROM user_lesson_progress
        WHERE user_id = ?
      `
      const progressResult = await context.env.DB.prepare(progressQuery)
        .bind(userId)
        .all()

      if (progressResult.success) {
        progressResult.results.forEach((row: any) => {
          userProgressMap.set(row.lesson_id, {
            status: row.status,
            quizScore: row.quiz_score,
            completedAt: row.completed_at,
          })
        })
      }
    }

    // Transform and group lessons by module
    const modulesMap = new Map<number, Module>()

    lessonsResult.results.forEach((row: any) => {
      const lesson: Lesson = {
        id: row.id,
        day: row.day,
        moduleNumber: row.module_number || 0,
        moduleTitle: row.module_title || 'Uncategorized',
        moduleDescription: row.module_description || '',
        title: row.title,
        description: row.description,
        durationMinutes: row.duration_minutes,
        difficulty: row.difficulty,
        topics: row.topics ? JSON.parse(row.topics) : [],
        quizQuestions: row.quiz_questions || 0,
      }

      // Add user progress if available
      if (userProgressMap.has(lesson.id)) {
        const progress = userProgressMap.get(lesson.id)
        lesson.status = progress.status
        lesson.quizScore = progress.quizScore
        lesson.completedAt = progress.completedAt
      } else if (userId) {
        lesson.status = 'locked' // Default to locked if user has no progress
      }

      // Group by module
      const moduleNumber = lesson.moduleNumber
      if (!modulesMap.has(moduleNumber)) {
        modulesMap.set(moduleNumber, {
          number: moduleNumber,
          title: lesson.moduleTitle,
          description: lesson.moduleDescription,
          lessons: [],
        })
      }

      modulesMap.get(moduleNumber)!.lessons.push(lesson)
    })

    // Calculate module progress if user data exists
    if (userId) {
      modulesMap.forEach((module) => {
        const completedLessons = module.lessons.filter(
          (l) => l.status === 'completed'
        ).length
        module.progress = {
          totalLessons: module.lessons.length,
          completedLessons,
          percentComplete: Math.round(
            (completedLessons / module.lessons.length) * 100
          ),
        }
      })
    }

    // Convert map to sorted array
    const modules = Array.from(modulesMap.values()).sort(
      (a, b) => a.number - b.number
    )

    // Calculate overall user progress
    let userProgress
    if (userId) {
      const totalLessons = modules.reduce((sum, m) => sum + m.lessons.length, 0)
      const completedLessons = modules.reduce(
        (sum, m) => sum + (m.progress?.completedLessons || 0),
        0
      )

      // Find current lesson (first in-progress or first locked)
      let currentLesson: Lesson | undefined
      for (const module of modules) {
        const inProgress = module.lessons.find((l) => l.status === 'in_progress')
        if (inProgress) {
          currentLesson = inProgress
          break
        }
        const locked = module.lessons.find((l) => l.status === 'locked')
        if (locked) {
          currentLesson = locked
          break
        }
      }

      userProgress = {
        overallProgress: Math.round((completedLessons / totalLessons) * 100),
        completedLessons,
        currentLesson,
      }
    }

    const response: CurriculumResponse = {
      modules,
      totalLessons: modules.reduce((sum, m) => sum + m.lessons.length, 0),
      userProgress,
    }

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Curriculum error:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to fetch curriculum' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  }
}
