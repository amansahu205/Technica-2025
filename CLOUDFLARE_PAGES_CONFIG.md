# Cloudflare Pages Deployment Configuration

## Current Issue: Seeing Old Frontend

If you're seeing the old frontend after deployment, it's because Cloudflare Pages needs to be configured to build from the correct directory with the correct settings.

---

## Required Configuration in Cloudflare Pages Dashboard

Go to your Cloudflare Pages project settings and configure:

### Build Configuration

**Framework preset:** `Next.js`

**Root directory:** `code`

**Build command:**
```bash
pnpm install && pnpm build
```

**Build output directory:**
```
out
```

**Node version:** `22.x` (or latest)

---

## Environment Variables (if needed)

In Cloudflare Pages → Settings → Environment Variables:

```
NODE_VERSION=22
```

---

## Directory Structure

```
Technica-2025/
├── code/                    # Next.js frontend (BUILD FROM HERE)
│   ├── app/                 # Next.js app router pages
│   ├── components/          # React components
│   ├── public/              # Static assets
│   ├── out/                 # Build output (after build)
│   ├── package.json         # Dependencies
│   ├── next.config.mjs      # Next.js config (output: 'export')
│   └── wrangler.toml        # Cloudflare config
│
├── frontend/
│   └── functions/           # Cloudflare Pages Functions (API routes)
│       └── api/
│           ├── assessment.ts
│           ├── questions.ts
│           ├── curriculum.ts
│           └── ... (other APIs)
│
└── backend/                 # Python backend (separate deployment)
```

---

## How Cloudflare Pages Works

1. **Static Frontend (code/):**
   - Next.js builds to static HTML/CSS/JS in `out/` directory
   - Served from Cloudflare's edge network
   - **This is what users see when they visit your site**

2. **API Functions (frontend/functions/):**
   - Cloudflare automatically deploys these as edge functions
   - Available at `/api/*` routes
   - Have access to D1 database via bindings

---

## Why You're Seeing Old Frontend

**Problem:** Cloudflare Pages is either:
- Building from wrong directory (root instead of `code/`)
- Using wrong build output directory
- Caching old deployment

**Solution:**

### Step 1: Update Build Settings

In Cloudflare Pages dashboard:
1. Go to Settings → Builds & deployments
2. Set **Root directory** to: `code`
3. Set **Build output directory** to: `out`
4. Save changes

### Step 2: Trigger New Deployment

Option A: **Push a commit** (recommended)
```bash
# This will trigger automatic redeployment
git push
```

Option B: **Manual redeploy**
1. Go to Deployments tab
2. Click "Retry deployment" on latest deployment
3. Or click "Create deployment" → Deploy from branch

### Step 3: Clear Cache (if needed)

After successful deployment:
1. Go to Caching → Configuration
2. Click "Purge Everything"
3. Or use your browser's hard refresh: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)

---

## Verify Deployment

### Check Build Logs

In Cloudflare Pages → Deployments → [Latest] → Build logs

You should see:
```
✓ Compiled successfully
✓ Generating static pages (12/12)
Route (app)
├ ○ /
├ ○ /assessment
├ ○ /assessment-adaptive
├ ○ /dashboard
└ ... (all routes)
```

### Test API Endpoints

After deployment, test these URLs:

```
https://your-site.pages.dev/api/curriculum
https://your-site.pages.dev/api/questions?count=5
https://your-site.pages.dev/api/lessons
```

If these return JSON data, your APIs are working!

---

## Database Setup

Don't forget to populate the database:

```bash
cd backend

# Apply all schemas and import questions
./apply-all-schemas.sh

# Apply curriculum (15 lessons)
./apply-curriculum.sh
```

---

## Current Configuration Files

### next.config.mjs
```javascript
{
  output: 'export',  // Static export mode
  images: { unoptimized: true },
  trailingSlash: true
}
```

### package.json
```json
{
  "scripts": {
    "build": "next build"  // Outputs to out/ automatically
  }
}
```

### wrangler.toml
```toml
pages_build_output_dir = "out"

[[d1_databases]]
binding = "DB"
database_name = "investiq"
database_id = "fdb7c213-b732-4155-88c6-000900224c56"
```

---

## Troubleshooting

### Issue: Still seeing old frontend

1. **Check build settings are correct** (root directory = `code`)
2. **Clear browser cache** (hard refresh)
3. **Wait 1-2 minutes** for Cloudflare CDN to update
4. **Check build logs** for errors
5. **Verify deployment succeeded** (green checkmark)

### Issue: API routes return 404

- Make sure `frontend/functions/api/` directory exists
- Check D1 database binding in wrangler.toml
- Verify database has been set up and seeded

### Issue: Database errors

- Run the setup scripts in `backend/`
- Check database ID matches in wrangler.toml
- Verify questions have been imported

---

## Quick Fix Commands

```bash
# Fix configuration and redeploy
cd /path/to/Technica-2025
git pull
git add -A
git commit -m "Update Cloudflare Pages configuration"
git push

# This will trigger automatic redeployment with correct settings
```

---

## Expected URLs

After correct deployment:

- **Frontend:** `https://26983f8d.technica-2025.pages.dev/`
- **Curriculum API:** `https://26983f8d.technica-2025.pages.dev/api/curriculum`
- **Questions API:** `https://26983f8d.technica-2025.pages.dev/api/questions?count=10`
- **Assessment API:** `https://26983f8d.technica-2025.pages.dev/api/assessment` (POST)

---

## Need Help?

If you're still seeing the old frontend after following these steps:

1. Share the build logs from Cloudflare Pages
2. Verify the "Root directory" setting in Pages dashboard
3. Check the deployment commit SHA matches your latest commit
4. Try a hard browser refresh or incognito mode

The new curriculum features and database fixes won't show until the correct build is deployed!
