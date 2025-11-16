"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from 'next/navigation'
import { motion } from "framer-motion"
import { ThemeToggle } from "@/components/theme-toggle"
import { LanguageToggle } from "@/components/language-toggle"
import { Button } from "@/components/ui/button"
import { Menu, X, TrendingUp, LogIn, LogOut } from 'lucide-react'
import { cn } from "@/lib/utils"
import { useI18n } from "@/lib/i18n"
import { useUser } from "@/lib/user-context"

export function AppNavbar() {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { t } = useI18n()
  const { isAuthenticated, setIsAuthenticated } = useUser()
  
  const navItems = [
    { href: "/", label: t('nav.dashboard') },
    { href: "/learn", label: t('nav.learn') },
    { href: "/simulator", label: t('nav.simulator') },
    { href: "/insights", label: t('nav.insights') },
    { href: "/settings", label: t('nav.settings') },
  ]

  const handleLogout = () => {
    setIsAuthenticated(false)
    router.push('/login')
  }

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="sticky top-4 z-50 mx-4 md:mx-8"
      data-tour="nav"
    >
      <nav className="glass-strong rounded-2xl shadow-lg" role="navigation" aria-label="Main navigation">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground transition-transform group-hover:scale-110">
                <TrendingUp className="h-6 w-6" aria-hidden="true" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent-green bg-clip-text text-transparent">
                InvestIQ
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex md:items-center md:gap-2">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant={pathname === item.href ? "default" : "ghost"}
                    className={cn(
                      "relative transition-all hover:scale-105",
                      pathname === item.href && "bg-primary text-primary-foreground"
                    )}
                  >
                    {item.label}
                    {pathname === item.href && (
                      <motion.div
                        layoutId="navbar-indicator"
                        className="absolute inset-0 rounded-md bg-primary -z-10"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                  </Button>
                </Link>
              ))}
            </div>

            {/* Theme and Language Toggle */}
            <div className="flex items-center gap-2">
              <LanguageToggle />
              <ThemeToggle />
              
              {isAuthenticated ? (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="hidden md:flex items-center gap-2"
                >
                  <LogOut className="h-4 w-4" aria-hidden="true" />
                  <span className="sr-only">Logout</span>
                </Button>
              ) : (
                <Link href="/login">
                  <Button
                    variant="default"
                    size="sm"
                    className="hidden md:flex items-center gap-2"
                  >
                    <LogIn className="h-4 w-4" aria-hidden="true" />
                    Login
                  </Button>
                </Link>
              )}
              
              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden glass"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? (
                  <X className="h-5 w-5" aria-hidden="true" />
                ) : (
                  <Menu className="h-5 w-5" aria-hidden="true" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden border-t border-border/50"
          >
            <div className="space-y-1 px-4 pb-4 pt-2">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant={pathname === item.href ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.label}
                  </Button>
                </Link>
              ))}
              
              {isAuthenticated ? (
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => {
                    handleLogout()
                    setMobileMenuOpen(false)
                  }}
                >
                  <LogOut className="mr-2 h-4 w-4" aria-hidden="true" />
                  Logout
                </Button>
              ) : (
                <Link href="/login">
                  <Button
                    variant="default"
                    className="w-full justify-start"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <LogIn className="mr-2 h-4 w-4" aria-hidden="true" />
                    Login
                  </Button>
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </nav>
    </motion.header>
  )
}
