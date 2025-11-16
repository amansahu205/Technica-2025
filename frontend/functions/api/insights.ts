/**
 * Cloudflare Pages Function: Market Insights API
 *
 * POST /api/insights - Analyze a news headline and provide insights
 */

interface Env {
  DB: D1Database
  AI?: any // Cloudflare Workers AI binding
}

interface InsightsRequest {
  headline: string
  ticker?: string
  userId?: string
}

interface InsightsResponse {
  headline: string
  explanation: string
  relatedConcepts: string[]
  ticker?: string
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const body: InsightsRequest = await context.request.json()
    const { headline, ticker, userId } = body

    if (!headline) {
      return new Response(
        JSON.stringify({ error: 'headline is required' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      )
    }

    // TODO: Use Cloudflare Workers AI to generate insights
    // For now, return a mock response
    const explanation = `Analysis of "${headline}": This news indicates market movement related to ${ticker || 'the mentioned company'}. Consider factors like market sentiment, company fundamentals, and broader economic trends when evaluating this information.`

    const relatedConcepts = ['market-volatility', 'fundamental-analysis', 'risk-management']

    // Store insight in database if userId provided
    if (userId) {
      try {
        const insightId = `insight_${Date.now()}`
        await context.env.DB.prepare(
          `INSERT INTO news_insights (id, user_id, headline, ticker, explanation, analyzed_at)
           VALUES (?, ?, ?, ?, ?, datetime('now'))`
        )
          .bind(insightId, userId, headline, ticker || null, explanation)
          .run()
      } catch (dbError) {
        console.error('Failed to save insight:', dbError)
        // Continue anyway
      }
    }

    const response: InsightsResponse = {
      headline,
      explanation,
      relatedConcepts,
      ticker,
    }

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Insights error:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to generate insights' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  }
}

// GET: Retrieve user's past insights
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
      `SELECT id, headline, ticker, explanation, analyzed_at
       FROM news_insights
       WHERE user_id = ?
       ORDER BY analyzed_at DESC
       LIMIT 20`
    )
      .bind(userId)
      .all()

    return new Response(JSON.stringify(results), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Database error:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to fetch insights history' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  }
}
