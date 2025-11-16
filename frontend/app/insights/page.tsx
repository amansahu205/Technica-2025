"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { AppLayout } from "@/components/app-layout"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Sparkles, Newspaper, TrendingUp, AlertCircle, Lightbulb, BookOpen } from 'lucide-react'
import { cn } from "@/lib/utils"
import { insightsApi } from "@/lib/api"
import type { InsightsResponse } from "@/types/api"

const sampleHeadlines = [
  "Federal Reserve raises interest rates by 0.25%",
  "Tech stocks surge as AI adoption accelerates",
  "Oil prices drop amid global supply increase",
  "Major bank announces dividend increase"
]

const relatedConcepts = [
  { label: "Interest Rates", icon: TrendingUp, color: "text-primary" },
  { label: "Inflation", icon: AlertCircle, color: "text-destructive" },
  { label: "Monetary Policy", icon: Lightbulb, color: "text-accent-green" },
  { label: "Bond Yields", icon: BookOpen, color: "text-chart-3" }
]

export default function InsightsPage() {
  const [headline, setHeadline] = useState("")
  const [showExplanation, setShowExplanation] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [apiResponse, setApiResponse] = useState<InsightsResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleExplain = async () => {
    if (!headline.trim()) return

    setIsLoading(true)
    setError(null)
    try {
      const result = await insightsApi.analyzeNews(headline)
      setApiResponse(result)
      setShowExplanation(true)
    } catch (err) {
      console.error('Failed to analyze news:', err)
      setError('Failed to analyze the headline. Please try again.')
      setShowExplanation(false)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSampleClick = (sample: string) => {
    setHeadline(sample)
    setShowExplanation(false)
  }

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
            Market News{" "}
            <span className="bg-gradient-to-r from-primary to-accent-green bg-clip-text text-transparent">
              Interpreter
            </span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-balance">
            Paste any market headline or news snippet, and get a plain-English explanation of what it means for investors
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Input Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1 space-y-6"
          >
            <Card className="glass-strong rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <Newspaper className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-bold">Enter News</h2>
              </div>

              <Textarea
                placeholder="Paste a market headline or news snippet here..."
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                className="min-h-32 mb-4 glass resize-none"
              />

              <Button 
                onClick={handleExplain}
                disabled={!headline.trim() || isLoading}
                className="w-full group"
              >
                {isLoading ? (
                  <>
                    <Sparkles className="mr-2 h-5 w-5 animate-pulse" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-5 w-5" />
                    Explain This
                  </>
                )}
              </Button>
            </Card>

            {/* Sample Headlines */}
            <Card className="glass-strong rounded-2xl p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Lightbulb className="h-4 w-4 text-accent-green" />
                Try These Examples
              </h3>
              <div className="space-y-2">
                {sampleHeadlines.map((sample, index) => (
                  <button
                    key={index}
                    onClick={() => handleSampleClick(sample)}
                    className="w-full text-left p-3 rounded-lg text-sm glass border border-border hover:border-primary hover:bg-primary/5 transition-all"
                  >
                    {sample}
                  </button>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Explanation Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2 space-y-6"
          >
            <AnimatePresence mode="wait">
              {!showExplanation ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <Card className="glass-strong rounded-2xl p-12 text-center">
                    <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                      <Newspaper className="h-12 w-12 text-primary" />
                    </div>
                    <h3 className="text-2xl font-semibold mb-2">Ready to Decode Market News?</h3>
                    <p className="text-muted-foreground max-w-md mx-auto">
                      Enter a market headline on the left, and I'll break it down into plain English with context about how it affects your investments.
                    </p>
                  </Card>
                </motion.div>
              ) : (
                <motion.div
                  key="explanation"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  {/* Plain English Explanation */}
                  <Card className="glass-strong rounded-2xl p-8">
                    <div className="flex items-start gap-3 mb-6">
                      <div className="h-10 w-10 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
                        <Sparkles className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold mb-2">Plain English Explanation</h2>
                        <Badge variant="outline" className="text-xs">
                          AI-Generated Analysis
                        </Badge>
                      </div>
                    </div>

                    <div className="space-y-4 text-muted-foreground leading-relaxed">
                      {apiResponse ? (
                        <>
                          <p>
                            <strong className="text-foreground">Analysis:</strong> {apiResponse.explanation}
                          </p>

                          {apiResponse.used_chunks && apiResponse.used_chunks.length > 0 && (
                            <>
                              <p className="mt-6">
                                <strong className="text-foreground">Related Information:</strong>
                              </p>
                              <div className="space-y-3">
                                {apiResponse.used_chunks.map((chunk, idx) => (
                                  <div key={idx} className="glass rounded-lg p-4">
                                    <p className="text-sm">{chunk.snippet}...</p>
                                    {chunk.metadata && (
                                      <p className="text-xs text-muted-foreground mt-2">
                                        Source: {chunk.metadata.section || 'Company Filing'}
                                      </p>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </>
                          )}
                        </>
                      ) : (
                        <p>
                          <strong className="text-foreground">What Happened:</strong> The Federal Reserve (America's central bank) has increased its benchmark interest rate by a quarter of a percentage point (0.25%). This is the rate that influences how much it costs to borrow money throughout the economy.
                        </p>
                      )}
                    </div>

                    {error && (
                      <div className="mt-4 p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive">
                        {error}
                      </div>
                    )}

                    <div className="hidden space-y-4 text-muted-foreground leading-relaxed">
                      <p>
                        <strong className="text-foreground">Why It Matters:</strong> When interest rates rise, borrowing becomes more expensive for everyone—from people taking out mortgages to companies financing new projects. This typically slows down economic activity and can help control inflation.
                      </p>

                      <p>
                        <strong className="text-foreground">Impact on Your Investments:</strong> Higher interest rates often mean:
                      </p>
                      <ul className="list-disc list-inside space-y-2 ml-4">
                        <li>Stocks may face headwinds as companies face higher borrowing costs</li>
                        <li>Bonds become more attractive as they offer higher yields</li>
                        <li>Savings accounts and CDs will likely offer better returns</li>
                        <li>Growth stocks (especially tech) are often hit harder than value stocks</li>
                      </ul>

                      <p>
                        <strong className="text-foreground">What You Should Consider:</strong> If you're a long-term investor, this is often just short-term noise. However, it might be a good time to review your portfolio's bond allocation and ensure you're properly diversified.
                      </p>
                    </div>
                  </Card>

                  {/* Related Concepts */}
                  <Card className="glass-strong rounded-2xl p-8">
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                      <BookOpen className="h-5 w-5 text-accent-green" />
                      Related Concepts to Learn
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {relatedConcepts.map((concept, index) => (
                        <button
                          key={index}
                          className="glass rounded-xl px-4 py-3 hover:shadow-lg transition-all hover:scale-105 flex items-center gap-2 border border-border hover:border-primary"
                        >
                          <concept.icon className={cn("h-4 w-4", concept.color)} />
                          <span className="font-medium text-sm">{concept.label}</span>
                        </button>
                      ))}
                    </div>
                  </Card>

                  {/* Quick Quiz */}
                  <Card className="glass-strong rounded-2xl p-8">
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                      <Lightbulb className="h-5 w-5 text-primary" />
                      Did You Understand?
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      Test your comprehension with this quick question:
                    </p>

                    <div className="glass rounded-xl p-6">
                      <p className="font-medium mb-4">
                        When the Federal Reserve raises interest rates, what typically happens to borrowing costs?
                      </p>
                      <div className="space-y-3">
                        {[
                          "They decrease",
                          "They increase",
                          "They stay the same",
                          "They become unpredictable"
                        ].map((option, index) => (
                          <button
                            key={index}
                            className="w-full text-left p-4 rounded-lg border border-border glass hover:border-primary hover:bg-primary/5 transition-all"
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    </div>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </AppLayout>
  )
}
