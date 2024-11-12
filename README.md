![enter image description here](https://www.collectiveradio.com/og-image.jpg)

# Collective Radio

Front end for Electronic music podcast streaming website collectiveradio.com

This is 100 episodes

## Features

- React 18 + TypeScript + Vite
- custom player component wrapping around native `<audio>`
- MediaSession integration to allow control of `<audio>` element on mobile devices
- Font loading optimized via `@fontsource` to reduce React bundle size and blocking
- Blurhash implementation on artwork to improve user experience during image loading
- Umami analytics proxied through Cloudflare Worker to avoid ad blockers
- Quick load - <100kb main bundle, 0.3s LCP
