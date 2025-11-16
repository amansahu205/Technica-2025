"use client"

import * as React from "react"
import { motion, HTMLMotionProps } from "framer-motion"
import { Card, CardProps } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { useAccessibility } from "@/lib/accessibility-context"

export interface AnimatedCardProps extends Omit<CardProps, 'children'> {
  children: React.ReactNode
  delay?: number
  hover?: boolean
}

const AnimatedCard = React.forwardRef<HTMLDivElement, AnimatedCardProps>(
  ({ className, children, delay = 0, hover = true, ...props }, ref) => {
    const { settings } = useAccessibility()
    const shouldReduce = settings.reducedAnimations
    
    const motionConfig = shouldReduce ? { duration: 0 } : { duration: 0.5 }
    const hoverScale = hover && !shouldReduce ? 1.02 : 1

    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...motionConfig, delay: shouldReduce ? 0 : delay }}
        whileHover={{ scale: hoverScale }}
        className={cn(className)}
      >
        <Card className="h-full" {...props}>
          {children}
        </Card>
      </motion.div>
    )
  }
)
AnimatedCard.displayName = "AnimatedCard"

export { AnimatedCard }
