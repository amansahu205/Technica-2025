"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { AppLayout } from "@/components/app-layout"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Lock, CheckCircle2, PlayCircle, Clock, Baby, GraduationCap, Rocket, ChevronRight } from 'lucide-react'
import { cn } from "@/lib/utils"

type LessonStatus = "locked" | "in-progress" | "completed"
type ComplexityLevel = "eli5" | "beginner" | "advanced"

interface Lesson {
  id: number
  day: number
  title: string
  description: string
  duration: string
  status: LessonStatus
  quizQuestions: number
}

const lessons: Lesson[] = [
  {
    id: 1,
    day: 1,
    title: "Introduction to Investing",
    description: "Learn the fundamental concepts of investing and why it matters for your financial future.",
    duration: "15 min",
    status: "completed",
    quizQuestions: 3
  },
  {
    id: 2,
    day: 2,
    title: "Stocks vs Bonds",
    description: "Understand the key differences between stocks and bonds, and when to use each.",
    duration: "20 min",
    status: "completed",
    quizQuestions: 4
  },
  {
    id: 3,
    day: 3,
    title: "Understanding Risk",
    description: "Explore different types of investment risk and how to manage them effectively.",
    duration: "18 min",
    status: "in-progress",
    quizQuestions: 5
  },
  {
    id: 4,
    day: 4,
    title: "Portfolio Diversification",
    description: "Learn how to spread your investments to reduce risk and maximize returns.",
    duration: "22 min",
    status: "locked",
    quizQuestions: 4
  },
  {
    id: 5,
    day: 5,
    title: "Market Indices Explained",
    description: "Discover what market indices are and how they track market performance.",
    duration: "16 min",
    status: "locked",
    quizQuestions: 3
  },
  {
    id: 6,
    day: 6,
    title: "Dividend Investing",
    description: "Learn how companies share profits with shareholders through dividends.",
    duration: "19 min",
    status: "locked",
    quizQuestions: 4
  }
]

const lessonContent = {
  eli5: {
    title: "Explain Like I'm 5",
    content: "Imagine you and your friends want to open a lemonade stand. Instead of one person paying for everything, everyone chips in a little money. In return, each friend gets a piece of paper saying they own part of the stand. That's like a stock! When the lemonade stand makes money selling lemonade, everyone who owns a piece gets to share the profits. If the stand becomes really popular, your piece of paper becomes more valuable because other people might want to buy it from you!"
  },
  beginner: {
    title: "Beginner Level",
    content: "Investment risk refers to the possibility that your investment might lose value or not perform as expected. There are several types of risk: market risk (overall market declines), company-specific risk (individual business problems), inflation risk (purchasing power erosion), and liquidity risk (difficulty selling quickly). Understanding these risks helps you make informed decisions about where to invest your money and how to protect your portfolio from significant losses."
  },
  advanced: {
    title: "Advanced Level",
    content: "Systematic and unsystematic risk represent the two primary categories of investment risk. Systematic risk, or market risk, affects the entire market and cannot be eliminated through diversification—examples include interest rate changes, recession, and geopolitical events. Unsystematic risk is company or industry-specific and can be mitigated through proper portfolio diversification. Beta measures systematic risk exposure, while standard deviation quantifies total volatility. Modern Portfolio Theory suggests optimal asset allocation balances these risk factors against expected returns."
  }
}

export default function LearnPage() {
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(lessons[2]) // Current lesson
  const [complexityLevel, setComplexityLevel] = useState<ComplexityLevel>("beginner")

  const getStatusIcon = (status: LessonStatus) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="h-5 w-5 text-accent-green" />
      case "in-progress":
        return <PlayCircle className="h-5 w-5 text-primary" />
      case "locked":
        return <Lock className="h-5 w-5 text-muted-foreground" />
    }
  }

  const getComplexityIcon = (level: ComplexityLevel) => {
    switch (level) {
      case "eli5":
        return <Baby className="h-4 w-4" />
      case "beginner":
        return <GraduationCap className="h-4 w-4" />
      case "advanced":
        return <Rocket className="h-4 w-4" />
    }
  }

  return (
    <AppLayout>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Learning Path Timeline */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-1"
        >
          <Card className="glass-strong rounded-2xl p-6 sticky top-24">
            <h2 className="text-2xl font-bold mb-6">Your Learning Path</h2>
            
            <div className="space-y-4">
              {lessons.map((lesson, index) => (
                <motion.button
                  key={lesson.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => lesson.status !== "locked" && setSelectedLesson(lesson)}
                  disabled={lesson.status === "locked"}
                  className={cn(
                    "w-full text-left p-4 rounded-xl border transition-all",
                    lesson.status === "locked" && "opacity-50 cursor-not-allowed",
                    selectedLesson?.id === lesson.id
                      ? "border-primary bg-primary/10 shadow-lg"
                      : "border-border glass hover:shadow-md"
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-1">
                      {getStatusIcon(lesson.status)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-medium text-muted-foreground">
                          Day {lesson.day}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {lesson.duration}
                        </Badge>
                      </div>
                      <p className="font-semibold text-sm mb-1 line-clamp-1">{lesson.title}</p>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {lesson.description}
                      </p>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t border-border">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Progress</span>
                <span className="font-semibold">2 of 6 completed</span>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Lesson Content */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2 space-y-6"
        >
          {selectedLesson && (
            <>
              {/* Lesson Header */}
              <Card className="glass-strong rounded-2xl p-8">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <Badge className="mb-3">Day {selectedLesson.day}</Badge>
                    <h1 className="text-3xl md:text-4xl font-bold mb-4">
                      {selectedLesson.title}
                    </h1>
                    <p className="text-lg text-muted-foreground">
                      {selectedLesson.description}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 pt-4 border-t border-border">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>{selectedLesson.duration}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <PlayCircle className="h-4 w-4" />
                    <span>{selectedLesson.quizQuestions} quiz questions</span>
                  </div>
                </div>
              </Card>

              {/* Complexity Levels */}
              <Card className="glass-strong rounded-2xl p-8">
                <Tabs value={complexityLevel} onValueChange={(v) => setComplexityLevel(v as ComplexityLevel)}>
                  <TabsList className="grid w-full grid-cols-3 mb-6">
                    <TabsTrigger value="eli5" className="gap-2">
                      {getComplexityIcon("eli5")}
                      <span className="hidden sm:inline">ELI5</span>
                    </TabsTrigger>
                    <TabsTrigger value="beginner" className="gap-2">
                      {getComplexityIcon("beginner")}
                      <span className="hidden sm:inline">Beginner</span>
                    </TabsTrigger>
                    <TabsTrigger value="advanced" className="gap-2">
                      {getComplexityIcon("advanced")}
                      <span className="hidden sm:inline">Advanced</span>
                    </TabsTrigger>
                  </TabsList>

                  <AnimatePresence mode="wait">
                    <motion.div
                      key={complexityLevel}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                    >
                      <TabsContent value="eli5" className="space-y-4">
                        <h3 className="text-xl font-semibold flex items-center gap-2">
                          {getComplexityIcon("eli5")}
                          {lessonContent.eli5.title}
                        </h3>
                        <p className="text-muted-foreground leading-relaxed">
                          {lessonContent.eli5.content}
                        </p>
                      </TabsContent>

                      <TabsContent value="beginner" className="space-y-4">
                        <h3 className="text-xl font-semibold flex items-center gap-2">
                          {getComplexityIcon("beginner")}
                          {lessonContent.beginner.title}
                        </h3>
                        <p className="text-muted-foreground leading-relaxed">
                          {lessonContent.beginner.content}
                        </p>
                      </TabsContent>

                      <TabsContent value="advanced" className="space-y-4">
                        <h3 className="text-xl font-semibold flex items-center gap-2">
                          {getComplexityIcon("advanced")}
                          {lessonContent.advanced.title}
                        </h3>
                        <p className="text-muted-foreground leading-relaxed">
                          {lessonContent.advanced.content}
                        </p>
                      </TabsContent>
                    </motion.div>
                  </AnimatePresence>
                </Tabs>
              </Card>

              {/* Quick Quiz */}
              <Card className="glass-strong rounded-2xl p-8">
                <h3 className="text-xl font-semibold mb-4">Quick Quiz</h3>
                <p className="text-muted-foreground mb-6">
                  Test your understanding of this lesson with a short quiz.
                </p>

                <div className="space-y-4">
                  <div className="glass rounded-xl p-6">
                    <p className="font-medium mb-4">
                      What is the primary benefit of understanding investment risk?
                    </p>
                    <div className="space-y-2">
                      {[
                        "To avoid all investments",
                        "To make informed investment decisions",
                        "To guarantee profits",
                        "To eliminate all losses"
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

                  <Button className="w-full group">
                    Submit & Continue
                    <ChevronRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Button>
                </div>
              </Card>
            </>
          )}
        </motion.div>
      </div>
    </AppLayout>
  )
}
