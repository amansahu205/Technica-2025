/**
 * Cloudflare Pages Function: Market Ticker API
 *
 * Returns mock real-time ticker data for demo
 * GET /api/market-ticker
 */

interface MarketTickerData {
  symbol: string
  price: number
  change: number
  changePercent: number
}

// Base ticker data (updated periodically for demo)
const BASE_TICKERS: MarketTickerData[] = [
  { symbol: 'AAPL', price: 178.32, change: 2.15, changePercent: 1.22 },
  { symbol: 'MSFT', price: 412.45, change: -3.20, changePercent: -0.77 },
  { symbol: 'AMZN', price: 168.91, change: 4.32, changePercent: 2.63 },
  { symbol: 'JPM', price: 182.67, change: 1.45, changePercent: 0.80 },
  { symbol: 'XOM', price: 108.23, change: -1.12, changePercent: -1.02 },
]

function addRandomVariation(data: MarketTickerData[]): MarketTickerData[] {
  // Add small random variations to make it look "live"
  return data.map(ticker => {
    const variation = (Math.random() - 0.5) * 0.5 // ±0.25%
    const newPrice = ticker.price * (1 + variation / 100)
    const newChange = newPrice - ticker.price
    const newChangePercent = (newChange / ticker.price) * 100

    return {
      symbol: ticker.symbol,
      price: parseFloat(newPrice.toFixed(2)),
      change: parseFloat(newChange.toFixed(2)),
      changePercent: parseFloat(newChangePercent.toFixed(2)),
    }
  })
}

export const onRequestGet: PagesFunction = async () => {
  try {
    // Return mock data with slight variations
    const tickerData = addRandomVariation(BASE_TICKERS)

    return new Response(JSON.stringify(tickerData), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=30',
      },
    })
  } catch (error) {
    console.error('[Mock API] Market Ticker Error:', error)

    return new Response(
      JSON.stringify({
        error: 'Failed to generate ticker data',
        message: error instanceof Error ? error.message : 'Unknown error'
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }
}
