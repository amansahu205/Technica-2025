"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { AppLayout } from "@/components/app-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, Area, AreaChart 
} from 'recharts'
import { TrendingUp, DollarSign, FileText, Sparkles, Activity, Building2, Loader2, Info } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useUser } from "@/lib/user-context"

const TICKERS = ['AAPL', 'MSFT', 'AMZN', 'JPM', 'XOM']
const TIMEFRAMES = ['1M', '3M', '6M', '1Y'] as const
type Timeframe = typeof TIMEFRAMES[number]

interface CompanyData {
  summary: {
    fixed: string[]
    sources: string[]
    chunks_generated: number
  }
  data: {
    profile: {
      company_name: string
      ticker: string
      sector: string
      industry: string
      market_cap: number
    }
    market_data: {
      latest_close: number
      one_year_daily: { date: string; close: number; volume: number }[]
      volume_trends: { avg_volume: number; latest_volume: number }
      sources: string[]
    }
    fundamentals: {
      revenue_ttm: number
      net_income_ttm: number
      roe: number
      total_assets: number
      total_equity: number
    }
    edgar_filings: {
      ten_k: { filing_date: string }
      ten_q: { filing_date: string }
    }
    training_ready_chunks: any[]
  }
}

export default function InvestmentDashboard() {
  const { isAuthenticated } = useUser()
  const router = useRouter()
  
  const [selectedTicker, setSelectedTicker] = useState('AAPL')
  const [timeframe, setTimeframe] = useState<Timeframe>('1Y')
  const [chartView, setChartView] = useState<'price' | 'volume'>('price')
  const [companyData, setCompanyData] = useState<CompanyData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, router])

  useEffect(() => {
    fetchCompanyData(selectedTicker)
  }, [selectedTicker])

  const fetchCompanyData = async (ticker: string) => {
    setLoading(true)
    try {
      const response = await fetch(`/api/company?ticker=${ticker}`)
      const data = await response.json()
      setCompanyData(data)
    } catch (error) {
      console.error('[v0] Error fetching company data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getFilteredData = () => {
    if (!companyData) return []
    
    const daysMap: Record<Timeframe, number> = { '1M': 30, '3M': 90, '6M': 180, '1Y': 365 }
    const days = daysMap[timeframe]
    const allData = companyData.data.market_data.one_year_daily
    
    return allData.slice(-days)
  }

  const formatCurrency = (value: number, compact = false) => {
    if (compact && value >= 1e9) {
      return `$${(value / 1e9).toFixed(2)}B`
    }
    if (compact && value >= 1e6) {
      return `$${(value / 1e6).toFixed(2)}M`
    }
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(value)
  }

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('en-US').format(value)
  }

  if (!isAuthenticated) {
    return null
  }

  if (loading || !companyData) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center space-y-4">
            <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
            <p className="text-muted-foreground">Loading market data...</p>
          </div>
        </div>
      </AppLayout>
    )
  }

  const { profile, market_data, fundamentals, edgar_filings } = companyData.data
  const chartData = getFilteredData()
  const priceChange = chartData.length > 1 
    ? ((chartData[chartData.length - 1].close - chartData[0].close) / chartData[0].close) * 100
    : 0

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center justify-between gap-4"
        >
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Investment Cockpit</h1>
            <p className="text-muted-foreground">
              Real-time market data and personalized learning recommendations
            </p>
          </div>
          
          <Select value={selectedTicker} onValueChange={setSelectedTicker}>
            <SelectTrigger className="w-full md:w-[200px] glass-strong">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {TICKERS.map(ticker => (
                <SelectItem key={ticker} value={ticker}>{ticker}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </motion.div>

        {/* Company Overview Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="glass-strong">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-primary" />
                    <CardTitle className="text-2xl">{profile.company_name}</CardTitle>
                  </div>
                  <CardDescription className="text-base">
                    {profile.sector} · {profile.industry}
                  </CardDescription>
                </div>
                <Button variant="outline" className="glass" size="sm">
                  <Sparkles className="mr-2 h-4 w-4" />
                  Explain this company
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Latest Price</p>
                  <p className="text-2xl font-bold text-primary">
                    {formatCurrency(market_data.latest_close)}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Market Cap</p>
                  <p className="text-2xl font-bold">
                    {formatCurrency(profile.market_cap, true)}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">{timeframe} Change</p>
                  <p className={`text-2xl font-bold ${priceChange >= 0 ? 'text-accent-green' : 'text-destructive'}`}>
                    {priceChange >= 0 ? '+' : ''}{priceChange.toFixed(2)}%
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Volume</p>
                  <p className="text-2xl font-bold">
                    {formatNumber(market_data.volume_trends.latest_volume)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Interactive Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="glass-strong">
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-primary" />
                  {chartView === 'price' ? 'Price Chart' : 'Volume Chart'}
                </CardTitle>
                
                <div className="flex flex-wrap gap-2">
                  {/* Chart View Toggle */}
                  <div className="flex gap-1 p-1 rounded-lg glass">
                    <Button
                      size="sm"
                      variant={chartView === 'price' ? 'default' : 'ghost'}
                      onClick={() => setChartView('price')}
                    >
                      Price
                    </Button>
                    <Button
                      size="sm"
                      variant={chartView === 'volume' ? 'default' : 'ghost'}
                      onClick={() => setChartView('volume')}
                    >
                      Volume
                    </Button>
                  </div>
                  
                  {/* Timeframe Buttons */}
                  <div className="flex gap-1 p-1 rounded-lg glass">
                    {TIMEFRAMES.map(tf => (
                      <Button
                        key={tf}
                        size="sm"
                        variant={timeframe === tf ? 'default' : 'ghost'}
                        onClick={() => setTimeframe(tf)}
                      >
                        {tf}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  {chartView === 'price' ? (
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                      <XAxis 
                        dataKey="date" 
                        stroke="hsl(var(--muted-foreground))"
                        tick={{ fontSize: 12 }}
                        tickFormatter={(value) => {
                          const date = new Date(value)
                          return `${date.getMonth() + 1}/${date.getDate()}`
                        }}
                      />
                      <YAxis 
                        stroke="hsl(var(--muted-foreground))"
                        tick={{ fontSize: 12 }}
                        tickFormatter={(value) => `$${value}`}
                        domain={['dataMin - 5', 'dataMax + 5']}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--popover))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                          backdropFilter: 'blur(12px)'
                        }}
                        formatter={(value: number) => [formatCurrency(value), 'Price']}
                        labelFormatter={(label) => new Date(label).toLocaleDateString()}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="close" 
                        stroke="hsl(var(--primary))" 
                        strokeWidth={2}
                        fill="url(#priceGradient)" 
                        animationDuration={500}
                      />
                    </AreaChart>
                  ) : (
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                      <XAxis 
                        dataKey="date" 
                        stroke="hsl(var(--muted-foreground))"
                        tick={{ fontSize: 12 }}
                        tickFormatter={(value) => {
                          const date = new Date(value)
                          return `${date.getMonth() + 1}/${date.getDate()}`
                        }}
                      />
                      <YAxis 
                        stroke="hsl(var(--muted-foreground))"
                        tick={{ fontSize: 12 }}
                        tickFormatter={(value) => `${(value / 1e6).toFixed(0)}M`}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--popover))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                          backdropFilter: 'blur(12px)'
                        }}
                        formatter={(value: number) => [formatNumber(value), 'Volume']}
                        labelFormatter={(label) => new Date(label).toLocaleDateString()}
                      />
                      <Bar 
                        dataKey="volume" 
                        fill="hsl(var(--accent-green))" 
                        opacity={0.8}
                        animationDuration={500}
                      />
                    </BarChart>
                  )}
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Bottom 3-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Fundamentals */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="glass-strong h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-accent-green" />
                  Fundamentals
                </CardTitle>
                <CardDescription>Key financial metrics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Revenue (TTM)</p>
                  <p className="text-xl font-bold">{formatCurrency(fundamentals.revenue_ttm, true)}</p>
                </div>
                <Separator />
                <div>
                  <p className="text-sm text-muted-foreground">Net Income (TTM)</p>
                  <p className="text-xl font-bold">{formatCurrency(fundamentals.net_income_ttm, true)}</p>
                </div>
                <Separator />
                <div>
                  <p className="text-sm text-muted-foreground">Return on Equity</p>
                  <p className="text-xl font-bold">{(fundamentals.roe * 100).toFixed(1)}%</p>
                </div>
                <Separator />
                <div>
                  <p className="text-sm text-muted-foreground">Total Assets</p>
                  <p className="text-xl font-bold">{formatCurrency(fundamentals.total_assets, true)}</p>
                </div>
                <Button className="w-full mt-4" variant="outline">
                  <Sparkles className="mr-2 h-4 w-4" />
                  Explain these numbers
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Filings & Risk */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="glass-strong h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Filings & Risk
                </CardTitle>
                <CardDescription>SEC filings snapshot</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Latest 10-K</p>
                  <p className="text-lg font-semibold">
                    {new Date(edgar_filings.ten_k.filing_date).toLocaleDateString()}
                  </p>
                </div>
                <Separator />
                <div>
                  <p className="text-sm text-muted-foreground">Latest 10-Q</p>
                  <p className="text-lg font-semibold">
                    {new Date(edgar_filings.ten_q.filing_date).toLocaleDateString()}
                  </p>
                </div>
                <Separator />
                <div>
                  <p className="text-sm text-muted-foreground">Training Chunks</p>
                  <p className="text-lg font-semibold">
                    {companyData.data.training_ready_chunks.length} sections
                  </p>
                </div>
                <div className="glass rounded-lg p-3 mt-4">
                  <div className="flex items-start gap-2">
                    <Info className="h-4 w-4 text-accent-green mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-muted-foreground">
                      AI-ready chunks extracted from SEC filings for personalized learning
                    </p>
                  </div>
                </div>
                <Button className="w-full mt-4" variant="outline">
                  <FileText className="mr-2 h-4 w-4" />
                  Show key risks
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Learning Recommendations */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="glass-strong h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-chart-3" />
                  For You
                </CardTitle>
                <CardDescription>Personalized learning</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm">
                  Based on your assessment profile, here are suggested topics:
                </p>
                
                <div className="space-y-2">
                  <div className="glass rounded-lg p-3 hover:bg-accent/50 transition-colors cursor-pointer">
                    <p className="font-medium text-sm">Understanding P/E Ratios</p>
                    <p className="text-xs text-muted-foreground">Learn how to value stocks</p>
                  </div>
                  
                  <div className="glass rounded-lg p-3 hover:bg-accent/50 transition-colors cursor-pointer">
                    <p className="font-medium text-sm">Sector Analysis</p>
                    <p className="text-xs text-muted-foreground">Compare {profile.sector} companies</p>
                  </div>
                  
                  <div className="glass rounded-lg p-3 hover:bg-accent/50 transition-colors cursor-pointer">
                    <p className="font-medium text-sm">Reading Financial Statements</p>
                    <p className="text-xs text-muted-foreground">Master the basics</p>
                  </div>
                  
                  <div className="glass rounded-lg p-3 hover:bg-accent/50 transition-colors cursor-pointer">
                    <p className="font-medium text-sm">Risk Management</p>
                    <p className="text-xs text-muted-foreground">Protect your portfolio</p>
                  </div>
                </div>

                <Button className="w-full mt-4">
                  <Sparkles className="mr-2 h-4 w-4" />
                  Start Learning
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </AppLayout>
  )
}
