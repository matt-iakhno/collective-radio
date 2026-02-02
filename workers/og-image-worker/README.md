# OG Image Worker

Cloudflare Worker for generating Open Graph images for Collective Radio episodes.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure `wrangler.toml`:
   - Set up KV namespace for caching
   - Set up R2 bucket if storing episodes.json there (optional)
   - Configure routes or custom domain

3. Set environment variables (if using):
```bash
wrangler secret put EPISODES_CDN_URL
```

4. Deploy:
```bash
npm run deploy
```

## Development

```bash
npm run dev
```

## Implementation Notes

The current implementation generates **SVG images** which work perfectly for OG images. Most social media platforms (Twitter, Facebook, LinkedIn) accept SVG for OG images.

### Current Implementation (SVG)

The worker:
1. ✅ Fetches episode data from episodes.json
2. ✅ Generates an SVG image (1200x630px) with:
   - Episode cover art as background
   - Dark gradient overlay for text readability
   - Episode number, artist name, and genre as text overlays
3. ✅ Caches generated images in Cloudflare KV
4. ✅ Returns SVG with proper headers

### Converting to PNG (Optional)

If you need true PNG images instead of SVG:

1. **Option A: Use Cloudflare Image Resizing API**
   - Enable in Cloudflare dashboard
   - Convert SVG to PNG on-the-fly
   - See `IMPLEMENTATION_STEPS.md` for details

2. **Option B: Use External Service**
   - Services like Cloudinary, Imgix, or img2png API
   - Convert SVG to PNG via API call

3. **Option C: Pre-generate PNGs**
   - Generate all PNGs at build time
   - Store in R2 or CDN
   - Worker serves from cache

**Note:** SVG works great for OG images and is simpler to implement. Only convert to PNG if you encounter compatibility issues with specific platforms.

## Route

The worker responds to: `/og-image/:episodeNum`

Example: `https://og-image.collectiveradio.com/42`

## Caching

Images are cached in Cloudflare KV for 1 year. Cache keys: `og-image-{episodeNum}`
