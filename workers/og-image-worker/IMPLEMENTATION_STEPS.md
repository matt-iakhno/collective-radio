# Cloudflare Worker OG Image Generation - Implementation Steps

## Overview
This guide will walk you through setting up and deploying the Cloudflare Worker for generating OG images for Collective Radio episodes.

## Step 1: Install Dependencies

Navigate to the worker directory and install dependencies:

```bash
cd /home/matt/projects/study/collectiveradio/workers/og-image-worker
npm install
```

**Note:** The current implementation uses SVG generation (which works for OG images). If you need true PNG, see Step 7 for conversion options.

## Step 2: Set Up Cloudflare Account & Wrangler

1. **Install Wrangler CLI globally** (if not already installed):
```bash
npm install -g wrangler
```

2. **Login to Cloudflare**:
```bash
wrangler login
```
This will open a browser window to authenticate with your Cloudflare account.

3. **Verify your account**:
```bash
wrangler whoami
```

## Step 3: Create KV Namespace (Optional but Recommended)

KV is used for caching generated images to improve performance:

1. **Create KV namespace**:
```bash
wrangler kv:namespace create OG_IMAGE_CACHE
```

2. **Create preview namespace** (for local development):
```bash
wrangler kv:namespace create OG_IMAGE_CACHE --preview
```

3. **Update `wrangler.toml`** with the namespace IDs:
   - Copy the `id` from the output of the first command
   - Copy the `id` from the output of the second command
   - Update `wrangler.toml` (see Step 4)

## Step 4: Configure wrangler.toml

Edit `workers/og-image-worker/wrangler.toml` and update it with your configuration:

```toml
name = "og-image-worker"
main = "src/index.ts"
compatibility_date = "2024-01-01"

# KV namespace for caching (uncomment and add your namespace ID)
[[kv_namespaces]]
binding = "OG_IMAGE_CACHE"
id = "YOUR_KV_NAMESPACE_ID_HERE"
preview_id = "YOUR_PREVIEW_KV_NAMESPACE_ID_HERE"

# Optional: R2 bucket if you want to store episodes.json there
# [[r2_buckets]]
# binding = "EPISODES_BUCKET"
# bucket_name = "your-bucket-name"

# Routes configuration
# Option A: Use a custom domain (recommended)
# routes = [
#   { pattern = "og-image.collectiveradio.com/*", zone_name = "collectiveradio.com" }
# ]

# Option B: Use workers.dev subdomain (easier for testing)
# No routes needed - will be available at og-image-worker.YOUR_SUBDOMAIN.workers.dev
```

## Step 5: Test Locally

**Note:** If you encounter GLIBC version errors on WSL2 or older Linux systems, you can skip local testing and deploy directly (see Step 6). The worker will work the same way when deployed.

1. **Start local development server**:
```bash
npm run dev
```

   **If you get GLIBC errors:**
   - Option A: Skip local testing and deploy directly (recommended)
   - Option B: Use remote mode: `npm run dev:remote` (if available in your wrangler version)
   - Option C: Test directly after deployment

2. **Test the endpoint** (if local dev works):
   - Open: `http://localhost:8787/5` (or whatever port wrangler assigns)
   - You should see an SVG image for episode 5
   - Check the console for any errors

3. **Test with different episodes**:
   - Try: `http://localhost:8787/1`, `/42`, `/100`, etc.

## Step 6: Deploy to Cloudflare

1. **Deploy the worker**:
```bash
npm run deploy
```

2. **Verify deployment**:
   - If using workers.dev: `https://og-image-worker.YOUR_SUBDOMAIN.workers.dev/5`
   - If using custom domain: `https://og-image.collectiveradio.com/5`

3. **Test the deployed worker**:
   - Open the URL in a browser
   - Check that images are generated correctly
   - Verify caching is working (second request should be faster)

## Step 7: Optional - Convert SVG to PNG

The current implementation returns SVG, which works for most OG image parsers. However, if you need true PNG:

### Option A: Use Cloudflare Image Resizing API

1. **Enable Image Resizing** in your Cloudflare dashboard
2. **Update the worker** to use Image Resizing API to convert SVG to PNG
3. **Example code** (add to `generateOGImage` function):
```typescript
// After generating SVG, convert to PNG using Image Resizing
const imageResizingUrl = `https://YOUR_DOMAIN/cdn-cgi/image/format=png/${encodeURIComponent(svgDataUrl)}`;
const pngResponse = await fetch(imageResizingUrl);
return await pngResponse.arrayBuffer();
```

### Option B: Use External Service

Use a service like:
- **img2png API**: `https://api.img2png.com/convert`
- **Cloudinary**: Upload SVG and convert to PNG
- **ImageKit**: Similar to Cloudinary

### Option C: Pre-generate PNGs

Generate all PNGs at build time and store in R2, then serve from cache.

## Step 8: Update Your React App

Update the OG image URL in `src/pages/EpisodePage.tsx`:

```typescript
// If using workers.dev:
const ogImageUrl = `https://og-image-worker.YOUR_SUBDOMAIN.workers.dev/${episode.episodeNum}`;

// If using custom domain:
const ogImageUrl = `https://og-image.collectiveradio.com/${episode.episodeNum}`;
```

## Step 9: Set Up Custom Domain (Optional)

1. **Add custom domain in Cloudflare Dashboard**:
   - Go to Workers & Pages → Your Worker → Settings → Triggers
   - Add Custom Domain: `og-image.collectiveradio.com`

2. **Update DNS** (if needed):
   - Add a CNAME record pointing to your worker
   - Cloudflare usually handles this automatically

## Step 10: Monitor and Optimize

1. **View logs**:
```bash
wrangler tail
```

2. **Check cache hit rates** in Cloudflare dashboard

3. **Monitor performance**:
   - First request (cache miss): Should be < 2 seconds
   - Cached requests: Should be < 100ms

## Troubleshooting

### Issue: GLIBC version errors (WSL2/Linux)
**Error:** `version 'GLIBC_2.32' not found` or similar
- **Solution**: This is a known issue with WSL2. You have two options:
  1. **Skip local testing** (recommended): Deploy directly with `npm run deploy` and test on the deployed worker
  2. **Update your system**: Upgrade WSL2 or use a newer Linux distribution
- **Note**: Local testing is optional - you can develop and test directly on the deployed worker

### Issue: "Module not found" errors
- **Solution**: Make sure all dependencies are installed: `npm install`

### Issue: KV namespace not found
- **Solution**: Verify namespace IDs in `wrangler.toml` match your created namespaces

### Issue: Images not generating
- **Solution**: Check worker logs with `wrangler tail` for errors

### Issue: CORS errors
- **Solution**: Add CORS headers in the worker response (already included in code)

### Issue: SVG not displaying in OG tags
- **Solution**: Some platforms prefer PNG. See Step 7 for PNG conversion options.

## Next Steps

1. ✅ Deploy and test
2. ✅ Verify OG images work in social media previews
3. ✅ Monitor cache performance
4. ⚠️ Consider PNG conversion if needed (Step 7)
5. ⚠️ Add error handling for missing episodes
6. ⚠️ Add rate limiting if needed
