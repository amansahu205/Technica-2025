/**
 * Cloudflare Pages Function: Text-to-Speech API
 *
 * Integrates with ElevenLabs API to generate speech from lesson text
 * GET /api/text-to-speech?lessonId=lesson-1
 * POST /api/text-to-speech (with custom text in body)
 */

interface ElevenLabsRequest {
  text: string
  model_id?: string
  voice_settings?: {
    stability: number
    similarity_boost: number
    style?: number
    use_speaker_boost?: boolean
  }
}

// Lesson content mapping
const LESSON_CONTENT: Record<string, string> = {
  "lesson-1": `Investing versus Saving: What's the Difference?

Learn the fundamental difference between saving and investing, when to use each strategy, and how investing can help you build long-term wealth. Discover why your savings account might not be enough to reach your financial goals.

Saving is setting aside money for short-term goals or emergencies. It's safe, liquid, and typically earns minimal interest in a savings account. Investing, on the other hand, is putting your money to work in assets like stocks, bonds, or real estate, with the goal of growing your wealth over time.

The key difference is risk and return. Savings are low-risk but offer low returns, often not keeping pace with inflation. Investments carry more risk but historically provide higher returns that can outpace inflation and build substantial wealth over decades.`,

  "lesson-2": `Understanding Asset Types: Stocks, Bonds, and Real Estate

Explore the three main asset classes available to investors. Learn how stocks represent ownership, bonds represent lending, and real estate offers tangible investment opportunities. Understand the unique characteristics and roles of each asset type.

Stocks represent partial ownership in a company. When you buy stock, you become a shareholder and can benefit from the company's growth through price appreciation and dividends. Stocks are generally higher risk but offer the potential for higher returns.

Bonds are essentially loans you make to corporations or governments. In return, you receive regular interest payments and your principal back at maturity. Bonds are typically lower risk than stocks and provide steady income.

Real estate includes physical properties like homes, apartments, or commercial buildings. Real estate can provide both rental income and appreciation over time, and offers diversification from traditional stocks and bonds.`,

  "lesson-3": `The Power of Compound Interest and Time Value of Money

Discover why Albert Einstein called compound interest the eighth wonder of the world. Learn how money grows exponentially over time, understand the time value of money concept, and see real examples of how starting early can dramatically increase your wealth.

Compound interest means earning interest on your interest. Unlike simple interest, which only earns on your principal, compound interest grows exponentially. The longer you invest, the more powerful compounding becomes.

For example, if you invest $1,000 at 8% annual return, after one year you'll have $1,080. In year two, you earn 8% on $1,080, not just the original $1,000. This creates a snowball effect that accelerates your wealth growth dramatically over decades.

The time value of money principle states that money available today is worth more than the same amount in the future, because of its potential earning capacity. This is why starting to invest early, even with small amounts, is so powerful.`,

  // Add more lessons as needed...
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const url = new URL(context.request.url)
  const lessonId = url.searchParams.get('lessonId')
  const voiceId = url.searchParams.get('voiceId') || 'EXAVITQu4vr4xnSDxMaL' // Default: Bella

  if (!lessonId) {
    return new Response(
      JSON.stringify({ error: 'lessonId parameter required' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    )
  }

  const lessonText = LESSON_CONTENT[lessonId]
  if (!lessonText) {
    return new Response(
      JSON.stringify({ error: 'Lesson not found' }),
      { status: 404, headers: { 'Content-Type': 'application/json' } }
    )
  }

  try {
    // Get ElevenLabs API key from environment
    const apiKey = context.env.ELEVENLABS_API_KEY

    if (!apiKey) {
      // Return mock response if no API key (for development)
      return new Response(
        JSON.stringify({
          error: 'ElevenLabs API key not configured',
          message: 'Add ELEVENLABS_API_KEY to environment variables',
          lessonId,
          textPreview: lessonText.substring(0, 100) + '...'
        }),
        {
          status: 503,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    }

    // Call ElevenLabs API
    const elevenLabsUrl = `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}/stream`

    const elevenLabsRequest: ElevenLabsRequest = {
      text: lessonText,
      model_id: 'eleven_turbo_v2', // Fast, efficient model
      voice_settings: {
        stability: 0.5,
        similarity_boost: 0.75,
        style: 0.5,
        use_speaker_boost: true
      }
    }

    const response = await fetch(elevenLabsUrl, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': apiKey
      },
      body: JSON.stringify(elevenLabsRequest)
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('[ElevenLabs] API Error:', errorText)
      return new Response(
        JSON.stringify({
          error: 'ElevenLabs API error',
          details: errorText
        }),
        {
          status: response.status,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    }

    // Stream the audio back to the client
    return new Response(response.body, {
      status: 200,
      headers: {
        'Content-Type': 'audio/mpeg',
        'Cache-Control': 'public, max-age=86400', // Cache for 24 hours
        'X-Lesson-ID': lessonId
      }
    })

  } catch (error) {
    console.error('[ElevenLabs] Error:', error)
    return new Response(
      JSON.stringify({
        error: 'Failed to generate speech',
        message: error instanceof Error ? error.message : 'Unknown error'
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const body = await context.request.json() as { text: string; voiceId?: string }
    const { text, voiceId = 'EXAVITQu4vr4xnSDxMaL' } = body

    if (!text) {
      return new Response(
        JSON.stringify({ error: 'text field required in request body' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    const apiKey = context.env.ELEVENLABS_API_KEY

    if (!apiKey) {
      return new Response(
        JSON.stringify({
          error: 'ElevenLabs API key not configured',
          message: 'Add ELEVENLABS_API_KEY to environment variables'
        }),
        { status: 503, headers: { 'Content-Type': 'application/json' } }
      )
    }

    const elevenLabsUrl = `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}/stream`

    const response = await fetch(elevenLabsUrl, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': apiKey
      },
      body: JSON.stringify({
        text,
        model_id: 'eleven_turbo_v2',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75
        }
      })
    })

    if (!response.ok) {
      const errorText = await response.text()
      return new Response(
        JSON.stringify({ error: 'ElevenLabs API error', details: errorText }),
        { status: response.status, headers: { 'Content-Type': 'application/json' } }
      )
    }

    return new Response(response.body, {
      status: 200,
      headers: {
        'Content-Type': 'audio/mpeg',
        'Cache-Control': 'public, max-age=3600'
      }
    })

  } catch (error) {
    return new Response(
      JSON.stringify({
        error: 'Failed to generate speech',
        message: error instanceof Error ? error.message : 'Unknown error'
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}
