"use client"

import { useEffect } from "react"
import { useRouter } from 'next/navigation'
import { motion } from "framer-motion"
import { AppLayout } from "@/components/app-layout"
import { OnboardingTour } from "@/components/onboarding-tour"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ArrowRight, Play, BookOpen, LineChart, Newspaper, Trophy, Target, Clock } from 'lucide-react'
import Link from "next/link"
import { useI18n } from "@/lib/i18n"
import { useUser } from "@/lib/user-context"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 }
  }
}

export default function DashboardPage() {
  const { t } = useI18n()
  const { name, onboardingComplete, isAuthenticated } = useUser()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, router])

  if (!isAuthenticated) {
    return null
  }

  return (
    <AppLayout>
      {!onboardingComplete && <OnboardingTour />}
      
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-8"
        role="main"
        aria-label="Dashboard"
      >
        {/* Hero Section */}
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
              {name ? (
                <>
                  {t('dashboard.welcome')}, {name}!{" "}
                  <span className="bg-gradient-to-r from-primary to-accent-green bg-clip-text text-transparent">
                    Continue Learning
                  </span>
                </>
              ) : (
                <>
                  Master Investing with{" "}
                  <span className="bg-gradient-to-r from-primary to-accent-green bg-clip-text text-transparent">
                    AI-Powered Learning
                  </span>
                </>
              )}
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto text-balance">
              Personalized lessons, interactive simulations, and real-time market insights tailored to your learning style
            </p>
          </motion.div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4" data-tour="assessment">
            <Link href="/assessment">
              <Button size="lg" className="group transition-all hover:scale-105 shadow-lg">
                Start Assessment
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                <span className="sr-only">to assess your knowledge level</span>
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="glass group transition-all hover:scale-105">
              <Play className="mr-2 h-5 w-5" aria-hidden="true" />
              Watch Demo
            </Button>
          </div>
        </motion.section>

        {/* Progress Card */}
        <motion.div variants={itemVariants}>
          <Card 
            className="glass-strong rounded-2xl p-6 md:p-8 hover:shadow-xl transition-shadow" 
            role="region" 
            aria-labelledby="progress-heading"
          >
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 id="progress-heading" className="text-2xl font-bold mb-2">
                  {t('dashboard.level')}
                </h2>
                <div className="flex items-center gap-2">
                  <span className="text-sm px-3 py-1 rounded-full bg-primary/20 text-primary font-medium">
                    Beginner
                  </span>
                  <Trophy className="h-4 w-4 text-accent-green" aria-hidden="true" />
                </div>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-primary" aria-label="64 percent overall mastery">64%</p>
                <p className="text-sm text-muted-foreground">Overall Mastery</p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Progress to Intermediate</span>
                <span className="font-medium">8/12 lessons</span>
              </div>
              <Progress 
                value={64} 
                className="h-3" 
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={64}
                aria-label="Progress to intermediate level"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6" role="list" aria-label="Learning statistics">
              <div className="glass rounded-xl p-4 space-y-1" role="listitem">
                <p className="text-2xl font-bold">24</p>
                <p className="text-sm text-muted-foreground">Lessons Completed</p>
              </div>
              <div className="glass rounded-xl p-4 space-y-1" role="listitem">
                <p className="text-2xl font-bold">12</p>
                <p className="text-sm text-muted-foreground">Quizzes Passed</p>
              </div>
              <div className="glass rounded-xl p-4 space-y-1" role="listitem">
                <p className="text-2xl font-bold">5</p>
                <p className="text-sm text-muted-foreground">Simulations Run</p>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Next Up Section */}
        <motion.div variants={itemVariants} className="space-y-4" role="region" aria-labelledby="next-up-heading">
          <h2 id="next-up-heading" className="text-2xl font-bold">Next Up</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4" role="list">
            {/* Today's Lesson */}
            <Link href="/learn" className="focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-2xl">
              <Card 
                className="glass-strong rounded-2xl p-6 hover:shadow-xl transition-all hover:scale-[1.02] group cursor-pointer h-full" 
                data-tour="learning"
                role="listitem"
                tabIndex={-1}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="h-12 w-12 rounded-xl bg-primary/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <BookOpen className="h-6 w-6 text-primary" aria-hidden="true" />
                  </div>
                  <span className="text-xs px-2 py-1 rounded-full bg-accent-green/20 text-accent-green font-medium">
                    New
                  </span>
                </div>
                <h3 className="font-semibold mb-2">Understanding Dividends</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Learn how companies share profits with shareholders
                </p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" aria-hidden="true" />
                  <span>15 min</span>
                </div>
              </Card>
            </Link>

            {/* Simulator Activity */}
            <Link href="/simulate" className="focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-2xl">
              <Card 
                className="glass-strong rounded-2xl p-6 hover:shadow-xl transition-all hover:scale-[1.02] group cursor-pointer h-full" 
                data-tour="simulator"
                role="listitem"
                tabIndex={-1}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="h-12 w-12 rounded-xl bg-accent-green/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <LineChart className="h-6 w-6 text-accent-green" aria-hidden="true" />
                  </div>
                  <span className="text-xs px-2 py-1 rounded-full bg-primary/20 text-primary font-medium">
                    Practice
                  </span>
                </div>
                <h3 className="font-semibold mb-2">Portfolio Rebalancing</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Adjust your allocation based on market changes
                </p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Target className="h-4 w-4" aria-hidden="true" />
                  <span>Interactive</span>
                </div>
              </Card>
            </Link>

            {/* Market Insight */}
            <Link href="/insights" className="focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-2xl">
              <Card 
                className="glass-strong rounded-2xl p-6 hover:shadow-xl transition-all hover:scale-[1.02] group cursor-pointer h-full" 
                data-tour="insights"
                role="listitem"
                tabIndex={-1}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="h-12 w-12 rounded-xl bg-chart-3/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Newspaper className="h-6 w-6 text-chart-3" aria-hidden="true" />
                  </div>
                  <span className="text-xs px-2 py-1 rounded-full bg-destructive/20 text-destructive font-medium">
                    Live
                  </span>
                </div>
                <h3 className="font-semibold mb-2">Fed Rate Decision</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  How interest rates affect your investments
                </p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" aria-hidden="true" />
                  <span>5 min read</span>
                </div>
              </Card>
            </Link>
          </div>
        </motion.div>

        {/* Quick Stats */}
        <motion.div variants={itemVariants}>
          <Card className="glass-strong rounded-2xl p-6 md:p-8">
            <h2 className="text-2xl font-bold mb-6">Learning Streak</h2>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-4xl font-bold text-accent-green">7 Days</p>
                <p className="text-sm text-muted-foreground mt-1">Keep it up!</p>
              </div>
              <div className="flex gap-2">
                {[...Array(7)].map((_, i) => (
                  <div
                    key={i}
                    className="h-10 w-10 rounded-lg bg-accent-green/20 flex items-center justify-center"
                  >
                    <span className="text-accent-green font-bold text-sm">{i + 1}</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </motion.div>
      </motion.div>
    </AppLayout>
  )
}
