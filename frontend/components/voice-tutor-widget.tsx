"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Mic, Play, Pause, X, MessageSquare } from 'lucide-react'
import { cn } from "@/lib/utils"
import { useAccessibility } from "@/lib/accessibility-context"

export function VoiceTutorWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [transcript, setTranscript] = useState<{ user: string; tutor: string } | null>(null)
  const { settings } = useAccessibility()

  useEffect(() => {
    if (settings.voiceFirst || settings.audioFirst) {
      setIsOpen(true)
      
      // Announce voice-first mode to screen readers
      if (settings.voiceFirst) {
        const announcement = document.createElement('div')
        announcement.setAttribute('role', 'status')
        announcement.setAttribute('aria-live', 'polite')
        announcement.className = 'sr-only'
        announcement.textContent = 'Voice-first mode enabled. Voice tutor is ready for your questions.'
        document.body.appendChild(announcement)
        
        setTimeout(() => {
          document.body.removeChild(announcement)
        }, 3000)
      }
      
      // Auto-focus mic button for audioFirst mode
      if (settings.audioFirst) {
        setTimeout(() => {
          const micButton = document.querySelector('[aria-label="Start listening"]') as HTMLButtonElement
          if (micButton) {
            micButton.focus()
          }
        }, 500)
      }
    }
  }, [settings.voiceFirst, settings.audioFirst])

  useEffect(() => {
    if (settings.audioFirst && transcript && !isSpeaking) {
      setTimeout(() => {
        setIsSpeaking(true)
        setTimeout(() => setIsSpeaking(false), 3000)
      }, 500)
    }
  }, [transcript, settings.audioFirst, isSpeaking])

  const handleMicClick = () => {
    setIsListening(!isListening)
    if (!isListening) {
      // Simulate listening
      setTimeout(() => {
        setIsListening(false)
        setTranscript({
          user: "What is a stock market index?",
          tutor: "A stock market index tracks the performance of a group of stocks, like the S&P 500 which measures 500 large US companies."
        })
      }, 2000)
    }
  }

  const handlePlayPause = () => {
    setIsSpeaking(!isSpeaking)
    if (!isSpeaking) {
      setTimeout(() => setIsSpeaking(false), 3000)
    }
  }

  const shouldReduce = settings.reducedAnimations
  const motionConfig = shouldReduce ? { duration: 0 } : { duration: 0.4 }

  return (
    <>
      {/* Floating Button */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ 
          scale: 1, 
          opacity: 1,
          ...(settings.voiceFirst && { scale: 1.2 })
        }}
        transition={{ delay: shouldReduce ? 0 : 1, ...motionConfig }}
        className="fixed bottom-6 right-6 z-50"
      >
        <Button
          size="icon"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? "Close voice tutor" : "Open voice tutor"}
          aria-expanded={isOpen}
          aria-controls="voice-tutor-panel"
          className={cn(
            settings.voiceFirst ? "h-16 w-16" : "h-14 w-14",
            "rounded-full shadow-lg transition-all hover:scale-110",
            "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
            isOpen ? "bg-destructive hover:bg-destructive/90" : "bg-primary hover:bg-primary/90",
            settings.voiceFirst && "ring-4 ring-primary/50 animate-pulse"
          )}
        >
          {isOpen ? (
            <X className={cn(settings.voiceFirst ? "h-8 w-8" : "h-6 w-6")} aria-hidden="true" />
          ) : (
            <MessageSquare className={cn(settings.voiceFirst ? "h-8 w-8" : "h-6 w-6")} aria-hidden="true" />
          )}
        </Button>
        {settings.voiceFirst && !isOpen && (
          <div className="absolute bottom-full right-0 mb-2 w-48 p-2 rounded-lg bg-primary text-primary-foreground text-xs text-center shadow-lg">
            Press to ask: "What should I learn next?"
          </div>
        )}
      </motion.div>

      {/* Widget Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={motionConfig}
            className={cn(
              "fixed bottom-24 right-6 z-50",
              settings.voiceFirst ? "w-full max-w-md" : "w-80 md:w-96"
            )}
            id="voice-tutor-panel"
            role="dialog"
            aria-label="Voice tutor"
            aria-modal="false"
          >
            <Card className="glass-strong rounded-2xl shadow-2xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold" id="voice-tutor-title">
                  Voice Tutor
                </h3>
                <div 
                  className={cn(
                    "h-2 w-2 rounded-full",
                    isListening ? "bg-destructive animate-pulse" : isSpeaking ? "bg-accent-green animate-pulse" : "bg-muted"
                  )}
                  role="status"
                  aria-label={isListening ? "Listening" : isSpeaking ? "Speaking" : "Idle"}
                />
              </div>

              {/* Transcript */}
              {transcript && (
                <div 
                  className="space-y-3 text-sm" 
                  role="log" 
                  aria-live="polite"
                  aria-atomic="false"
                >
                  <div className="rounded-lg bg-secondary/50 p-3">
                    <p className="font-medium text-secondary-foreground mb-1">You asked:</p>
                    <p className="text-muted-foreground">{transcript.user}</p>
                  </div>
                  <div className="rounded-lg bg-primary/10 p-3">
                    <p className="font-medium text-primary mb-1">Tutor replied:</p>
                    <p className="text-foreground">{transcript.tutor}</p>
                  </div>
                </div>
              )}

              {/* Controls */}
              <div className="flex items-center justify-center gap-4 pt-2" role="group" aria-label="Voice tutor controls">
                <Button
                  size="icon"
                  variant={isListening ? "destructive" : "default"}
                  onClick={handleMicClick}
                  aria-label={isListening ? "Stop listening" : "Start listening"}
                  aria-pressed={isListening}
                  className={cn(
                    "h-12 w-12 rounded-full transition-all",
                    "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                    isListening && "animate-pulse scale-110"
                  )}
                >
                  <Mic className="h-5 w-5" aria-hidden="true" />
                </Button>
                
                {transcript && (
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={handlePlayPause}
                    aria-label={isSpeaking ? "Pause playback" : "Play audio"}
                    aria-pressed={isSpeaking}
                    className="h-12 w-12 rounded-full glass focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                  >
                    {isSpeaking ? (
                      <Pause className="h-5 w-5" aria-hidden="true" />
                    ) : (
                      <Play className="h-5 w-5" aria-hidden="true" />
                    )}
                  </Button>
                )}
              </div>

              <p 
                className="text-xs text-center text-muted-foreground"
                role="status"
                aria-live="polite"
              >
                {isListening ? "Listening..." : isSpeaking ? "Playing audio..." : "Click the mic to ask a question"}
              </p>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
