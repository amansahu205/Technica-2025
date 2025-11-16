/**
 * Cloudflare Pages Function: Signup API
 *
 * POST /api/auth/signup - Create new user account
 */

interface Env {
  DB: D1Database
}

interface SignupRequest {
  email: string
  password: string
  name: string
  region?: string
  familiarity?: string
  learningPreferences?: string[]
  accessibilityPreferences?: string[]
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const body: SignupRequest = await context.request.json()
    const { email, password, name, region, familiarity } = body

    if (!email || !password || !name) {
      return new Response(
        JSON.stringify({ error: 'Email, password, and name are required' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      )
    }

    // Check if user already exists
    const existingUser = await context.env.DB.prepare(
      'SELECT id FROM users WHERE email = ?'
    )
      .bind(email)
      .first()

    if (existingUser) {
      return new Response(
        JSON.stringify({ error: 'User with this email already exists' }),
        {
          status: 409,
          headers: { 'Content-Type': 'application/json' },
        }
      )
    }

    // Generate simple user ID
    const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    // Determine initial skill level based on familiarity
    let skillLevel = 'beginner'
    if (familiarity === 'invested') {
      skillLevel = 'advanced'
    } else if (familiarity === 'little') {
      skillLevel = 'intermediate'
    }

    // Create new user (password stored as plain text - NOT secure, but as requested)
    await context.env.DB.prepare(
      `INSERT INTO users (id, email, name, skill_level, onboarding_complete, created_at, last_active)
       VALUES (?, ?, ?, ?, ?, datetime('now'), datetime('now'))`
    )
      .bind(userId, email, name, skillLevel, false)
      .run()

    // Also store password in a simple way (for demo purposes only)
    // Note: In production, you'd hash this with bcrypt or similar
    await context.env.DB.prepare(
      `CREATE TABLE IF NOT EXISTS user_credentials (
        user_id TEXT PRIMARY KEY,
        password TEXT NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )`
    ).run()

    await context.env.DB.prepare(
      'INSERT INTO user_credentials (user_id, password) VALUES (?, ?)'
    )
      .bind(userId, password)
      .run()

    return new Response(
      JSON.stringify({
        success: true,
        user: {
          id: userId,
          email,
          name,
          skillLevel,
        },
      }),
      {
        status: 201,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  } catch (error) {
    console.error('Signup error:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to create account' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  }
}
