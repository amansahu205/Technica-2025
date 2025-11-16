"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { AppLayout } from "@/components/app-layout"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, DollarSign, AlertCircle, Sparkles } from 'lucide-react'
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

interface Allocation {
  stocks: number
  bonds: number
  cash: number
}

export default function SimulatorPage() {
  const [allocation, setAllocation] = useState<Allocation>({
    stocks: 60,
    bonds: 30,
    cash: 10
  })
  const [simulationRun, setSimulationRun] = useState(false)

  const totalAllocation = allocation.stocks + allocation.bonds + allocation.cash
  const isValidAllocation = totalAllocation === 100

  const handleSliderChange = (asset: keyof Allocation, value: number[]) => {
    setAllocation(prev => ({
      ...prev,
      [asset]: value[0]
    }))
  }

  const handleRunSimulation = () => {
    setSimulationRun(true)
  }

  const handleReset = () => {
    setAllocation({ stocks: 60, bonds: 30, cash: 10 })
    setSimulationRun(false)
  }

  // Calculate results based on allocation
  const expectedReturn = (allocation.stocks * 0.10 + allocation.bonds * 0.04 + allocation.cash * 0.01).toFixed(2)
  const riskLevel = allocation.stocks > 70 ? "High" : allocation.stocks > 40 ? "Medium" : "Low"
  const riskColor = riskLevel === "High" ? "text-destructive" : riskLevel === "Medium" ? "text-chart-4" : "text-accent-green"

  // Generate chart data
  const generateChartData = () => {
    const years = 10
    const data = []
    let stockValue = 10000
    let bondValue = 10000
    let cashValue = 10000
    
    for (let i = 0; i <= years; i++) {
      stockValue *= 1 + (0.10 + (Math.random() - 0.5) * 0.15)
      bondValue *= 1 + (0.04 + (Math.random() - 0.5) * 0.03)
      cashValue *= 1.01
      
      const portfolioValue = (
        (allocation.stocks / 100) * stockValue +
        (allocation.bonds / 100) * bondValue +
        (allocation.cash / 100) * cashValue
      )
      
      data.push({
        year: i,
        value: Math.round(portfolioValue)
      })
    }
    return data
  }

  const chartData = generateChartData()

  return (
    <AppLayout>
      <div className="space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <h1 className="text-4xl md:text-5xl font-bold">
            Interactive{" "}
            <span className="bg-gradient-to-r from-primary to-accent-green bg-clip-text text-transparent">
              Portfolio Simulator
            </span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-balance">
            Experiment with different asset allocations and see how they affect your portfolio's risk and return profile
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Allocation Controls */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <Card className="glass-strong rounded-2xl p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Asset Allocation</h2>
                <Badge 
                  variant={isValidAllocation ? "default" : "destructive"}
                  className="text-sm"
                >
                  {totalAllocation}%
                </Badge>
              </div>

              {!isValidAllocation && (
                <div className="flex items-start gap-2 p-4 rounded-lg bg-destructive/10 border border-destructive/20 mb-6">
                  <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-destructive">
                    Total allocation must equal 100%. Currently at {totalAllocation}%
                  </p>
                </div>
              )}

              {/* Stocks */}
              <div className="space-y-6">
                <div className="glass rounded-xl p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-primary/20 flex items-center justify-center">
                        <TrendingUp className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold">Stocks</p>
                        <p className="text-xs text-muted-foreground">Higher risk, higher return</p>
                      </div>
                    </div>
                    <span className="text-2xl font-bold text-primary">{allocation.stocks}%</span>
                  </div>
                  <Slider
                    value={[allocation.stocks]}
                    onValueChange={(value) => handleSliderChange('stocks', value)}
                    max={100}
                    step={5}
                    className="w-full"
                  />
                </div>

                {/* Bonds */}
                <div className="glass rounded-xl p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-accent-green/20 flex items-center justify-center">
                        <DollarSign className="h-5 w-5 text-accent-green" />
                      </div>
                      <div>
                        <p className="font-semibold">Bonds</p>
                        <p className="text-xs text-muted-foreground">Moderate risk, steady income</p>
                      </div>
                    </div>
                    <span className="text-2xl font-bold text-accent-green">{allocation.bonds}%</span>
                  </div>
                  <Slider
                    value={[allocation.bonds]}
                    onValueChange={(value) => handleSliderChange('bonds', value)}
                    max={100}
                    step={5}
                    className="w-full"
                  />
                </div>

                {/* Cash */}
                <div className="glass rounded-xl p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-chart-3/20 flex items-center justify-center">
                        <TrendingDown className="h-5 w-5 text-chart-3" />
                      </div>
                      <div>
                        <p className="font-semibold">Cash</p>
                        <p className="text-xs text-muted-foreground">Low risk, minimal return</p>
                      </div>
                    </div>
                    <span className="text-2xl font-bold text-chart-3">{allocation.cash}%</span>
                  </div>
                  <Slider
                    value={[allocation.cash]}
                    onValueChange={(value) => handleSliderChange('cash', value)}
                    max={100}
                    step={5}
                    className="w-full"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <Button 
                  onClick={handleRunSimulation}
                  disabled={!isValidAllocation}
                  className="flex-1 group"
                >
                  <Sparkles className="mr-2 h-5 w-5" />
                  Run Simulation
                </Button>
                <Button 
                  onClick={handleReset}
                  variant="outline"
                  className="glass"
                >
                  Reset
                </Button>
              </div>
            </Card>
          </motion.div>

          {/* Results Panel */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* Key Metrics */}
            <Card className="glass-strong rounded-2xl p-8">
              <h2 className="text-2xl font-bold mb-6">Projected Results</h2>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="glass rounded-xl p-4">
                  <p className="text-sm text-muted-foreground mb-2">Expected Return</p>
                  <p className="text-3xl font-bold text-accent-green">{expectedReturn}%</p>
                  <p className="text-xs text-muted-foreground mt-1">Annual average</p>
                </div>

                <div className="glass rounded-xl p-4">
                  <p className="text-sm text-muted-foreground mb-2">Risk Level</p>
                  <p className={`text-3xl font-bold ${riskColor}`}>{riskLevel}</p>
                  <p className="text-xs text-muted-foreground mt-1">Volatility profile</p>
                </div>
              </div>

              {/* Chart */}
              <div className="glass rounded-xl p-4 mb-6">
                <p className="text-sm font-medium mb-4">10-Year Growth Projection</p>
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                    <XAxis 
                      dataKey="year" 
                      tick={{ fontSize: 12 }}
                      tickFormatter={(value) => `Y${value}`}
                    />
                    <YAxis 
                      tick={{ fontSize: 12 }}
                      tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                        backdropFilter: 'blur(12px)'
                      }}
                      formatter={(value: number) => [`$${value.toLocaleString()}`, 'Portfolio Value']}
                      labelFormatter={(label) => `Year ${label}`}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="value" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={2}
                      fillOpacity={1} 
                      fill="url(#colorValue)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
                <p className="text-xs text-center text-muted-foreground mt-2">
                  Starting with $10,000 investment
                </p>
              </div>

              {/* AI Explanation */}
              <div className="glass rounded-xl p-6">
                <div className="flex items-start gap-3 mb-3">
                  <div className="h-8 w-8 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <Sparkles className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold mb-2">AI Analysis</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Your portfolio has a {allocation.stocks}% stock allocation, which is considered {riskLevel.toLowerCase()} risk. 
                      {allocation.stocks > 70 && " This aggressive allocation may experience significant short-term volatility but offers higher long-term growth potential."}
                      {allocation.stocks >= 40 && allocation.stocks <= 70 && " This balanced approach provides a good mix of growth potential and stability."}
                      {allocation.stocks < 40 && " This conservative allocation prioritizes capital preservation over growth."}
                      {" "}Consider your investment timeline and risk tolerance when choosing your allocation.
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </AppLayout>
  )
}
