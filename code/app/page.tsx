"use client"

import { useEffect, useState } from "react"
import { useRouter } from 'next/navigation'
import { motion } from "framer-motion"
import { AppLayout } from "@/components/app-layout"
import { OnboardingTour } from "@/components/onboarding-tour"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { ArrowRight, Play, BookOpen, LineChart, TrendingUp, TrendingDown, Newspaper, Lightbulb, Target, Clock, ArrowUpRight, Activity, DollarSign, BarChart3, ExternalLink } from 'lucide-react'
import Link from "next/link"
import { useI18n } from "@/lib/i18n"
import { useUser } from "@/lib/user-context"
import { LineChart as RechartsLineChart, Line, BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const TICKERS = ['AAPL', 'MSFT', 'AMZN', 'JPM', 'XOM']
const TIMEFRAMES = ['1M', '3M', '6M', '1Y'] as const
type Timeframe = typeof TIMEFRAMES[number]

interface MarketTickerData {
  symbol: string
  price: number
  change: number
  changePercent: number
}

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

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
}

function filterDataByTimeframe(data: Array<{ date: string; close: number; volume: number }>, timeframe: Timeframe) {
  const now = new Date()
  const daysMap = { '1M': 30, '3M': 90, '6M': 180, '1Y': 365 }
  const days = daysMap[timeframe]
  
  return data.slice(-days)
}

function formatNumber(num: number): string {
  if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`
  if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`
  if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`
  return `$${num.toFixed(2)}`
}

export default function HomePage() {
  const { t } = useI18n()
  const { name, onboardingComplete, isAuthenticated } = useUser()
  const router = useRouter()

  const [tickerData, setTickerData] = useState<MarketTickerData[]>([])
  
  const [selectedTicker, setSelectedTicker] = useState('AAPL')
  const [companyData, setCompanyData] = useState<CompanyData | null>(null)
  const [loading, setLoading] = useState(false)
  const [timeframe, setTimeframe] = useState<Timeframe>('1Y')
  const [chartView, setChartView] = useState<'price' | 'volume'>('price')
  
  const [selectedNews, setSelectedNews] = useState<number | null>(null)
  const [newsExplanation, setNewsExplanation] = useState<string>('')

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, router])

  useEffect(() => {
    async function fetchTicker() {
      try {
        const res = await fetch('/api/market-ticker')
        const data = await res.json()
        setTickerData(data)
      } catch (error) {
        console.error('[v0] Failed to fetch ticker data:', error)
      }
    }
    fetchTicker()
    const interval = setInterval(fetchTicker, 30000) // Refresh every 30s
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    async function fetchCompanyData() {
      setLoading(true)
      try {
        const res = await fetch(`/api/company?ticker=${selectedTicker}`)
        const json = await res.json()
        setCompanyData(json.data)
      } catch (error) {
        console.error('[v0] Failed to fetch company data:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchCompanyData()
  }, [selectedTicker])

  if (!isAuthenticated) {
    return null
  }

  const chartData = companyData 
    ? filterDataByTimeframe(companyData.market_data.one_year_daily, timeframe)
    : []

  return (
    <AppLayout>
      {!onboardingComplete && <OnboardingTour />}
      
      <div className="fixed top-[72px] left-0 right-0 z-40 bg-muted/80 backdrop-blur-md border-b border-border overflow-hidden">
        <div className="ticker-wrapper">
          <div className="ticker-content flex gap-8 py-2 px-4">
            {/* Double the items for seamless loop */}
            {[...tickerData, ...tickerData].map((item, idx) => (
              <div key={idx} className="flex items-center gap-2 whitespace-nowrap">
                <span className="font-bold text-sm">{item.symbol}</span>
                <span className="text-sm">${item.price.toFixed(2)}</span>
                <span className={`text-sm font-medium flex items-center gap-1 ${
                  item.changePercent >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                }`}>
                  {item.changePercent >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                  {item.changePercent >= 0 ? '+' : ''}{item.changePercent.toFixed(2)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-8 mt-12"
        role="main"
        aria-label="Dashboard"
      >
        <motion.section 
          variants={itemVariants} 
          className="text-center space-y-6 py-12"
          aria-labelledby="hero-heading"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <h1 id="hero-heading" className="text-4xl md:text-6xl font-bold text-balance mb-4">
              Welcome back, {name || 'Aman'}!{" "}
              <span className="bg-gradient-to-r from-primary to-accent-green bg-clip-text text-transparent">
                Continue Learning
              </span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto text-balance">
              Personalized lessons, interactive simulations, and real-time market insights tailored to your learning style.
            </p>
          </motion.div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/assessment">
              <Button size="lg" className="group transition-all hover:scale-105 shadow-lg">
                Start Assessment
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </Button>
            </Link>
            <Link href="/learn">
              <Button size="lg" variant="outline" className="glass group transition-all hover:scale-105">
                <BookOpen className="mr-2 h-5 w-5" aria-hidden="true" />
                Continue Learning
              </Button>
            </Link>
            <Button size="lg" variant="ghost" className="group transition-all hover:scale-105">
              <Play className="mr-2 h-5 w-5" aria-hidden="true" />
              Watch Demo
            </Button>
          </div>
        </motion.section>

        <motion.section variants={itemVariants} className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Mini Investment Cockpit</h2>
            <Link href="/dashboard">
              <Button variant="outline" className="glass">
                Open Full Cockpit (Advanced)
                <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          <Card className="glass-strong rounded-2xl p-6">
            {/* Ticker Selector & Company Overview */}
            <div className="flex flex-col md:flex-row gap-6 mb-6">
              <div className="flex-shrink-0">
                <label className="text-sm font-medium mb-2 block">Select Company</label>
                <Select value={selectedTicker} onValueChange={setSelectedTicker}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TICKERS.map(ticker => (
                      <SelectItem key={ticker} value={ticker}>{ticker}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {loading ? (
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-6 w-48" />
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-8 w-24" />
                </div>
              ) : companyData ? (
                <div className="flex-1">
                  <h3 className="text-xl font-bold">{companyData.profile.company_name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {companyData.profile.sector} • {companyData.profile.industry}
                  </p>
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-2xl font-bold">${companyData.market_data.latest_close.toFixed(2)}</span>
                    <span className="text-sm text-muted-foreground">
                      Market Cap: {formatNumber(companyData.profile.market_cap)}
                    </span>
                  </div>
                </div>
              ) : null}
            </div>

            {/* Chart Controls */}
            <div className="flex flex-wrap gap-2 mb-4">
              <div className="flex gap-1 bg-muted rounded-lg p-1">
                <Button
                  size="sm"
                  variant={chartView === 'price' ? 'default' : 'ghost'}
                  onClick={() => setChartView('price')}
                >
                  <LineChart className="h-4 w-4 mr-1" />
                  Price
                </Button>
                <Button
                  size="sm"
                  variant={chartView === 'volume' ? 'default' : 'ghost'}
                  onClick={() => setChartView('volume')}
                >
                  <BarChart3 className="h-4 w-4 mr-1" />
                  Volume
                </Button>
              </div>

              <div className="flex gap-1 bg-muted rounded-lg p-1">
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

            {/* Interactive Chart */}
            {loading ? (
              <Skeleton className="h-[300px] w-full rounded-lg" />
            ) : chartData.length > 0 ? (
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  {chartView === 'price' ? (
                    <RechartsLineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis 
                        dataKey="date" 
                        tick={{ fontSize: 12 }}
                        tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      />
                      <YAxis 
                        tick={{ fontSize: 12 }}
                        domain={['auto', 'auto']}
                        tickFormatter={(value) => `$${value.toFixed(0)}`}
                      />
                      <Tooltip 
                        contentStyle={{ background: 'hsl(var(--popover))', border: '1px solid hsl(var(--border))' }}
                        labelFormatter={(date) => new Date(date).toLocaleDateString()}
                        formatter={(value: number) => [`$${value.toFixed(2)}`, 'Price']}
                      />
                      <Line type="monotone" dataKey="close" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
                    </RechartsLineChart>
                  ) : (
                    <RechartsBarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis 
                        dataKey="date" 
                        tick={{ fontSize: 12 }}
                        tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      />
                      <YAxis 
                        tick={{ fontSize: 12 }}
                        tickFormatter={(value) => `${(value / 1e6).toFixed(0)}M`}
                      />
                      <Tooltip 
                        contentStyle={{ background: 'hsl(var(--popover))', border: '1px solid hsl(var(--border))' }}
                        labelFormatter={(date) => new Date(date).toLocaleDateString()}
                        formatter={(value: number) => [`${(value / 1e6).toFixed(2)}M`, 'Volume']}
                      />
                      <Bar dataKey="volume" fill="hsl(var(--accent-green))" />
                    </RechartsBarChart>
                  )}
                </ResponsiveContainer>
              </div>
            ) : null}

            {/* Fundamentals Snapshot */}
            {!loading && companyData && (
              <Card className="glass mt-6 p-4">
                <CardHeader className="p-0 pb-4">
                  <CardTitle className="text-lg">Fundamentals Snapshot</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground">Revenue TTM</p>
                      <p className="font-bold">{formatNumber(companyData.fundamentals.revenue_ttm)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Net Income TTM</p>
                      <p className="font-bold">{formatNumber(companyData.fundamentals.net_income_ttm)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">ROE</p>
                      <p className="font-bold">{(companyData.fundamentals.roe * 100).toFixed(1)}%</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Total Assets</p>
                      <p className="font-bold">{formatNumber(companyData.fundamentals.total_assets)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Total Equity</p>
                      <p className="font-bold">{formatNumber(companyData.fundamentals.total_equity)}</p>
                    </div>
                  </div>
                  <Button className="mt-4 w-full" variant="outline">
                    <Lightbulb className="mr-2 h-4 w-4" />
                    Explain these numbers
                  </Button>
                </CardContent>
              </Card>
            )}
          </Card>
        </motion.section>

        <motion.section variants={itemVariants} className="space-y-4">
          <h2 className="text-2xl font-bold">Today's Market Insights</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                headline: "Fed Holds Interest Rates Steady at 5.5%",
                subtext: "Central bank signals potential cuts in Q2 2025 based on inflation data",
                category: "Monetary Policy"
              },
              {
                headline: "Tech Stocks Rally on Strong AI Earnings",
                subtext: "Major technology companies report 40% YoY growth in AI-related revenue",
                category: "Earnings"
              },
              {
                headline: "Oil Prices Surge Amid Supply Concerns",
                subtext: "Brent crude hits $92/barrel as OPEC+ extends production cuts",
                category: "Commodities"
              }
            ].map((news, idx) => (
              <Card key={idx} className="glass-strong rounded-2xl p-6 hover:shadow-xl transition-all">
                <div className="flex items-start justify-between mb-3">
                  <span className="text-xs px-2 py-1 rounded-full bg-primary/20 text-primary font-medium">
                    {news.category}
                  </span>
                  <Newspaper className="h-5 w-5 text-muted-foreground" />
                </div>
                <h3 className="font-bold mb-2 text-balance">{news.headline}</h3>
                <p className="text-sm text-muted-foreground mb-4">{news.subtext}</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  onClick={() => {
                    setSelectedNews(idx)
                    setNewsExplanation(`Here's what this means: ${news.headline.toLowerCase()}...`)
                  }}
                >
                  <Lightbulb className="mr-2 h-4 w-4" />
                  Explain this
                </Button>
                {selectedNews === idx && newsExplanation && (
                  <div className="mt-4 p-3 bg-muted rounded-lg text-sm">
                    {newsExplanation}
                  </div>
                )}
              </Card>
            ))}
          </div>
        </motion.section>

        <motion.section variants={itemVariants} className="space-y-4">
          <h2 className="text-2xl font-bold">Personalized Learning Suggestions</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                icon: <Activity className="h-6 w-6" />,
                title: "Understanding Volatility",
                description: "Learn how market fluctuations can impact your investment strategy",
                duration: "12 min"
              },
              {
                icon: <Target className="h-6 w-6" />,
                title: "How Diversification Works",
                description: "Discover the power of spreading risk across different assets",
                duration: "18 min"
              },
              {
                icon: <DollarSign className="h-6 w-6" />,
                title: "What Drives Stock Prices?",
                description: "Understand the fundamental factors that affect company valuations",
                duration: "15 min"
              }
            ].map((lesson, idx) => (
              <Card key={idx} className="glass-strong rounded-2xl p-6 hover:shadow-xl transition-all hover:scale-[1.02] group">
                <div className="h-12 w-12 rounded-xl bg-accent-green/20 flex items-center justify-center group-hover:scale-110 transition-transform mb-4 text-accent-green">
                  {lesson.icon}
                </div>
                <h3 className="font-bold mb-2">{lesson.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">{lesson.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>{lesson.duration}</span>
                  </div>
                  <Button size="sm">
                    Start Lesson
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          <div className="flex justify-center mt-6">
            <Link href="/learn">
              <Button size="lg" variant="outline" className="glass">
                <BookOpen className="mr-2 h-5 w-5" />
                Go to Learn
              </Button>
            </Link>
          </div>
        </motion.section>
      </motion.div>

      <style jsx>{`
        .ticker-wrapper {
          overflow: hidden;
        }
        .ticker-content {
          display: flex;
          animation: ticker 30s linear infinite;
        }
        @keyframes ticker {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </AppLayout>
  )
}
