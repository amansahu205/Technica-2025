"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { AppLayout } from "@/components/app-layout"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ChevronLeft, ChevronRight, SkipForward, TrendingUp, CheckCircle2, AlertCircle } from 'lucide-react'
import { cn } from "@/lib/utils"
import Link from "next/link"
import { useI18n } from "@/lib/i18n"

const quizQuestions = [
  {
    id: 1,
    question: "What is a stock?",
    options: [
      "A loan you give to a company",
      "Ownership share in a company",
      "A type of savings account",
      "A government bond"
    ],
    correctAnswer: 1
  },
  {
    id: 2,
    question: "What does diversification mean in investing?",
    options: [
      "Investing all money in one stock",
      "Spreading investments across different assets",
      "Only buying technology stocks",
      "Keeping all money in cash"
    ],
    correctAnswer: 1
  },
  {
    id: 3,
    question: "What is a dividend?",
    options: [
      "A stock price increase",
      "A trading fee",
      "Profit paid to shareholders",
      "A type of loan"
    ],
    correctAnswer: 2
  },
  {
    id: 4,
    question: "What does 'bull market' mean?",
    options: [
      "Market prices are falling",
      "Market prices are rising",
      "Market is closed",
      "High volatility period"
    ],
    correctAnswer: 1
  },
  {
    id: 5,
    question: "What is an index fund?",
    options: [
      "A single company stock",
      "A type of bond",
      "A fund tracking a market index",
      "A savings account"
    ],
    correctAnswer: 2
  },
  {
    id: 6,
    question: "What is compound interest?",
    options: [
      "Simple interest on principal only",
      "Interest on interest over time",
      "A type of loan",
      "A stock trading strategy"
    ],
    correctAnswer: 1
  },
  {
    id: 7,
    question: "What does P/E ratio measure?",
    options: [
      "Company debt levels",
      "Stock price relative to earnings",
      "Dividend yield",
      "Trading volume"
    ],
    correctAnswer: 1
  },
  {
    id: 8,
    question: "What is a bond?",
    options: [
      "Ownership in a company",
      "A debt investment",
      "A commodity",
      "A currency"
    ],
    correctAnswer: 1
  },
  {
    id: 9,
    question: "What is market capitalization?",
    options: [
      "Total value of company's outstanding shares",
      "Annual revenue",
      "Number of employees",
      "Trading volume"
    ],
    correctAnswer: 0
  },
  {
    id: 10,
    question: "What is dollar-cost averaging?",
    options: [
      "Selling at the highest price",
      "Investing fixed amounts regularly",
      "Day trading strategy",
      "Buying only cheap stocks"
    ],
    correctAnswer: 1
  }
]

export default function AssessmentPage() {
  const { t } = useI18n()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [answers, setAnswers] = useState<(number | null)[]>(Array(quizQuestions.length).fill(null))
  const [showResults, setShowResults] = useState(false)

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex)
    const newAnswers = [...answers]
    newAnswers[currentQuestion] = answerIndex
    setAnswers(newAnswers)
  }

  const handleNext = () => {
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setSelectedAnswer(answers[currentQuestion + 1])
    } else {
      setShowResults(true)
    }
  }

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
      setSelectedAnswer(answers[currentQuestion - 1])
    }
  }

  const handleSkip = () => {
    handleNext()
  }

  const calculateResults = () => {
    const correctCount = answers.filter((answer, index) => 
      answer === quizQuestions[index].correctAnswer
    ).length
    const percentage = (correctCount / quizQuestions.length) * 100
    
    let level = "Beginner"
    if (percentage >= 70) level = "Advanced"
    else if (percentage >= 40) level = "Intermediate"
    
    return { correctCount, percentage, level }
  }

  const progress = ((currentQuestion + 1) / quizQuestions.length) * 100

  if (showResults) {
    const results = calculateResults()
    
    return (
      <AppLayout>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto"
          role="region"
          aria-label={t('assessment.title') + ' Results'}
        >
          <Card className="glass-strong rounded-2xl p-8 md:p-12 text-center">
            <div 
              className="sr-only" 
              role="status" 
              aria-live="polite"
              aria-atomic="true"
            >
              Assessment complete. You scored {results.correctCount} out of {quizQuestions.length}. Your level is {results.level}.
            </div>
            
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="mb-8"
            >
              <div className="h-24 w-24 rounded-full bg-accent-green/20 flex items-center justify-center mx-auto mb-6">
                <TrendingUp className="h-12 w-12 text-accent-green" aria-hidden="true" />
              </div>
              <h1 className="text-4xl font-bold mb-4">Assessment Complete!</h1>
              <p className="text-xl text-muted-foreground">
                Your detected level: <span className="text-primary font-semibold">{results.level}</span>
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8" role="list" aria-label="Assessment results summary">
              <div className="glass rounded-xl p-6" role="listitem">
                <p className="text-3xl font-bold text-accent-green">{results.correctCount}/{quizQuestions.length}</p>
                <p className="text-sm text-muted-foreground mt-2">Correct Answers</p>
              </div>
              <div className="glass rounded-xl p-6" role="listitem">
                <p className="text-3xl font-bold text-primary">{Math.round(results.percentage)}%</p>
                <p className="text-sm text-muted-foreground mt-2">Accuracy</p>
              </div>
              <div className="glass rounded-xl p-6" role="listitem">
                <p className="text-3xl font-bold text-chart-3">{results.level}</p>
                <p className="text-sm text-muted-foreground mt-2">Your Level</p>
              </div>
            </div>

            <div className="space-y-6 mb-8 text-left">
              <section className="glass rounded-xl p-6" aria-labelledby="strengths-heading">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-6 w-6 text-accent-green flex-shrink-0 mt-1" aria-hidden="true" />
                  <div>
                    <h2 id="strengths-heading" className="font-semibold mb-2">Key Strengths</h2>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>Understanding of basic investment concepts</li>
                      <li>Knowledge of market terminology</li>
                      <li>Grasp of risk management principles</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section className="glass rounded-xl p-6" aria-labelledby="gaps-heading">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-6 w-6 text-chart-4 flex-shrink-0 mt-1" aria-hidden="true" />
                  <div>
                    <h2 id="gaps-heading" className="font-semibold mb-2">Knowledge Gaps</h2>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>Advanced portfolio strategies</li>
                      <li>Technical analysis fundamentals</li>
                      <li>Options and derivatives basics</li>
                    </ul>
                  </div>
                </div>
              </section>
            </div>

            <Link href="/learn">
              <Button size="lg" className="group">
                Generate My Learning Path
                <ChevronRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </Button>
            </Link>
          </Card>
        </motion.div>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto" role="main" aria-label={t('assessment.title')}>
        {/* Progress Bar */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium" id="question-progress">
              {t('assessment.question')} {currentQuestion + 1} {t('assessment.of')} {quizQuestions.length}
            </span>
            <span className="text-sm text-muted-foreground">
              {Math.round(progress)}% Complete
            </span>
          </div>
          <Progress 
            value={progress} 
            className="h-2" 
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(progress)}
            aria-labelledby="question-progress"
          />
        </motion.div>

        {/* Question Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="glass-strong rounded-2xl p-8 md:p-12 mb-6">
              <fieldset>
                <legend className="text-2xl md:text-3xl font-bold mb-8 text-balance">
                  {quizQuestions[currentQuestion].question}
                </legend>

                <div 
                  className="space-y-4" 
                  role="radiogroup" 
                  aria-label={quizQuestions[currentQuestion].question}
                >
                  {quizQuestions[currentQuestion].options.map((option, index) => (
                    <motion.button
                      key={index}
                      type="button"
                      role="radio"
                      aria-checked={selectedAnswer === index}
                      tabIndex={selectedAnswer === index ? 0 : -1}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleAnswerSelect(index)}
                      onKeyDown={(e) => {
                        if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
                          e.preventDefault()
                          const nextIndex = (index + 1) % quizQuestions[currentQuestion].options.length
                          handleAnswerSelect(nextIndex)
                        } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
                          e.preventDefault()
                          const prevIndex = index === 0 ? quizQuestions[currentQuestion].options.length - 1 : index - 1
                          handleAnswerSelect(prevIndex)
                        } else if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault()
                          handleAnswerSelect(index)
                        }
                      }}
                      className={cn(
                        "w-full text-left p-6 rounded-xl border-2 transition-all",
                        "hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                        selectedAnswer === index
                          ? "border-primary bg-primary/10 shadow-lg"
                          : "border-border glass"
                      )}
                    >
                      <div className="flex items-center gap-4">
                        <div className={cn(
                          "h-6 w-6 rounded-full border-2 flex items-center justify-center flex-shrink-0",
                          selectedAnswer === index
                            ? "border-primary bg-primary"
                            : "border-muted-foreground"
                        )} aria-hidden="true">
                          {selectedAnswer === index && (
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
              </fieldset>
            </Card>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <nav className="flex items-center justify-between gap-4" aria-label="Quiz navigation">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentQuestion === 0}
            className="glass"
            aria-label={`${t('assessment.back')} to previous question`}
          >
            <ChevronLeft className="mr-2 h-5 w-5" aria-hidden="true" />
            {t('assessment.back')}
          </Button>

          <Button
            variant="ghost"
            onClick={handleSkip}
            className="glass"
            aria-label={`${t('assessment.skip')} this question`}
          >
            <SkipForward className="mr-2 h-4 w-4" aria-hidden="true" />
            {t('assessment.skip')}
          </Button>

          <Button
            onClick={handleNext}
            disabled={selectedAnswer === null}
            aria-label={currentQuestion === quizQuestions.length - 1 ? t('assessment.finish') : `${t('assessment.next')} question`}
          >
            {currentQuestion === quizQuestions.length - 1 ? t('assessment.finish') : t('assessment.next')}
            <ChevronRight className="ml-2 h-5 w-5" aria-hidden="true" />
          </Button>
        </nav>
      </div>
    </AppLayout>
  )
}
