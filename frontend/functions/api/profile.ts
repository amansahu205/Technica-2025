/**
 * Cloudflare Pages Function: User Profile API
 *
 * GET  /api/profile?userId=xxx  - Get user profile
 * POST /api/profile             - Create/update user profile
 */

interface Env {
  DB: D1Database
}

interface UserProfile {
  id: string
  email: string
  name: string
  skill_level: 'beginner' | 'intermediate' | 'advanced'
  onboarding_complete: boolean
  created_at: string
  last_active: string
}

// GET: Fetch user profile
export const onRequestGet: PagesFunction<Env> = async (context) => {
  const { searchParams } = new URL(context.request.url)
  const userId = searchParams.get('userId')

  if (!userId) {
    return new Response(JSON.stringify({ error: 'userId is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  try {
    const { results } = await context.env.DB.prepare(
      'SELECT id, email, name, skill_level, onboarding_complete, created_at, last_active FROM users WHERE id = ?'
    )
      .bind(userId)
      .all()

    if (results.length === 0) {
      return new Response(JSON.stringify({ error: 'User not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const user = results[0] as UserProfile

    return new Response(JSON.stringify(user), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Database error:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to fetch user profile' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  }
}

// POST: Create or update user profile
export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const body = await context.request.json()
    const { id, email, name, skill_level } = body

    if (!id || !email) {
      return new Response(
        JSON.stringify({ error: 'id and email are required' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      )
    }

    // Upsert user
    await context.env.DB.prepare(
      `INSERT INTO users (id, email, name, skill_level, last_active)
       VALUES (?, ?, ?, ?, datetime('now'))
       ON CONFLICT(id) DO UPDATE SET
         email = excluded.email,
         name = excluded.name,
         skill_level = excluded.skill_level,
         last_active = datetime('now')`
    )
      .bind(id, email, name || null, skill_level || 'beginner')
      .run()

    return new Response(
      JSON.stringify({ success: true, message: 'Profile updated' }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  } catch (error) {
    console.error('Database error:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to update profile' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  }
}
