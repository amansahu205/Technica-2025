'use client'

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { AppLayout } from "@/components/app-layout"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Brain, CheckCircle, XCircle, TrendingUp, TrendingDown, Sparkles, BarChart3, Target, Award } from 'lucide-react'
import { cn } from "@/lib/utils"
import Link from "next/link"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Scatter, ScatterChart, ZAxis } from "recharts"

type QuizState = 'start' | 'quiz' | 'feedback' | 'results'

interface Question {
  id: string
  question: string
  options: string[]
  difficulty: number
}

interface FeedbackData {
  isCorrect: boolean
  correctAnswer: string
  explanation: string
  levelChange: number
}

interface QuizResults {
  finalScore: number
  finalTier: string
  totalQuestions: number
  correctAnswers: number
  accuracy: number
  progression: Array<{ questionNumber: number; level: number; isCorrect: boolean; difficulty: number }>
  difficultyBreakdown: {
    easy: { attempted: number; correct: number }
    medium: { attempted: number; correct: number }
    hard: { attempted: number; correct: number }
  }
}

export default function AdaptiveQuizPage() {
  const [quizState, setQuizState] = useState<QuizState>('start')
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null)
  const [questionNumber, setQuestionNumber] = useState(1)
  const [currentLevel, setCurrentLevel] = useState(1.5)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [feedback, setFeedback] = useState<FeedbackData | null>(null)
  const [results, setResults] = useState<QuizResults | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const startQuiz = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/assessment-adaptive/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: 'user-' + Date.now() })
      })
      const data = await response.json()
      
      setSessionId(data.sessionId)
      setCurrentQuestion(data.question)
      setQuestionNumber(data.questionNumber)
      setCurrentLevel(data.currentLevel)
      setQuizState('quiz')
    } catch (error) {
      console.error('[v0] Error starting quiz:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const submitAnswer = async () => {
    if (!selectedAnswer || !sessionId || !currentQuestion) return
    
    setIsLoading(true)
    try {
      const response = await fetch('/api/assessment-adaptive/answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          questionId: currentQuestion.id,
          userAnswer: selectedAnswer
        })
      })
      const data = await response.json()
      
      setFeedback({
        isCorrect: data.isCorrect,
        correctAnswer: data.correctAnswer,
        explanation: data.explanation,
        levelChange: data.levelChange || 0
      })
      
      if (data.quizComplete) {
        setResults(data.results)
      } else {
        setCurrentQuestion(data.nextQuestion)
        setQuestionNumber(data.questionNumber)
        setCurrentLevel(data.currentLevel)
      }
      
      setQuizState('feedback')
    } catch (error) {
      console.error('[v0] Error submitting answer:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const nextQuestion = () => {
    if (results) {
      setQuizState('results')
    } else {
      setSelectedAnswer(null)
      setFeedback(null)
      setQuizState('quiz')
    }
  }

  const getLevelTier = (level: number) => {
    if (level < 1.7) return { tier: 'Beginner', color: 'text-chart-2' }
    if (level < 2.3) return { tier: 'Intermediate', color: 'text-chart-3' }
    return { tier: 'Advanced', color: 'text-chart-4' }
  }

  const tierInfo = getLevelTier(currentLevel)

  // Start Screen
  if (quizState === 'start') {
    return (
      <AppLayout>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          <div className="text-center mb-12">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-primary/20 mb-6"
            >
              <Brain className="h-10 w-10 text-primary" />
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-balance">
              Investment Knowledge Assessment
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
              Adaptive quiz that adjusts to your skill level in real-time
            </p>
          </div>

          <Card className="glass-strong rounded-2xl p-8 md:p-12 mb-8">
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="text-center p-6 glass rounded-xl">
                <Target className="h-8 w-8 text-primary mx-auto mb-3" />
                <h3 className="font-semibold mb-2">10 Personalized Questions</h3>
                <p className="text-sm text-muted-foreground">Tailored to your knowledge level</p>
              </div>
              <div className="text-center p-6 glass rounded-xl">
                <Sparkles className="h-8 w-8 text-accent-green mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Adaptive Difficulty</h3>
                <p className="text-sm text-muted-foreground">Questions adjust based on performance</p>
              </div>
              <div className="text-center p-6 glass rounded-xl">
                <BarChart3 className="h-8 w-8 text-chart-3 mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Real-Time Tracking</h3>
                <p className="text-sm text-muted-foreground">See your skill level evolve</p>
              </div>
            </div>

            <Button
              size="lg"
              onClick={startQuiz}
              disabled={isLoading}
              className="w-full group"
            >
              {isLoading ? 'Starting...' : 'Start Quiz'}
              <Sparkles className="ml-2 h-5 w-5 transition-transform group-hover:rotate-12" />
            </Button>
          </Card>

          <div className="text-center text-sm text-muted-foreground">
            <p>Takes approximately 5-7 minutes • Personalized learning path generated after completion</p>
          </div>
        </motion.div>
      </AppLayout>
    )
  }

  // Feedback Screen
  if (quizState === 'feedback' && feedback) {
    return (
      <AppLayout>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-3xl mx-auto"
        >
          <Card className="glass-strong rounded-2xl p-8 md:p-12">
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
                className={cn(
                  "inline-flex items-center justify-center h-20 w-20 rounded-full mb-6",
                  feedback.isCorrect ? "bg-accent-green/20" : "bg-destructive/20"
                )}
              >
                {feedback.isCorrect ? (
                  <CheckCircle className="h-10 w-10 text-accent-green" />
                ) : (
                  <XCircle className="h-10 w-10 text-destructive" />
                )}
              </motion.div>
              <h2 className="text-3xl font-bold mb-2">
                {feedback.isCorrect ? 'Correct!' : 'Incorrect'}
              </h2>
              <p className="text-muted-foreground">
                {feedback.isCorrect ? 'Well done!' : `The correct answer is: ${feedback.correctAnswer}`}
              </p>
            </div>

            <div className="glass rounded-xl p-6 mb-6">
              <h3 className="font-semibold mb-2">Explanation</h3>
              <p className="text-muted-foreground">{feedback.explanation}</p>
            </div>

            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-1">Level Change</p>
                <div className={cn(
                  "text-2xl font-bold flex items-center gap-2",
                  feedback.levelChange > 0 ? "text-accent-green" : "text-destructive"
                )}>
                  {feedback.levelChange > 0 ? (
                    <TrendingUp className="h-6 w-6" />
                  ) : (
                    <TrendingDown className="h-6 w-6" />
                  )}
                  {feedback.levelChange > 0 ? '+' : ''}{feedback.levelChange.toFixed(1)}
                </div>
              </div>
              <div className="h-16 w-px bg-border" />
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-1">Current Level</p>
                <p className="text-2xl font-bold text-primary">{currentLevel.toFixed(1)}</p>
              </div>
            </div>

            <Button
              size="lg"
              onClick={nextQuestion}
              className="w-full"
            >
              {results ? 'View Results' : 'Next Question'}
            </Button>
          </Card>
        </motion.div>
      </AppLayout>
    )
  }

  // Results Screen
  if (quizState === 'results' && results) {
    return (
      <AppLayout>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-5xl mx-auto"
        >
          <Card className="glass-strong rounded-2xl p-8 md:p-12">
            <div className="text-center mb-12">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="inline-flex items-center justify-center h-24 w-24 rounded-full bg-primary/20 mb-6"
              >
                <Award className="h-12 w-12 text-primary" />
              </motion.div>
              <h1 className="text-4xl font-bold mb-4">Assessment Complete!</h1>
              <div className="inline-flex items-center gap-3 px-6 py-3 glass rounded-full">
                <span className="text-lg font-semibold">{results.finalTier}</span>
                <span className="text-3xl font-bold text-primary">{results.finalScore.toFixed(1)}</span>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
              <div className="glass rounded-xl p-6 text-center">
                <p className="text-sm text-muted-foreground mb-2">Total Questions</p>
                <p className="text-4xl font-bold">{results.totalQuestions}</p>
              </div>
              <div className="glass rounded-xl p-6 text-center">
                <p className="text-sm text-muted-foreground mb-2">Correct Answers</p>
                <p className="text-4xl font-bold text-accent-green">{results.correctAnswers}</p>
              </div>
              <div className="glass rounded-xl p-6 text-center">
                <p className="text-sm text-muted-foreground mb-2">Accuracy</p>
                <p className="text-4xl font-bold text-primary">{results.accuracy}%</p>
              </div>
            </div>

            {/* Progression Graph */}
            <div className="glass rounded-xl p-6 mb-8">
              <h2 className="text-xl font-semibold mb-6">Your Learning Journey</h2>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={results.progression}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis 
                      dataKey="questionNumber" 
                      label={{ value: 'Question Number', position: 'insideBottom', offset: -5 }}
                      stroke="hsl(var(--muted-foreground))"
                    />
                    <YAxis 
                      domain={[1, 3]} 
                      label={{ value: 'Skill Level', angle: -90, position: 'insideLeft' }}
                      stroke="hsl(var(--muted-foreground))"
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '0.5rem'
                      }}
                      labelFormatter={(value) => `Question ${value}`}
                      formatter={(value: any) => [value.toFixed(2), 'Level']}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="level" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={3}
                      dot={(props: any) => {
                        const { cx, cy, payload } = props
                        return (
                          <circle
                            cx={cx}
                            cy={cy}
                            r={6}
                            fill={payload.isCorrect ? 'hsl(var(--accent-green))' : 'hsl(var(--destructive))'}
                            stroke="hsl(var(--background))"
                            strokeWidth={2}
                          />
                        )
                      }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="flex items-center justify-center gap-6 mt-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-accent-green" />
                  <span className="text-muted-foreground">Correct</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-destructive" />
                  <span className="text-muted-foreground">Incorrect</span>
                </div>
              </div>
            </div>

            {/* Difficulty Breakdown */}
            <div className="glass rounded-xl p-6 mb-8">
              <h2 className="text-xl font-semibold mb-6">Performance by Difficulty</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 glass rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-accent-green">Easy</h3>
                    <span className="text-sm text-muted-foreground">
                      {results.difficultyBreakdown.easy.correct}/{results.difficultyBreakdown.easy.attempted}
                    </span>
                  </div>
                  <Progress 
                    value={(results.difficultyBreakdown.easy.correct / results.difficultyBreakdown.easy.attempted) * 100 || 0} 
                    className="h-2"
                  />
                </div>
                <div className="p-4 glass rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-chart-3">Medium</h3>
                    <span className="text-sm text-muted-foreground">
                      {results.difficultyBreakdown.medium.correct}/{results.difficultyBreakdown.medium.attempted}
                    </span>
                  </div>
                  <Progress 
                    value={(results.difficultyBreakdown.medium.correct / results.difficultyBreakdown.medium.attempted) * 100 || 0} 
                    className="h-2"
                  />
                </div>
                <div className="p-4 glass rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-destructive">Hard</h3>
                    <span className="text-sm text-muted-foreground">
                      {results.difficultyBreakdown.hard.correct}/{results.difficultyBreakdown.hard.attempted}
                    </span>
                  </div>
                  <Progress 
                    value={(results.difficultyBreakdown.hard.correct / results.difficultyBreakdown.hard.attempted) * 100 || 0} 
                    className="h-2"
                  />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                variant="outline"
                onClick={() => window.location.reload()}
                className="flex-1 glass"
              >
                Retake Quiz
              </Button>
              <Link href="/learn" className="flex-1">
                <Button className="w-full">
                  View Learning Path
                </Button>
              </Link>
            </div>
          </Card>
        </motion.div>
      </AppLayout>
    )
  }

  // Quiz Screen
  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto">
        {/* Progress Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium">
              Question {questionNumber} of 10
            </span>
            <div className="flex items-center gap-3">
              <span className={cn("text-sm font-semibold", tierInfo.color)}>
                {tierInfo.tier}
              </span>
              <span className="text-sm font-mono font-bold text-primary">
                {currentLevel.toFixed(1)}
              </span>
            </div>
          </div>
          <Progress value={(questionNumber / 10) * 100} className="h-2" />
        </motion.div>

        {/* Question Card */}
        {currentQuestion && (
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestion.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Card className="glass-strong rounded-2xl p-8 md:p-12 mb-6">
                <div className="mb-8">
                  <div className="inline-flex px-3 py-1 rounded-full text-xs font-semibold mb-4 glass">
                    Difficulty: {currentQuestion.difficulty === 1 ? 'Easy' : currentQuestion.difficulty === 2 ? 'Medium' : 'Hard'}
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-balance">
                    {currentQuestion.question}
                  </h2>
                </div>

                <div className="space-y-3">
                  {currentQuestion.options.map((option, index) => (
                    <motion.button
                      key={index}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedAnswer(option)}
                      className={cn(
                        "w-full text-left p-6 rounded-xl border-2 transition-all",
                        "hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary",
                        selectedAnswer === option
                          ? "border-primary bg-primary/10 shadow-lg"
                          : "border-border glass"
                      )}
                    >
                      <div className="flex items-center gap-4">
                        <div className={cn(
                          "h-6 w-6 rounded-full border-2 flex items-center justify-center flex-shrink-0",
                          selectedAnswer === option
                            ? "border-primary bg-primary"
                            : "border-muted-foreground"
                        )}>
                          {selectedAnswer === option && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="h-3 w-3 rounded-full bg-primary-foreground"
                            />
                          )}
                        </div>
                        <span className="text-lg">{option}</span>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </Card>

              <div className="flex justify-end">
                <Button
                  size="lg"
                  onClick={submitAnswer}
                  disabled={!selectedAnswer || isLoading}
                >
                  {isLoading ? 'Submitting...' : 'Submit Answer'}
                </Button>
              </div>
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </AppLayout>
  )
}
