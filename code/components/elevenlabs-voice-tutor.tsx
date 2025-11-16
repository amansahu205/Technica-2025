"use client"

import { useEffect } from "react"

interface ElevenLabsVoiceTutorProps {
  agentId?: string
}

export function ElevenLabsVoiceTutor({
  agentId = "agent_9701ka6pyb7sfvys9haky31ajpyt"
}: ElevenLabsVoiceTutorProps) {

  useEffect(() => {
    // Load ElevenLabs ConvAI widget script
    const script = document.createElement('script')
    script.src = 'https://unpkg.com/@elevenlabs/convai-widget-embed'
    script.async = true
    script.type = 'text/javascript'

    document.body.appendChild(script)

    return () => {
      // Cleanup script on unmount
      if (document.body.contains(script)) {
        document.body.removeChild(script)
      }
    }
  }, [])

  return (
    <elevenlabs-convai
      agent-id={agentId}
    />
  )
}

// Declare custom element for TypeScript
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      'elevenlabs-convai': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          'agent-id': string
        },
        HTMLElement
      >
    }
  }
}
