# ElevenLabs Text-to-Speech Integration

## Overview
InvestIQ uses ElevenLabs API to generate natural-sounding voice narration for all lessons in real-time.

## Setup Instructions

### 1. Get Your ElevenLabs API Key

1. Go to [ElevenLabs](https://elevenlabs.io/)
2. Sign up or log in
3. Go to your [Profile Settings](https://elevenlabs.io/app/settings/api-keys)
4. Click "Generate API Key"
5. Copy your API key (starts with `sk_...`)

### 2. Add API Key to Cloudflare Pages

**Via Cloudflare Dashboard:**
1. Go to [Cloudflare Pages Dashboard](https://dash.cloudflare.com/)
2. Select your "investiq-frontend" project
3. Go to **Settings** → **Environment variables**
4. Click **Add variable**
5. Name: `ELEVENLABS_API_KEY`
6. Value: Your API key from step 1
7. Click **Save**

**Via wrangler CLI:**
```bash
cd code
npx wrangler pages secret put ELEVENLABS_API_KEY
# Paste your API key when prompted
```

### 3. How It Works

**API Endpoint:**
- GET `/api/text-to-speech?lessonId=lesson-1` - Generate audio for a specific lesson
- POST `/api/text-to-speech` with `{text: "your text"}` - Generate audio for custom text

**Voice Options:**
- Default voice: Bella (EXAVITQu4vr4xnSDxMaL)
- You can change voice by passing `?voiceId=VOICE_ID` parameter

**Popular ElevenLabs Voices:**
- **Bella** (EXAVITQu4vr4xnSDxMaL) - Warm, educational, female
- **Rachel** (21m00Tcm4TlvDq8ikWAM) - Professional, clear, female
- **Adam** (pNInz6obpgDQGcFmaJgB) - Deep, authoritative, male
- **Antoni** (ErXwobaYiN019PkySvjV) - Friendly, casual, male

### 4. Usage in Your App

**Basic Usage:**
```tsx
import { LessonAudioPlayer } from "@/components/lesson-audio-player"

<LessonAudioPlayer lessonId="lesson-1" />
```

**Custom Text:**
```tsx
const response = await fetch('/api/text-to-speech', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    text: "Welcome to InvestIQ! Let's learn about investing.",
    voiceId: "EXAVITQu4vr4xnSDxMaL" // Optional
  })
})

const audioBlob = await response.blob()
const audioUrl = URL.createObjectURL(audioBlob)
// Play audio using <audio> element
```

### 5. Features

✅ **Real-time generation** - No need to pre-generate audio files
✅ **Automatic caching** - Audio cached for 24 hours to save API costs
✅ **Streaming** - Audio streams as it generates for faster playback
✅ **Voice customization** - Choose from multiple professional voices
✅ **Cost efficient** - Uses Turbo v2 model for speed and affordability

### 6. Cost Estimation

**ElevenLabs Pricing (as of 2024):**
- Free tier: 10,000 characters/month
- Starter: $5/month for 30,000 characters
- Creator: $22/month for 100,000 characters

**InvestIQ Usage:**
- Average lesson: ~500-800 characters
- 15 lessons: ~10,000 characters (fits in free tier!)
- With caching, repeated plays don't cost extra

### 7. Troubleshooting

**"ElevenLabs API key not configured" error:**
- Make sure you added the `ELEVENLABS_API_KEY` environment variable
- Redeploy your Cloudflare Pages project after adding the variable

**"API quota exceeded" error:**
- Check your ElevenLabs dashboard for usage limits
- Consider upgrading your plan or implementing more aggressive caching

**Audio not playing:**
- Check browser console for errors
- Verify the API endpoint is accessible: `/api/text-to-speech?lessonId=lesson-1`
- Test the ElevenLabs API key directly in their playground

### 8. Adding More Lessons

Edit `/code/functions/api/text-to-speech.ts` and add to the `LESSON_CONTENT` object:

```typescript
const LESSON_CONTENT: Record<string, string> = {
  "lesson-1": "Your lesson 1 text here...",
  "lesson-2": "Your lesson 2 text here...",
  // Add more lessons...
}
```

## Support

- ElevenLabs Docs: https://docs.elevenlabs.io/
- ElevenLabs Support: https://elevenlabs.io/support
- InvestIQ Issues: https://github.com/amansahu205/Technica-2025/issues
