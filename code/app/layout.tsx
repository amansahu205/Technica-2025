import type { Metadata } from 'next'
// Temporary: Use system fonts to fix Cloudflare Pages build
// import { Geist, Geist_Mono, Lexend_Deca } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import { ThemeProvider } from '@/lib/theme-provider'
import { LenisProvider } from '@/lib/lenis-provider'
import { AccessibilityProvider } from '@/lib/accessibility-context'
import { I18nProvider } from '@/lib/i18n'
import { AccessibilityWrapper } from '@/components/accessibility-wrapper'
import { UserProvider } from '@/lib/user-context'
import { ElevenLabsVoiceTutor } from '@/components/elevenlabs-voice-tutor'

// Temporary: Use system fonts
const _geist = { className: '' };
const _geistMono = { className: '' };
const _lexendDeca = { variable: '--font-dyslexia', className: '' };

export const metadata: Metadata = {
  title: 'InvestIQ - AI-Powered Investing Education',
  description: 'Learn to invest with personalized AI-powered lessons, interactive simulations, and real-time market insights',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans antialiased ${_lexendDeca.variable}`}>
        <I18nProvider>
          <UserProvider>
            <AccessibilityProvider>
              <ThemeProvider defaultTheme="system" storageKey="investiq-theme">
                <AccessibilityWrapper>
                  <LenisProvider>
                    {children}
                  </LenisProvider>
                </AccessibilityWrapper>
              </ThemeProvider>
            </AccessibilityProvider>
          </UserProvider>
        </I18nProvider>
        <Analytics />
        <ElevenLabsVoiceTutor />
      </body>
    </html>
  )
}
