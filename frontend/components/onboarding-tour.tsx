"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { X, ChevronRight, ChevronLeft } from 'lucide-react'
import { useUser } from "@/lib/user-context"

const tourSteps = [
  {
    target: "nav",
    title: "Welcome to InvestIQ!",
    description: "Navigate between Dashboard, Learn, Simulator, and Market Insights using this menu.",
    position: "bottom"
  },
  {
    target: "assessment",
    title: "Start Your Journey",
    description: "Take the smart assessment to personalize your learning path based on your current knowledge.",
    position: "bottom"
  },
  {
    target: "learning",
    title: "Learn at Your Pace",
    description: "Access personalized lessons with complexity levels from ELI5 to Advanced.",
    position: "top"
  },
  {
    target: "simulator",
    title: "Practice Safely",
    description: "Try different investment strategies in our interactive simulator before risking real money.",
    position: "top"
  },
  {
    target: "insights",
    title: "Stay Informed",
    description: "Get plain-English explanations of market news and economic events.",
    position: "top"
  }
]

export function OnboardingTour() {
  const [currentStep, setCurrentStep] = useState(0)
  const [isActive, setIsActive] = useState(false)
  const [position, setPosition] = useState({ top: 0, left: 0 })
  const { onboardingComplete, setOnboardingComplete } = useUser()

  useEffect(() => {
    if (!onboardingComplete) {
      setIsActive(true)
    }
  }, [onboardingComplete])

  useEffect(() => {
    if (!isActive) return

    const updatePosition = () => {
      const target = tourSteps[currentStep].target
      const element = document.querySelector(`[data-tour="${target}"]`) || document.querySelector("nav")
      
      if (element) {
        const rect = element.getBoundingClientRect()
        const tooltipPosition = tourSteps[currentStep].position
        
        setPosition({
          top: tooltipPosition === "bottom" ? rect.bottom + 16 : rect.top - 180,
          left: rect.left + rect.width / 2
        })
      }
    }

    updatePosition()
    window.addEventListener("resize", updatePosition)
    return () => window.removeEventListener("resize", updatePosition)
  }, [currentStep, isActive])

  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      handleComplete()
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleComplete = () => {
    setOnboardingComplete(true)
    setIsActive(false)
  }

  if (!isActive) return null

  return (
    <>
      {/* Overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
        onClick={handleComplete}
      />

      {/* Tooltip */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.3 }}
          style={{
            position: "fixed",
            top: position.top,
            left: position.left,
            transform: "translateX(-50%)"
          }}
          className="z-50 w-80"
        >
          <Card className="glass-strong rounded-2xl p-6 shadow-2xl">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-semibold text-lg mb-2">{tourSteps[currentStep].title}</h3>
                <p className="text-sm text-muted-foreground">
                  {tourSteps[currentStep].description}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleComplete}
                className="h-8 w-8 -mt-2 -mr-2"
                aria-label="Close tour"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex items-center justify-between mt-6">
              <div className="flex gap-1">
                {tourSteps.map((_, i) => (
                  <div
                    key={i}
                    className={`h-1.5 w-8 rounded-full transition-colors ${
                      i === currentStep ? "bg-primary" : "bg-muted"
                    }`}
                  />
                ))}
              </div>

              <div className="flex gap-2">
                {currentStep > 0 && (
                  <Button variant="outline" size="sm" onClick={handleBack} className="glass">
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Back
                  </Button>
                )}
                <Button size="sm" onClick={handleNext}>
                  {currentStep < tourSteps.length - 1 ? (
                    <>
                      Next
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </>
                  ) : (
                    "Got it!"
                  )}
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      </AnimatePresence>
    </>
  )
}
