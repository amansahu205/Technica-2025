'use client'

import { motion } from 'framer-motion'
import { AppLayout } from '@/components/app-layout'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Accessibility, Eye, Type, Mic, Minimize2, Moon, Sun, Laptop, Languages, Sparkles } from 'lucide-react'
import { useTheme } from '@/lib/theme-provider'
import { useAccessibility } from '@/lib/accessibility-context'
import { useI18n } from '@/lib/i18n'

export default function SettingsPage() {
  const { theme, setTheme } = useTheme()
  const { settings, updateSettings } = useAccessibility()
  const { language, setLanguage } = useI18n()

  const settingsSections = [
    {
      title: 'Theme',
      icon: Sparkles,
      description: 'Choose your preferred color scheme',
      content: (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="theme" className="text-base font-medium">
                Appearance
              </Label>
              <p className="text-sm text-muted-foreground">
                Select light, dark, or system preference
              </p>
            </div>
            <Select value={theme} onValueChange={setTheme}>
              <SelectTrigger className="w-32 glass" id="theme" aria-label="Select theme">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="glass-strong">
                <SelectItem value="light">
                  <div className="flex items-center gap-2">
                    <Sun className="h-4 w-4" aria-hidden="true" />
                    Light
                  </div>
                </SelectItem>
                <SelectItem value="dark">
                  <div className="flex items-center gap-2">
                    <Moon className="h-4 w-4" aria-hidden="true" />
                    Dark
                  </div>
                </SelectItem>
                <SelectItem value="system">
                  <div className="flex items-center gap-2">
                    <Laptop className="h-4 w-4" aria-hidden="true" />
                    System
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      ),
    },
    {
      title: 'Language',
      icon: Languages,
      description: 'Change your preferred language',
      content: (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="language" className="text-base font-medium">
                Display Language
              </Label>
              <p className="text-sm text-muted-foreground">
                Choose the language for the interface
              </p>
            </div>
            <Select 
              value={language} 
              onValueChange={(val) => setLanguage(val as 'en' | 'es')}
            >
              <SelectTrigger className="w-32 glass" id="language" aria-label="Select language">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="glass-strong">
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="es">Español</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      ),
    },
    {
      title: 'Visual Accessibility',
      icon: Eye,
      description: 'Adjust visual display for better readability',
      content: (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5 flex-1">
              <Label htmlFor="high-contrast" className="text-base font-medium">
                High Contrast Mode
              </Label>
              <p className="text-sm text-muted-foreground text-pretty">
                Increases contrast between text and background for improved visibility
              </p>
            </div>
            <Switch
              id="high-contrast"
              checked={settings.highContrast}
              onCheckedChange={(checked) =>
                updateSettings({ highContrast: checked })
              }
              aria-label="Toggle high contrast mode"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5 flex-1">
              <Label htmlFor="larger-text" className="text-base font-medium">
                Larger Text
              </Label>
              <p className="text-sm text-muted-foreground text-pretty">
                Increases font size throughout the app for easier reading
              </p>
            </div>
            <Switch
              id="larger-text"
              checked={settings.largerText}
              onCheckedChange={(checked) =>
                updateSettings({ largerText: checked })
              }
              aria-label="Toggle larger text"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5 flex-1">
              <Label htmlFor="minimal-visuals" className="text-base font-medium">
                Minimal Visuals
              </Label>
              <p className="text-sm text-muted-foreground text-pretty">
                Reduces decorative visual effects for a cleaner interface
              </p>
            </div>
            <Switch
              id="minimal-visuals"
              checked={settings.minimalVisuals}
              onCheckedChange={(checked) =>
                updateSettings({ minimalVisuals: checked })
              }
              aria-label="Toggle minimal visuals"
            />
          </div>
        </div>
      ),
    },
    {
      title: 'Reading Assistance',
      icon: Type,
      description: 'Options to help with reading and comprehension',
      content: (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5 flex-1">
              <Label htmlFor="dyslexia-font" className="text-base font-medium">
                Dyslexia-Friendly Font
              </Label>
              <p className="text-sm text-muted-foreground text-pretty">
                Uses Lexend Deca font designed for improved readability
              </p>
            </div>
            <Switch
              id="dyslexia-font"
              checked={settings.dyslexiaFont}
              onCheckedChange={(checked) =>
                updateSettings({ dyslexiaFont: checked })
              }
              aria-label="Toggle dyslexia-friendly font"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5 flex-1">
              <Label htmlFor="screen-reader" className="text-base font-medium">
                Screen Reader Optimized
              </Label>
              <p className="text-sm text-muted-foreground text-pretty">
                Enhances compatibility with screen reading software
              </p>
            </div>
            <Switch
              id="screen-reader"
              checked={settings.screenReaderFriendly}
              onCheckedChange={(checked) =>
                updateSettings({ screenReaderFriendly: checked })
              }
              aria-label="Toggle screen reader optimization"
            />
          </div>
        </div>
      ),
    },
    {
      title: 'Motion & Animation',
      icon: Minimize2,
      description: 'Control motion and animation effects',
      content: (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5 flex-1">
              <Label htmlFor="reduced-animations" className="text-base font-medium">
                Reduced Animations
              </Label>
              <p className="text-sm text-muted-foreground text-pretty">
                Minimizes motion effects for users sensitive to animation
              </p>
            </div>
            <Switch
              id="reduced-animations"
              checked={settings.reducedAnimations}
              onCheckedChange={(checked) =>
                updateSettings({ reducedAnimations: checked })
              }
              aria-label="Toggle reduced animations"
            />
          </div>
        </div>
      ),
    },
    {
      title: 'Voice & Audio',
      icon: Mic,
      description: 'Audio-focused learning options',
      content: (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5 flex-1">
              <Label htmlFor="voice-first" className="text-base font-medium">
                Voice-First Mode
              </Label>
              <p className="text-sm text-muted-foreground text-pretty">
                Emphasizes the voice tutor widget and audio explanations
              </p>
            </div>
            <Switch
              id="voice-first"
              checked={settings.voiceFirst}
              onCheckedChange={(checked) =>
                updateSettings({ voiceFirst: checked })
              }
              aria-label="Toggle voice-first mode"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5 flex-1">
              <Label htmlFor="audio-first" className="text-base font-medium">
                Audio-First Explanations
              </Label>
              <p className="text-sm text-muted-foreground text-pretty">
                Prioritizes audio content over text where available
              </p>
            </div>
            <Switch
              id="audio-first"
              checked={settings.audioFirst}
              onCheckedChange={(checked) =>
                updateSettings({ audioFirst: checked })
              }
              aria-label="Toggle audio-first explanations"
            />
          </div>
        </div>
      ),
    },
  ]

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <Accessibility className="h-6 w-6" aria-hidden="true" />
              </div>
              <h1 className="text-4xl font-bold">Settings</h1>
            </div>
            <p className="text-muted-foreground text-lg">
              Customize your learning experience with accessibility and personalization options
            </p>
          </div>

          <div className="space-y-6">
            {settingsSections.map((section, index) => {
              const Icon = section.icon
              return (
                <motion.section
                  key={section.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="glass-strong rounded-2xl p-6"
                  aria-labelledby={`section-${index}`}
                >
                  <div className="flex items-start gap-4 mb-6">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary flex-shrink-0">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <div className="flex-1">
                      <h2 id={`section-${index}`} className="text-xl font-semibold mb-1">
                        {section.title}
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        {section.description}
                      </p>
                    </div>
                  </div>
                  <div className="pl-14">{section.content}</div>
                </motion.section>
              )
            })}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-8 p-6 glass rounded-2xl border-primary/50"
          >
            <p className="text-sm text-muted-foreground">
              All settings are saved automatically and will be remembered on your next visit.
              If you need assistance, our voice tutor is always available in the bottom-right corner.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </AppLayout>
  )
}
