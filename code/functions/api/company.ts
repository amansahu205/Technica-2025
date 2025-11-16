/**
 * Cloudflare Pages Function: Company Data API
 *
 * Proxies requests to Python backend running on Trae/Fly.io
 * GET /api/company?ticker=AAPL
 */

interface Env {
  BACKEND_URL?: string
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const { searchParams } = new URL(context.request.url)
  const ticker = searchParams.get('ticker')?.toUpperCase() || 'AAPL'

  // Get Python backend URL from environment
  const backendUrl = context.env.BACKEND_URL || 'http://127.0.0.1:8080'

  try {
    // Proxy request to Python backend
    const response = await fetch(`${backendUrl}/company/${ticker}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    })

    if (!response.ok) {
      return new Response(
        JSON.stringify({
          error: `Backend returned ${response.status}`,
          ticker
        }),
        {
          status: response.status,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    }

    const data = await response.json()

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=300', // Cache for 5 minutes
      },
    })
  } catch (error) {
    console.error('[Cloudflare] Company API Error:', error)

    return new Response(
      JSON.stringify({
        error: 'Failed to fetch company data from backend',
        ticker,
        message: error instanceof Error ? error.message : 'Unknown error'
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }
}
