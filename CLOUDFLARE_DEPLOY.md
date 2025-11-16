# Cloudflare Pages Configuration

## Build Settings for Next.js Static Export

**Production branch:** `main`

**Build command:**
```bash
cd frontend && pnpm install && pnpm build
```

**Build output directory:**
```bash
frontend/out
```
⚠️ **Important:** Changed from `frontend/.next` to `frontend/out` for static export

**Root directory:** (leave blank or `/`)

**Environment variables:**
```
NODE_VERSION=18
NEXT_PUBLIC_API_URL=https://your-api-url.workers.dev
```

## Why This Changed

Next.js with `output: 'export'` generates static HTML files in the `out/` directory instead of `.next/`. This is required for Cloudflare Pages deployment.

## Deploy Instructions

1. Update Cloudflare Pages settings:
   - Go to Settings → Builds & deployments
   - Change **Build output directory** to: `frontend/out`
   - Save

2. Trigger new deployment:
   - Go to Deployments tab
   - Click "Retry deployment" or "Create deployment"

3. Your site will be live at: `https://your-project.pages.dev`
