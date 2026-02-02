# Setting Up Custom Domain: og-image.collectiveradio.com

## Option 1: Via Cloudflare Dashboard (Recommended - Easier)

1. **Go to Cloudflare Dashboard:**
   - Navigate to: https://dash.cloudflare.com/
   - Select your account
   - Go to **Workers & Pages** → **og-image-worker**

2. **Add Custom Domain:**
   - Click on your worker
   - Go to **Settings** tab
   - Scroll to **Triggers** section
   - Under **Custom Domains**, click **Add Custom Domain**
   - Enter: `og-image.collectiveradio.com`
   - Click **Add Custom Domain**

3. **DNS Configuration:**
   - Cloudflare will automatically create the DNS record (CNAME)
   - If it doesn't, manually add:
     - Type: `CNAME`
     - Name: `og-image`
     - Target: `og-image-worker.matt-iakhno.workers.dev` (or whatever Cloudflare shows)
     - Proxy: Enabled (orange cloud)

4. **Wait for Propagation:**
   - DNS changes can take a few minutes
   - Test: `https://og-image.collectiveradio.com/5`

## Option 2: Via wrangler.toml

If you prefer to manage it via code:

1. **Update wrangler.toml:**
   ```toml
   routes = [
     { pattern = "og-image.collectiveradio.com/*", zone_name = "collectiveradio.com" }
   ]
   ```

2. **Deploy:**
   ```bash
   npm run deploy
   ```

3. **Verify DNS:**
   - Check that the CNAME record exists in Cloudflare DNS
   - Should point to your worker

## Verification

After setup, test:
- `https://og-image.collectiveradio.com/5`
- Should return the same SVG as the workers.dev URL

## Troubleshooting

### Domain not resolving:
- Check DNS records in Cloudflare
- Ensure CNAME is set correctly
- Wait a few minutes for DNS propagation

### SSL Certificate issues:
- Cloudflare automatically provisions SSL certificates
- May take a few minutes after domain is added

### 404 errors:
- Verify the route pattern matches
- Check worker logs: `wrangler tail`
