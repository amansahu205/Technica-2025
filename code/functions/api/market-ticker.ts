/**
 * Cloudflare Pages Function: Market Ticker API
 *
 * Proxies requests to Python backend for real-time ticker data
 * GET /api/market-ticker
 */

interface Env {
  BACKEND_URL?: string
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  // Get Python backend URL from environment
  const backendUrl = context.env.BACKEND_URL || 'http://127.0.0.1:8080'

  try {
    // Proxy request to Python backend
    const response = await fetch(`${backendUrl}/market-ticker`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    })

    if (!response.ok) {
      return new Response(
        JSON.stringify({
          error: `Backend returned ${response.status}`
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
        'Cache-Control': 'public, max-age=30', // Cache for 30 seconds (ticker updates frequently)
      },
    })
  } catch (error) {
    console.error('[Cloudflare] Market Ticker API Error:', error)

    return new Response(
      JSON.stringify({
        error: 'Failed to fetch market ticker data from backend',
        message: error instanceof Error ? error.message : 'Unknown error'
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }
}
