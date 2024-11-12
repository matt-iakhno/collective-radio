![enter image description here](https://www.collectiveradio.com/og-image.jpg)

# Collective Radio

Front end for Electronic music podcast streaming website [collectiveradio.com](https://collectiveradio.com)

This website lets you listen to one of the many episodes of the now defunct Collective Radio podcast series. My friends and I recorded these between 2017-2020 to share the music that inspired us.

The live project is currently being served through Render.com, and the assets through Cloudflare R2.

## Features

- React 18 + TypeScript + Vite
- custom player component wrapping around native `<audio>`
- MediaSession integration to allow control of `<audio>` element on mobile devices
- Font loading optimized via `@fontsource` to reduce React bundle size and blocking
- `blurhash` implementation on artwork to improve user experience during image loading
- Umami analytics proxied through a Cloudflare Worker (to avoid ad blockers)
- Quick load - <100kb main bundle, 0.3s LCP

## Running the project

```
git clone git@github.com:matt-iakhno/collective-radio.git
npm install
npm run dev
```
