# Cloudflare Authentication Guide

Before setting up the database, you need to authenticate with your Cloudflare account.

## Quick Start (Recommended)

```bash
cd backend
wrangler login
```

This will open your browser to authenticate. Once you click "Allow", you're done!

---

## Alternative: API Token Method

If browser login doesn't work, use an API token:

### Step 1: Create API Token

1. Go to: https://dash.cloudflare.com/profile/api-tokens
2. Click **"Create Token"**
3. Use template: **"Edit Cloudflare Workers"**
4. Add these permissions:
   - ✅ **Account** → **D1** → **Edit**
   - ✅ **Account** → **Workers KV Storage** → **Edit**
   - ✅ **Account** → **Workers Scripts** → **Edit**
   - ✅ **Account** → **Workers AI** → **Edit** (for AI features)
5. Click **"Continue to summary"** → **"Create Token"**
6. **Copy the token** (you'll only see it once!)

### Step 2: Set Token

```bash
export CLOUDFLARE_API_TOKEN='your-token-here'
```

To make it permanent, add to your `~/.bashrc` or `~/.zshrc`:

```bash
echo "export CLOUDFLARE_API_TOKEN='your-token-here'" >> ~/.bashrc
source ~/.bashrc
```

### Step 3: Verify

```bash
wrangler whoami
```

You should see your Cloudflare account info.

---

## After Authentication

Once authenticated, run the database setup script:

```bash
cd backend
./setup-database.sh
```

This will:
1. ✅ Create D1 database `investiq-db`
2. ✅ Apply schema (11 tables)
3. ✅ Add seed data (10 lessons)
4. ✅ Create KV namespace for caching
5. ✅ Generate `wrangler.toml` configuration

---

## Don't Have a Cloudflare Account?

Sign up for free: https://dash.cloudflare.com/sign-up

- ✅ No credit card required
- ✅ Free tier includes D1, KV, Workers, and Workers AI
- ✅ Perfect for hackathons!

---

## Troubleshooting

### "You are not authenticated"
Run `wrangler login` or set `CLOUDFLARE_API_TOKEN`

### "Command not found: wrangler"
Run `npm install -g wrangler`

### Browser won't open for login
Use the API token method instead (see above)

---

## Next Steps

After setup completes, you'll have:
- 📊 D1 database with full schema
- 💾 KV namespace for caching
- ⚙️ `wrangler.toml` ready to deploy Workers
- 🌱 10 sample lessons for testing

Ready to build the Cloudflare Workers API layer!
