"use client"

import { AppNavbar } from "@/components/app-navbar"
import { VoiceTutorWidget } from "@/components/voice-tutor-widget"

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <AppNavbar />
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
      <VoiceTutorWidget />
    </div>
  )
}
