# Preview OG Images Locally

## Quick Start

1. **Generate preview for a specific episode:**
   ```bash
   cd workers/og-image-worker
   node preview.js 5
   ```

2. **Open the generated HTML file:**
   - The script will output the file path
   - Open `preview.html` in your browser
   - Or use: `open preview.html` (Mac) or `xdg-open preview.html` (Linux)

3. **Edit and test:**
   - Make changes to the `generateOGImage` function in `src/index.ts`
   - Run `node preview.js [episodeNum]` again to regenerate
   - Refresh your browser to see changes

## Features

- **Visual preview** of the OG image at actual size (1200x630px)
- **Episode selector** - change episode number in the browser
- **Download SVG** - download the generated SVG for testing
- **Live editing** - edit code, regenerate, refresh browser

## Tips for Pixel Pushing

1. **Adjust text positioning:**
   - Modify `textX` and `textStartY` values
   - Adjust `y` values for each text element

2. **Change font sizes:**
   - Modify `font-size` attributes in the text elements

3. **Adjust spacing:**
   - Change the spacing between text elements (the `+ 70`, `+ 140`, etc.)

4. **Logo positioning:**
   - Modify `logoX` and `logoY` for logo placement
   - Change `logoSize` for logo size

5. **Cover art size:**
   - Modify `coverSize` to change the square size
   - Adjust `textX` accordingly to maintain spacing

## Workflow

1. Edit `src/index.ts` → `generateOGImage` function
2. Run `node preview.js [episodeNum]`
3. Open `preview.html` in browser
4. Check the result
5. Repeat until satisfied
6. Deploy with `npm run deploy`
