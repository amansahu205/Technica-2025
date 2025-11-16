/**
 * Cloudflare Pages Function: Login API
 *
 * POST /api/auth/login - Login with email and password
 */

interface Env {
  DB: D1Database
}

interface LoginRequest {
  email: string
  password: string
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const body: LoginRequest = await context.request.json()
    const { email, password } = body

    if (!email || !password) {
      return new Response(
        JSON.stringify({ error: 'Email and password are required' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      )
    }

    // Find user by email
    const user = await context.env.DB.prepare(
      `SELECT u.id, u.email, u.name, u.skill_level, u.onboarding_complete
       FROM users u
       WHERE u.email = ?`
    )
      .bind(email)
      .first()

    if (!user) {
      return new Response(
        JSON.stringify({ error: 'Invalid email or password' }),
        {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        }
      )
    }

    // Check password
    const credentials = await context.env.DB.prepare(
      'SELECT password FROM user_credentials WHERE user_id = ?'
    )
      .bind(user.id)
      .first()

    if (!credentials || credentials.password !== password) {
      return new Response(
        JSON.stringify({ error: 'Invalid email or password' }),
        {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        }
      )
    }

    // Update last active timestamp
    await context.env.DB.prepare(
      `UPDATE users SET last_active = datetime('now') WHERE id = ?`
    )
      .bind(user.id)
      .run()

    return new Response(
      JSON.stringify({
        success: true,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          skillLevel: user.skill_level,
          onboardingComplete: user.onboarding_complete,
        },
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  } catch (error) {
    console.error('Login error:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to login' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  }
}
