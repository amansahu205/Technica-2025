/**
 * Cloudflare Pages Function: Company Data API
 *
 * Returns mock company data for demo
 * GET /api/company?ticker=AAPL
 */

interface CompanyData {
  profile: {
    company_name: string
    ticker: string
    sector: string
    industry: string
    market_cap: number
  }
  market_data: {
    latest_close: number
    one_year_daily: Array<{ date: string; close: number; volume: number }>
  }
  fundamentals: {
    revenue_ttm: number
    net_income_ttm: number
    roe: number
    total_assets: number
    total_equity: number
  }
}

// Mock company data for demo
const COMPANY_DATA: Record<string, CompanyData> = {
  AAPL: {
    profile: {
      company_name: 'Apple Inc.',
      ticker: 'AAPL',
      sector: 'Technology',
      industry: 'Consumer Electronics',
      market_cap: 2800000000000,
    },
    market_data: {
      latest_close: 178.32,
      one_year_daily: [],
    },
    fundamentals: {
      revenue_ttm: 383285000000,
      net_income_ttm: 96995000000,
      roe: 0.1569,
      total_assets: 352755000000,
      total_equity: 62146000000,
    },
  },
  MSFT: {
    profile: {
      company_name: 'Microsoft Corporation',
      ticker: 'MSFT',
      sector: 'Technology',
      industry: 'Software—Infrastructure',
      market_cap: 3100000000000,
    },
    market_data: {
      latest_close: 412.45,
      one_year_daily: [],
    },
    fundamentals: {
      revenue_ttm: 227582000000,
      net_income_ttm: 86830000000,
      roe: 0.3845,
      total_assets: 512163000000,
      total_equity: 238268000000,
    },
  },
  AMZN: {
    profile: {
      company_name: 'Amazon.com, Inc.',
      ticker: 'AMZN',
      sector: 'Consumer Cyclical',
      industry: 'Internet Retail',
      market_cap: 1750000000000,
    },
    market_data: {
      latest_close: 168.91,
      one_year_daily: [],
    },
    fundamentals: {
      revenue_ttm: 574785000000,
      net_income_ttm: 30425000000,
      roe: 0.1845,
      total_assets: 527854000000,
      total_equity: 201876000000,
    },
  },
  JPM: {
    profile: {
      company_name: 'JPMorgan Chase & Co.',
      ticker: 'JPM',
      sector: 'Financial Services',
      industry: 'Banks—Diversified',
      market_cap: 540000000000,
    },
    market_data: {
      latest_close: 182.67,
      one_year_daily: [],
    },
    fundamentals: {
      revenue_ttm: 158109000000,
      net_income_ttm: 49552000000,
      roe: 0.1645,
      total_assets: 3875000000000,
      total_equity: 321406000000,
    },
  },
  XOM: {
    profile: {
      company_name: 'Exxon Mobil Corporation',
      ticker: 'XOM',
      sector: 'Energy',
      industry: 'Oil & Gas Integrated',
      market_cap: 450000000000,
    },
    market_data: {
      latest_close: 108.23,
      one_year_daily: [],
    },
    fundamentals: {
      revenue_ttm: 344582000000,
      net_income_ttm: 36010000000,
      roe: 0.1756,
      total_assets: 376317000000,
      total_equity: 193932000000,
    },
  },
}

function generateHistoricalData(
  currentPrice: number,
  days: number = 365
): Array<{ date: string; close: number; volume: number }> {
  const data: Array<{ date: string; close: number; volume: number }> = []
  const today = new Date()

  // Start price is 80-120% of current price
  let price = currentPrice * (0.8 + Math.random() * 0.4)

  for (let i = days; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)

    // Simulate price movement with trend towards current price
    const trendFactor = (days - i) / days
    const targetPrice = price + (currentPrice - price) * trendFactor * 0.02
    const dailyChange = (Math.random() - 0.45) * 0.03 // Slight upward bias
    price = targetPrice * (1 + dailyChange)

    // Generate realistic volume (varies by ±30%)
    const baseVolume = 50000000 + Math.random() * 30000000
    const volume = Math.floor(baseVolume * (0.7 + Math.random() * 0.6))

    data.push({
      date: date.toISOString().split('T')[0],
      close: parseFloat(price.toFixed(2)),
      volume,
    })
  }

  return data
}

export const onRequestGet: PagesFunction = async (context) => {
  try {
    const { searchParams } = new URL(context.request.url)
    const ticker = searchParams.get('ticker')?.toUpperCase() || 'AAPL'

    const companyData = COMPANY_DATA[ticker]

    if (!companyData) {
      return new Response(
        JSON.stringify({
          error: `No data available for ticker: ${ticker}`,
        }),
        {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        }
      )
    }

    // Generate historical data on demand (cached by client)
    companyData.market_data.one_year_daily = generateHistoricalData(
      companyData.market_data.latest_close
    )

    return new Response(
      JSON.stringify({
        data: companyData,
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=300', // Cache for 5 minutes
        },
      }
    )
  } catch (error) {
    console.error('[Mock API] Company Data Error:', error)

    return new Response(
      JSON.stringify({
        error: 'Failed to generate company data',
        message: error instanceof Error ? error.message : 'Unknown error',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  }
}
