import { NextRequest, NextResponse } from 'next/server'

// Mock data generator for the demo
function generateMockCompanyData(ticker: string) {
  const companies: Record<string, any> = {
    AAPL: {
      profile: {
        company_name: 'Apple Inc.',
        ticker: 'AAPL',
        sector: 'Technology',
        industry: 'Consumer Electronics',
        market_cap: 2890000000000,
      },
      market_data: {
        latest_close: 185.32,
        volume_trends: { avg_volume: 55000000, latest_volume: 48500000 },
        sources: ['Yahoo Finance', 'Alpha Vantage']
      },
      fundamentals: {
        revenue_ttm: 394328000000,
        net_income_ttm: 99803000000,
        roe: 0.452,
        total_assets: 352755000000,
        total_equity: 62146000000
      },
      edgar_filings: {
        ten_k: { filing_date: '2024-11-01' },
        ten_q: { filing_date: '2024-08-03' }
      },
      training_ready_chunks: Array(156).fill({ topic: 'Risk Factors' })
    },
    MSFT: {
      profile: {
        company_name: 'Microsoft Corporation',
        ticker: 'MSFT',
        sector: 'Technology',
        industry: 'Software',
        market_cap: 2790000000000,
      },
      market_data: {
        latest_close: 378.91,
        volume_trends: { avg_volume: 22000000, latest_volume: 25400000 },
        sources: ['Yahoo Finance', 'Alpha Vantage']
      },
      fundamentals: {
        revenue_ttm: 227582000000,
        net_income_ttm: 88136000000,
        roe: 0.398,
        total_assets: 512163000000,
        total_equity: 238268000000
      },
      edgar_filings: {
        ten_k: { filing_date: '2024-10-30' },
        ten_q: { filing_date: '2024-07-30' }
      },
      training_ready_chunks: Array(203).fill({ topic: 'Business Overview' })
    },
    AMZN: {
      profile: {
        company_name: 'Amazon.com, Inc.',
        ticker: 'AMZN',
        sector: 'Consumer Cyclical',
        industry: 'Internet Retail',
        market_cap: 1850000000000,
      },
      market_data: {
        latest_close: 178.25,
        volume_trends: { avg_volume: 45000000, latest_volume: 52100000 },
        sources: ['Yahoo Finance', 'Alpha Vantage']
      },
      fundamentals: {
        revenue_ttm: 574785000000,
        net_income_ttm: 30425000000,
        roe: 0.187,
        total_assets: 527854000000,
        total_equity: 201875000000
      },
      edgar_filings: {
        ten_k: { filing_date: '2024-02-02' },
        ten_q: { filing_date: '2024-10-26' }
      },
      training_ready_chunks: Array(289).fill({ topic: 'Competition' })
    },
    JPM: {
      profile: {
        company_name: 'JPMorgan Chase & Co.',
        ticker: 'JPM',
        sector: 'Financial Services',
        industry: 'Banks - Diversified',
        market_cap: 595000000000,
      },
      market_data: {
        latest_close: 208.64,
        volume_trends: { avg_volume: 10500000, latest_volume: 9800000 },
        sources: ['Yahoo Finance', 'Alpha Vantage']
      },
      fundamentals: {
        revenue_ttm: 162398000000,
        net_income_ttm: 49552000000,
        roe: 0.158,
        total_assets: 3875000000000,
        total_equity: 329100000000
      },
      edgar_filings: {
        ten_k: { filing_date: '2024-02-22' },
        ten_q: { filing_date: '2024-11-10' }
      },
      training_ready_chunks: Array(412).fill({ topic: 'Risk Management' })
    },
    XOM: {
      profile: {
        company_name: 'Exxon Mobil Corporation',
        ticker: 'XOM',
        sector: 'Energy',
        industry: 'Oil & Gas Integrated',
        market_cap: 445000000000,
      },
      market_data: {
        latest_close: 107.88,
        volume_trends: { avg_volume: 18500000, latest_volume: 16200000 },
        sources: ['Yahoo Finance', 'Alpha Vantage']
      },
      fundamentals: {
        revenue_ttm: 344582000000,
        net_income_ttm: 36010000000,
        roe: 0.178,
        total_assets: 376317000000,
        total_equity: 208735000000
      },
      edgar_filings: {
        ten_k: { filing_date: '2024-02-26' },
        ten_q: { filing_date: '2024-10-31' }
      },
      training_ready_chunks: Array(178).fill({ topic: 'Environmental Risks' })
    }
  }

  const companyData = companies[ticker] || companies['AAPL']

  // Generate price history (last 365 days)
  const priceHistory = []
  const today = new Date()
  const basePrice = companyData.market_data.latest_close
  
  for (let i = 364; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    
    // Generate realistic price movement
    const randomWalk = (Math.random() - 0.5) * 0.03
    const trend = -0.0001 * i // Slight upward trend
    const price = basePrice * (1 + trend + randomWalk)
    const volume = companyData.market_data.volume_trends.avg_volume * (0.7 + Math.random() * 0.6)
    
    priceHistory.push({
      date: date.toISOString().split('T')[0],
      close: Math.round(price * 100) / 100,
      volume: Math.round(volume)
    })
  }

  return {
    summary: {
      fixed: ['Market data retrieved', 'Fundamentals updated', 'Filings processed'],
      sources: companyData.market_data.sources,
      chunks_generated: companyData.training_ready_chunks.length
    },
    data: {
      ...companyData,
      market_data: {
        ...companyData.market_data,
        one_year_daily: priceHistory
      }
    }
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const ticker = searchParams.get('ticker') || 'AAPL'
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300))
  
  const data = generateMockCompanyData(ticker.toUpperCase())
  
  return NextResponse.json(data)
}
