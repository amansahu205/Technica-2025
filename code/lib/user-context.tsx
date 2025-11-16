'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'

interface User {
  id: string
  email: string
  name: string
  skillLevel?: string
  onboardingComplete?: boolean
}

interface UserContextType {
  user: User | null
  name: string
  onboardingComplete: boolean
  setName: (name: string) => void
  setOnboardingComplete: (complete: boolean) => void
  isAuthenticated: boolean
  setIsAuthenticated: (value: boolean) => void
  setUser: (user: User | null) => void
  logout: () => void
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUserState] = useState<User | null>(null)
  const [name, setName] = useState('')
  const [onboardingComplete, setOnboardingCompleteState] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Load user data from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('investiq-user')
    const storedName = localStorage.getItem('investiq-user-name')
    const storedOnboarding = localStorage.getItem('investiq-onboarding-complete')
    const storedAuth = localStorage.getItem('investiq-authenticated')

    if (storedUser) {
      try {
        setUserState(JSON.parse(storedUser))
      } catch (e) {
        console.error('Failed to parse stored user:', e)
      }
    }
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

  const setUser = (newUser: User | null) => {
    setUserState(newUser)
    if (newUser) {
      localStorage.setItem('investiq-user', JSON.stringify(newUser))
      setName(newUser.name)
      updateIsAuthenticated(true)
    } else {
      localStorage.removeItem('investiq-user')
    }
  }

  const logout = () => {
    setUserState(null)
    setName('')
    setOnboardingCompleteState(false)
    setIsAuthenticated(false)
    localStorage.removeItem('investiq-user')
    localStorage.removeItem('investiq-user-name')
    localStorage.removeItem('investiq-onboarding-complete')
    localStorage.removeItem('investiq-authenticated')
  }

  return (
    <UserContext.Provider
      value={{
        user,
        name,
        onboardingComplete,
        setName: updateName,
        setOnboardingComplete,
        isAuthenticated,
        setIsAuthenticated: updateIsAuthenticated,
        setUser,
        logout,
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
