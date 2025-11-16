'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { TrendingUp, CheckCircle2 } from 'lucide-react'
import { useI18n } from '@/lib/i18n'
import { useUser } from '@/lib/user-context'
import Link from 'next/link'

export default function LoginPage() {
  const router = useRouter()
  const { t } = useI18n()
  const { setIsAuthenticated } = useUser()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)

  useEffect(() => {
    console.log('[v0] Login page mounted')
  }, [])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('[v0] Login submitted')
    // Simulate login
    setIsAuthenticated(true)
    router.push('/')
  }

  const handleGuestContinue = () => {
    console.log('[v0] Guest continue clicked')
    router.push('/')
  }

  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* Animated background blobs */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-10 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-blob" />
        <div className="absolute top-40 right-10 w-96 h-96 bg-accent-green/20 rounded-full blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute bottom-20 left-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-blob animation-delay-4000" />
      </div>

      <div className="container mx-auto px-4 py-12 md:py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-6xl mx-auto"
        >
          <div className="glass-strong rounded-3xl overflow-hidden shadow-2xl">
            <div className="grid md:grid-cols-2 gap-0">
              {/* Left Side - Information */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-gradient-to-br from-primary/10 to-accent-green/10 p-8 md:p-12 flex flex-col justify-center"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                    <TrendingUp className="h-7 w-7" aria-hidden="true" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-primary">
                      {t('login.badge')}
                    </div>
                    <div className="text-2xl font-bold bg-gradient-to-r from-primary to-accent-green bg-clip-text text-transparent">
                      InvestIQ
                    </div>
                  </div>
                </div>

                <h1 className="text-3xl md:text-4xl font-bold text-balance mb-4">
                  {t('login.heading')}
                </h1>

                <p className="text-muted-foreground text-pretty mb-8">
                  {t('login.description')}
                </p>

                <ul className="space-y-4" role="list">
                  {[
                    t('login.benefit1'),
                    t('login.benefit2'),
                    t('login.benefit3'),
                  ].map((benefit, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + i * 0.1 }}
                      className="flex items-start gap-3"
                    >
                      <CheckCircle2 className="h-6 w-6 text-accent-green flex-shrink-0 mt-0.5" aria-hidden="true" />
                      <span className="text-foreground/90">{benefit}</span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>

              {/* Right Side - Login Form */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="p-8 md:p-12"
              >
                <form onSubmit={handleLogin} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-base">
                      {t('login.email')}
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-12 glass"
                      placeholder="you@example.com"
                      required
                      autoComplete="email"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-base">
                      {t('login.password')}
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-12 glass"
                      placeholder="••••••••"
                      required
                      autoComplete="current-password"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="remember"
                      checked={rememberMe}
                      onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                    />
                    <Label 
                      htmlFor="remember" 
                      className="text-sm font-normal cursor-pointer"
                    >
                      {t('login.remember')}
                    </Label>
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full h-12 text-base"
                  >
                    {t('login.continue')}
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    size="lg"
                    className="w-full h-12 text-base glass"
                    onClick={handleGuestContinue}
                  >
                    {t('login.guest')}
                  </Button>

                  <div className="text-center pt-4">
                    <Link href="/signup">
                      <Button variant="link" className="text-primary">
                        {t('login.signup')}
                      </Button>
                    </Link>
                  </div>
                </form>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  )
}
