'use client'

import { useAccessibility } from '@/lib/accessibility-context'
import { useEffect } from 'react'

export function AccessibilityWrapper({ children }: { children: React.ReactNode }) {
  const { settings } = useAccessibility()

  useEffect(() => {
    const root = document.documentElement
    
    // Apply accessibility classes
    root.classList.toggle('high-contrast', settings.highContrast)
    root.classList.toggle('dyslexia-font', settings.dyslexiaFont)
    root.classList.toggle('larger-text', settings.largerText)
    root.classList.toggle('reduced-animations', settings.reducedAnimations)
    root.classList.toggle('minimal-visuals', settings.minimalVisuals)
    root.classList.toggle('sr-friendly', settings.screenReaderFriendly)
  }, [settings])

  return <>{children}</>
}
