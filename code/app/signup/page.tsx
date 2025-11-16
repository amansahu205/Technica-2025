'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { ArrowLeft, ArrowRight, Check } from 'lucide-react'
import { useI18n } from '@/lib/i18n'
import { useAccessibility } from '@/lib/accessibility-context'
import { useUser } from '@/lib/user-context'

const TOTAL_STEPS = 5

export default function SignupPage() {
  const router = useRouter()
  const { t } = useI18n()
  const { updateSettings } = useAccessibility()
  const { setUser } = useUser()

  const [currentStep, setCurrentStep] = useState(1)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [nameValue, setNameValue] = useState('')
  const [region, setRegion] = useState('')
  const [familiarity, setFamiliarity] = useState('')
  const [learningPreferences, setLearningPreferences] = useState<string[]>([])
  const [accessibilityPreferences, setAccessibilityPreferences] = useState<string[]>([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const progress = (currentStep / TOTAL_STEPS) * 100

  const toggleLearningPref = (pref: string) => {
    setLearningPreferences((prev) =>
      prev.includes(pref) ? prev.filter((p) => p !== pref) : [...prev, pref]
    )
  }

  const toggleAccessibilityPref = (pref: string) => {
    setAccessibilityPreferences((prev) =>
      prev.includes(pref) ? prev.filter((p) => p !== pref) : [...prev, pref]
    )
  }

  const handleNext = () => {
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleComplete = async () => {
    setLoading(true)
    setError('')

    try {
      // Create account via API
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          name: nameValue,
          region,
          familiarity,
          learningPreferences,
          accessibilityPreferences,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create account')
      }

      // Update accessibility settings
      updateSettings({
        largerText: accessibilityPreferences.includes('larger-text'),
        highContrast: accessibilityPreferences.includes('high-contrast'),
        screenReaderFriendly: accessibilityPreferences.includes('screen-reader'),
        audioFirst: accessibilityPreferences.includes('audio-first'),
        reducedAnimations: accessibilityPreferences.includes('reduced-animations'),
        minimalVisuals: accessibilityPreferences.includes('minimal-visuals'),
      })

      // Set user in context
      setUser(data.user)

      // Redirect to home
      router.push('/')
    } catch (err: any) {
      setError(err.message || 'Failed to create account')
      setLoading(false)
      // Go back to step 1 to show error
      setCurrentStep(1)
    }
  }

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return email.trim().length > 0 && password.length >= 6 && nameValue.trim().length > 0
      case 2:
        return region.length > 0
      case 3:
        return familiarity.length > 0
      case 4:
        return learningPreferences.length > 0
      case 5:
        return true
      default:
        return false
    }
  }

  return (
    <main className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-10 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-blob" />
        <div className="absolute top-40 right-10 w-96 h-96 bg-accent-green/20 rounded-full blur-3xl animate-blob animation-delay-2000" />
      </div>

      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto"
        >
          <div className="glass-strong rounded-3xl p-8 md:p-12 shadow-2xl">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-balance mb-2">
                {t('signup.title')}
              </h1>
              <p className="text-muted-foreground">
                {t('signup.step')} {currentStep} {t('signup.of')} {TOTAL_STEPS}
              </p>
              <Progress value={progress} className="mt-4" aria-label={`Step ${currentStep} of ${TOTAL_STEPS}`} />
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="min-h-fit"
              >
                {currentStep === 1 && (
                  <div className="space-y-4">
                    <h2 className="text-2xl font-semibold text-balance">
                      Create Your Account
                    </h2>
                    {error && (
                      <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
                        {error}
                      </div>
                    )}
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="h-14 text-lg glass"
                        autoComplete="email"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="At least 6 characters"
                        className="h-14 text-lg glass"
                        autoComplete="new-password"
                        required
                        minLength={6}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        type="text"
                        value={nameValue}
                        onChange={(e) => setNameValue(e.target.value)}
                        placeholder={t('signup.step1.placeholder')}
                        className="h-14 text-lg glass"
                        autoComplete="given-name"
                        required
                      />
                    </div>
                  </div>
                )}

                {currentStep === 2 && (
                  <div className="space-y-4">
                    <h2 className="text-2xl font-semibold text-balance">
                      {t('signup.step2.title')}
                    </h2>
                    <Select value={region} onValueChange={setRegion}>
                      <SelectTrigger className="h-14 text-lg glass" aria-label={t('signup.step2.title')}>
                        <SelectValue placeholder={t('signup.step2.placeholder')} />
                      </SelectTrigger>
                      <SelectContent className="glass-strong">
                        <SelectItem value="north-america">North America</SelectItem>
                        <SelectItem value="europe">Europe</SelectItem>
                        <SelectItem value="asia">Asia</SelectItem>
                        <SelectItem value="latin-america">Latin America</SelectItem>
                        <SelectItem value="africa">Africa</SelectItem>
                        <SelectItem value="oceania">Oceania</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {currentStep === 3 && (
                  <div className="space-y-4">
                    <h2 className="text-2xl font-semibold text-balance">
                      {t('signup.step3.title')}
                    </h2>
                    <div className="space-y-3" role="radiogroup" aria-label={t('signup.step3.title')}>
                      {[
                        { value: 'starting', label: t('signup.step3.option1') },
                        { value: 'little', label: t('signup.step3.option2') },
                        { value: 'invested', label: t('signup.step3.option3') },
                      ].map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          role="radio"
                          aria-checked={familiarity === option.value}
                          onClick={() => setFamiliarity(option.value)}
                          className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                            familiarity === option.value
                              ? 'border-primary bg-primary/10'
                              : 'border-border glass hover:border-primary/50'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-medium">{option.label}</span>
                            {familiarity === option.value && (
                              <Check className="h-5 w-5 text-primary" aria-hidden="true" />
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {currentStep === 4 && (
                  <div className="space-y-4">
                    <h2 className="text-2xl font-semibold text-balance">
                      {t('signup.step4.title')}
                    </h2>
                    <div className="flex flex-wrap gap-3" role="group" aria-label={t('signup.step4.title')}>
                      {[
                        { value: 'short', label: t('signup.step4.option1') },
                        { value: 'visual', label: t('signup.step4.option2') },
                        { value: 'step-by-step', label: t('signup.step4.option3') },
                        { value: 'audio', label: t('signup.step4.option4') },
                      ].map((option) => (
                        <Badge
                          key={option.value}
                          variant={learningPreferences.includes(option.value) ? 'default' : 'outline'}
                          className="cursor-pointer px-4 py-2 text-base transition-all hover:scale-105"
                          onClick={() => toggleLearningPref(option.value)}
                          role="checkbox"
                          aria-checked={learningPreferences.includes(option.value)}
                          tabIndex={0}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault()
                              toggleLearningPref(option.value)
                            }
                          }}
                        >
                          {option.label}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {currentStep === 5 && (
                  <div className="space-y-4">
                    <div>
                      <h2 className="text-2xl font-semibold text-balance">
                        {t('signup.step5.title')}
                      </h2>
                      <p className="text-muted-foreground mt-2">
                        {t('signup.step5.subtitle')}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-3" role="group" aria-label={t('signup.step5.title')}>
                      {[
                        { value: 'larger-text', label: t('signup.step5.option1') },
                        { value: 'high-contrast', label: t('signup.step5.option2') },
                        { value: 'screen-reader', label: t('signup.step5.option3') },
                        { value: 'audio-first', label: t('signup.step5.option4') },
                        { value: 'reduced-animations', label: t('signup.step5.option5') },
                        { value: 'minimal-visuals', label: t('signup.step5.option6') },
                      ].map((option) => (
                        <Badge
                          key={option.value}
                          variant={accessibilityPreferences.includes(option.value) ? 'default' : 'outline'}
                          className="cursor-pointer px-4 py-2 text-base transition-all hover:scale-105"
                          onClick={() => toggleAccessibilityPref(option.value)}
                          role="checkbox"
                          aria-checked={accessibilityPreferences.includes(option.value)}
                          tabIndex={0}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault()
                              toggleAccessibilityPref(option.value)
                            }
                          }}
                        >
                          {option.label}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
              <Button
                variant="ghost"
                onClick={handleBack}
                disabled={currentStep === 1}
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                {t('signup.back')}
              </Button>

              <div className="flex gap-2">
                {currentStep < TOTAL_STEPS && (
                  <Button variant="ghost" onClick={handleNext}>
                    {t('signup.skip')}
                  </Button>
                )}

                {currentStep < TOTAL_STEPS ? (
                  <Button
                    onClick={handleNext}
                    disabled={!canProceed()}
                    className="gap-2"
                  >
                    {t('signup.next')}
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Button>
                ) : (
                  <Button onClick={handleComplete} disabled={loading} className="gap-2">
                    {loading ? 'Creating Account...' : t('signup.complete')}
                    <Check className="h-4 w-4" aria-hidden="true" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  )
}
