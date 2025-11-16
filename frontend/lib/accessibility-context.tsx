'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'

interface AccessibilitySettings {
  highContrast: boolean
  dyslexiaFont: boolean
  voiceFirst: boolean
  reducedAnimations: boolean
  largerText: boolean
  screenReaderFriendly: boolean
  audioFirst: boolean
  minimalVisuals: boolean
}

interface UserProfile {
  name: string
  region: string
  familiarity: string
  learningPreferences: string[]
  accessibilityPreferences: string[]
}

interface AccessibilityContextType {
  settings: AccessibilitySettings
  updateSettings: (newSettings: Partial<AccessibilitySettings>) => void
  userProfile: UserProfile | null
  setUserProfile: (profile: UserProfile) => void
  isAuthenticated: boolean
  setIsAuthenticated: (value: boolean) => void
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined)

export function AccessibilityProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<AccessibilitySettings>({
    highContrast: false,
    dyslexiaFont: false,
    voiceFirst: false,
    reducedAnimations: false,
    largerText: false,
    screenReaderFriendly: false,
    audioFirst: false,
    minimalVisuals: false,
  })

  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Load settings from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('accessibility-settings')
    if (stored) {
      try {
        setSettings(JSON.parse(stored))
      } catch (e) {
        console.error('Failed to parse accessibility settings')
      }
    }

    const storedProfile = localStorage.getItem('user-profile')
    if (storedProfile) {
      try {
        setUserProfile(JSON.parse(storedProfile))
        setIsAuthenticated(true)
      } catch (e) {
        console.error('Failed to parse user profile')
      }
    }

    // Check for system preference for reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) {
      setSettings((prev) => ({ ...prev, reducedAnimations: true }))
    }
  }, [])

  // Save settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('accessibility-settings', JSON.stringify(settings))
  }, [settings])

  // Save user profile to localStorage
  useEffect(() => {
    if (userProfile) {
      localStorage.setItem('user-profile', JSON.stringify(userProfile))
    }
  }, [userProfile])

  const updateSettings = (newSettings: Partial<AccessibilitySettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }))
  }

  return (
    <AccessibilityContext.Provider
      value={{
        settings,
        updateSettings,
        userProfile,
        setUserProfile,
        isAuthenticated,
        setIsAuthenticated,
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  )
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext)
  if (!context) {
    throw new Error('useAccessibility must be used within AccessibilityProvider')
  }
  return context
}
