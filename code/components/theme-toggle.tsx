"use client"

import * as React from "react"
import { Moon, Sun } from 'lucide-react'
import { useTheme } from "@/lib/theme-provider"
import { Button } from "@/components/ui/button"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className="glass">
        <Sun className="h-5 w-5" />
      </Button>
    )
  }

  const isDark = theme === "dark" || (theme === "system" && 
    typeof window !== "undefined" && 
    window.matchMedia("(prefers-color-scheme: dark)").matches)

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="glass transition-all hover:scale-105"
    >
      {isDark ? (
        <Sun className="h-5 w-5 transition-transform rotate-0 scale-100" />
      ) : (
        <Moon className="h-5 w-5 transition-transform rotate-0 scale-100" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
