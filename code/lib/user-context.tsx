'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'

interface UserContextType {
  name: string
  onboardingComplete: boolean
  setName: (name: string) => void
  setOnboardingComplete: (complete: boolean) => void
  isAuthenticated: boolean
  setIsAuthenticated: (value: boolean) => void
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [name, setName] = useState('')
  const [onboardingComplete, setOnboardingCompleteState] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Load user data from localStorage on mount
  useEffect(() => {
    const storedName = localStorage.getItem('investiq-user-name')
    const storedOnboarding = localStorage.getItem('investiq-onboarding-complete')
    const storedAuth = localStorage.getItem('investiq-authenticated')

    if (storedName) setName(storedName)
    if (storedOnboarding === 'true') setOnboardingCompleteState(true)
    if (storedAuth === 'true') setIsAuthenticated(true)
  }, [])

  // Save to localStorage when changed
  const setOnboardingComplete = (complete: boolean) => {
    setOnboardingCompleteState(complete)
    localStorage.setItem('investiq-onboarding-complete', complete.toString())
  }

  const updateName = (newName: string) => {
    setName(newName)
    localStorage.setItem('investiq-user-name', newName)
  }

  const updateIsAuthenticated = (value: boolean) => {
    setIsAuthenticated(value)
    localStorage.setItem('investiq-authenticated', value.toString())
  }

  return (
    <UserContext.Provider
      value={{
        name,
        onboardingComplete,
        setName: updateName,
        setOnboardingComplete,
        isAuthenticated,
        setIsAuthenticated: updateIsAuthenticated,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error('useUser must be used within UserProvider')
  }
  return context
}
