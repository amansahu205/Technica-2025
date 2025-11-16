import { NextResponse } from 'next/server'

function generateTickerData() {
  const tickers = [
    { symbol: 'AAPL', basePrice: 185.32 },
    { symbol: 'MSFT', basePrice: 378.91 },
    { symbol: 'AMZN', basePrice: 178.25 },
    { symbol: 'GOOGL', basePrice: 142.18 },
    { symbol: 'NVDA', basePrice: 495.22 },
    { symbol: 'TSLA', basePrice: 238.45 },
    { symbol: 'META', basePrice: 484.03 },
    { symbol: 'JPM', basePrice: 208.64 },
    { symbol: 'XOM', basePrice: 107.88 },
    { symbol: 'BAC', basePrice: 36.42 }
  ]

  return tickers.map(({ symbol, basePrice }) => {
    const changePercent = (Math.random() - 0.5) * 6 // -3% to +3%
    const change = basePrice * (changePercent / 100)
    const price = basePrice + change

    return {
      symbol,
      price: Math.round(price * 100) / 100,
      change: Math.round(change * 100) / 100,
      changePercent: Math.round(changePercent * 100) / 100
    }
  })
}

export async function GET() {
  const data = generateTickerData()
  return NextResponse.json(data)
}
