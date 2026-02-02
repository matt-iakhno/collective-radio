# Fix: Episode Not Found Error

## Problem
The worker can't find `episodes.json` because it's not hosted at the expected URL.

## Solution Options

### Option 1: Upload to Your CDN (Recommended - Easiest)

1. **Copy episodes.json to your CDN:**
   ```bash
   # From your project root
   cp src/assets/episodes.json /path/to/your/cdn/episodes.json
   ```

2. **Or upload via Cloudflare R2:**
   ```bash
   # If you have R2 set up
   wrangler r2 object put episodes.json --file=../src/assets/episodes.json
   ```

3. **Update the worker to use the correct URL:**
   - If using R2: Set up the R2 bucket binding in `wrangler.toml`
   - If using CDN: Set the `EPISODES_CDN_URL` environment variable

### Option 2: Use Cloudflare R2 (Best for Performance)

1. **Create an R2 bucket:**
   ```bash
   wrangler r2 bucket create episodes-data
   ```

2. **Upload episodes.json:**
   ```bash
   cd /home/matt/projects/study/collectiveradio
   wrangler r2 object put episodes.json \
     --bucket=episodes-data \
     --file=src/assets/episodes.json
   ```

3. **Update wrangler.toml:**
   ```toml
   [[r2_buckets]]
   binding = "EPISODES_BUCKET"
   bucket_name = "episodes-data"
   ```

4. **Redeploy:**
   ```bash
   npm run deploy
   ```

### Option 3: Set Environment Variable (Quick Fix)

1. **Upload episodes.json to any publicly accessible URL:**
   - GitHub Gist (raw URL)
   - Your website's public folder
   - Any CDN

2. **Set the environment variable:**
   ```bash
   wrangler secret put EPISODES_CDN_URL
   # When prompted, enter: https://your-url.com/episodes.json
   ```

3. **Redeploy:**
   ```bash
   npm run deploy
   ```

### Option 4: Use GitHub Raw URL (Temporary Solution)

If your episodes.json is in a GitHub repo:

1. **Get the raw URL:**
   - Go to your GitHub repo
   - Navigate to `src/assets/episodes.json`
   - Click "Raw"
   - Copy the URL (e.g., `https://raw.githubusercontent.com/user/repo/main/src/assets/episodes.json`)

2. **Set as environment variable:**
   ```bash
   wrangler secret put EPISODES_CDN_URL
   # Paste the GitHub raw URL
   ```

3. **Redeploy:**
   ```bash
   npm run deploy
   ```

## Quick Test After Fix

After implementing one of the above solutions:

1. **Check worker logs:**
   ```bash
   wrangler tail
   ```

2. **Test the endpoint:**
   - Visit: `https://og-image-worker.matt-iakhno.workers.dev/5`
   - You should see an SVG image, not "Episode not found"

3. **Check logs for:**
   - "Successfully fetched episodes.json from..."
   - "Found episode 5: ..."

## Recommended: Option 2 (R2)

R2 is the best option because:
- ✅ Fast (same network as Workers)
- ✅ Free tier is generous
- ✅ No external dependencies
- ✅ Easy to update episodes.json when needed
