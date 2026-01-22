# GitHub Actions Workflows

## Upload Episodes to R2

This workflow automatically uploads `episodes.json` to Cloudflare R2 whenever it changes.

### Required Github secrets

- `CLOUDFLARE_API_TOKEN`: Must contain Cloudflare R2:Edit permission
- `CLOUDFLARE_ACCOUNT_ID`

### How It Works

- **Triggers:**
  - Automatically on push to `main` when `src/assets/episodes.json` changes
  - Can be manually triggered from GitHub Actions tab

- **What it does:**
  1. Checks out your repo
  2. Installs Wrangler
  3. Authenticates with Cloudflare
  4. Uploads `episodes.json` to the `collectiveradio` R2 bucket
  5. Verifies the upload
