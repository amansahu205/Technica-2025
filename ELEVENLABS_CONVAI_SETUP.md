# ElevenLabs ConvAI Widget Setup

## Overview
Your InvestIQ app now has an **interactive voice AI tutor** powered by ElevenLabs ConvAI!

## What You Have

**Agent ID:** `agent_9701ka6pyb7sfvys9haky31ajpyt`
**API Key:** `sk_aac78546bb30c1f8f2f7b4618f0fc787d04c9742696a6927`

⚠️ **IMPORTANT:** The API key is currently hardcoded. For production, add it to Cloudflare Pages environment variables.

## How It Works

The ElevenLabs ConvAI widget is now integrated into your app layout. It will appear on **all pages** as a floating voice assistant button.

### Features:
- ✅ **Voice-to-voice conversations** - Users can speak and the AI responds with voice
- ✅ **Natural conversations** - Ask questions about investing, lessons, portfolio advice
- ✅ **Always available** - Widget accessible from any page
- ✅ **Custom agent** - Trained specifically for your InvestIQ content

## Testing

**Once deployed:**
1. Visit your app: `https://901795a2.technica-2025.pages.dev`
2. Look for the **ElevenLabs voice widget** (usually bottom-right corner)
3. Click it to start a voice conversation
4. Try asking:
   - "What is compound interest?"
   - "How do I start investing?"
   - "Explain the difference between stocks and bonds"
   - "What should I learn first?"

## Customization

### Change Widget Position or Style
Edit `/code/components/elevenlabs-voice-tutor.tsx` to add custom styling or positioning.

### Use Different Agent
If you create another agent in ElevenLabs:
```tsx
<ElevenLabsVoiceTutor agentId="your-new-agent-id" />
```

### Only Show on Specific Pages
Instead of adding to `layout.tsx`, add to specific page files:

```tsx
// In code/app/learn/page.tsx
import { ElevenLabsVoiceTutor } from "@/components/elevenlabs-voice-tutor"

export default function LearnPage() {
  return (
    <>
      {/* Your page content */}
      <ElevenLabsVoiceTutor />
    </>
  )
}
```

## Security Best Practice

**Add API key to Cloudflare environment variables:**

```bash
cd code
npx wrangler pages secret put ELEVENLABS_API_KEY
# Paste: sk_aac78546bb30c1f8f2f7b4618f0fc787d04c9742696a6927
```

Then update the component to read from env (if needed for server-side operations).

## Troubleshooting

**Widget not appearing:**
- Check browser console for errors
- Verify script loaded: Look for `unpkg.com/@elevenlabs/convai-widget-embed` in Network tab
- Check that agent ID is correct

**Voice not working:**
- Check microphone permissions in browser
- Make sure you're on HTTPS (required for microphone access)
- Test on Cloudflare Pages deployment (localhost may have issues)

**Agent not responding correctly:**
- Log into ElevenLabs dashboard
- Go to your agent settings
- Update the agent's knowledge base or prompts
- Add InvestIQ-specific content and lesson information

## ElevenLabs Dashboard

Manage your agent at: https://elevenlabs.io/app/conversational-ai

**You can:**
- View conversation logs
- Update agent personality
- Add knowledge base content
- Monitor usage and costs
- Customize voice settings

## Cost Estimation

ElevenLabs ConvAI pricing varies by plan. Check your dashboard for:
- Number of conversations
- Minutes of voice generated
- API quota remaining

## Next Steps

1. **Deploy to Cloudflare Pages** - The widget will work on your live site
2. **Train your agent** - Add lesson content to ElevenLabs knowledge base
3. **Test conversations** - Try different questions to see how it responds
4. **Customize appearance** - Match widget colors to your app theme

Your voice AI tutor is ready! 🎙️✨
