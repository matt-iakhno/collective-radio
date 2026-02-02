/**
 * Local preview script for OG images
 * Run: node preview.js [episodeNum]
 *
 * This generates an HTML file that displays the OG image
 * Open the generated preview.html in your browser to see the result
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Get episode number from command line or default to 1
const episodeNum = parseInt(process.argv[2] || '1', 10)

// Read episodes.json
const episodesPath = path.join(__dirname, '../../src/assets/episodes.json')
const episodes = JSON.parse(fs.readFileSync(episodesPath, 'utf-8'))

const episode = episodes.find((ep) => ep.episodeNum === episodeNum)

if (!episode) {
  console.error(`Episode ${episodeNum} not found`)
  process.exit(1)
}

// Generate the SVG (same logic as worker)
function generateOGImage(episode) {
  const width = 1200
  const height = 630

  const escapeXml = (unsafe) => {
    return unsafe
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;')
  }

  const episodeText = escapeXml(`Episode ${episode.episodeNum}`)
  const genre = escapeXml(episode.genre)

  // Logo URL - using local path or CDN
  const logoUrl = 'https://www.collectiveradio.com/android-chrome-192x192.png'

  const coverSize = height
  const coverX = 0
  const coverY = 0
  const textX = coverSize + 60
  const textStartY = 160
  const lineHeight = 60 // Equal spacing between lines
  const fontSize = 42 // Same font size for all lines
  const logoSize = 120
  const logoX = width - logoSize
  const logoY = height - logoSize

  // Calculate max width for artist text (from textX to before logo, with padding)
  const maxArtistWidth = logoX - textX - 40 // 40px padding before logo

  // Prepare artist names with wrapping logic
  // If text is too long and there are 2 artists, split at " & "
  let artistLine1 = ''
  let artistLine2 = ''
  const fullArtistName = episode.artists.join(' & ')

  if (episode.artists.length === 2) {
    // Estimate text width more accurately
    // For Goldman font at 42px: average character width is approximately 0.6 * fontSize
    // This gives us ~25px per character on average
    const avgCharWidth = fontSize * 0.6
    const estimatedWidth = fullArtistName.length * avgCharWidth

    if (estimatedWidth > maxArtistWidth) {
      // Split at " & " - first line gets first artist + " &", second line gets second artist
      artistLine1 = escapeXml(episode.artists[0] + ' &')
      artistLine2 = escapeXml(episode.artists[1])
    } else {
      // Fits on one line
      artistLine1 = escapeXml(fullArtistName)
      artistLine2 = ''
    }
  } else {
    // Single artist or more than 2 - just use the joined string
    artistLine1 = escapeXml(fullArtistName)
    artistLine2 = ''
  }

  // For preview, use Google Fonts @import (works in browser preview)
  // In the actual worker, fonts are embedded as base64
  const fontFace = `
    <defs>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Goldman:wght@400;700&display=swap');
      </style>
    </defs>
  `
  const fontFamily = 'Goldman, Arial, sans-serif'

  return `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
      ${fontFace}
      <!-- Black background -->
      <rect width="${width}" height="${height}" fill="#000000"/>
      
      <!-- Cover art square (left side) -->
      <image 
        href="${episode.coverArt}" 
        x="${coverX}" 
        y="${coverY}" 
        width="${coverSize}" 
        height="${coverSize}" 
        preserveAspectRatio="xMidYMid slice"
      />
      
      <!-- Text content (right side, left-aligned) -->
      <g>
        <!-- Episode XXX -->
        <text 
          x="${textX}" 
          y="${textStartY}" 
          font-family="${fontFamily}" 
          font-size="${fontSize}" 
          font-weight="400" 
          fill="white"
        >
          ${episodeText}
        </text>
        
        <!-- Genre -->
        <text 
          x="${textX}" 
          y="${textStartY + lineHeight}" 
          font-family="${fontFamily}" 
          font-size="${fontSize}" 
          font-weight="400" 
          fill="white"
        >
          ${genre}
        </text>
        
        <!-- Artist name(s) -->
        <text 
          x="${textX}" 
          y="${textStartY + lineHeight * 2}" 
          font-family="${fontFamily}" 
          font-size="${fontSize}" 
          font-weight="400" 
          fill="white"
        >
          ${artistLine1}
        </text>
        ${artistLine2 ? `
        <text 
          x="${textX}" 
          y="${textStartY + lineHeight * 3}" 
          font-family="${fontFamily}" 
          font-size="${fontSize}" 
          font-weight="400" 
          fill="white"
        >
          ${artistLine2}
        </text>
        ` : ''}
      </g>
      
      <!-- Logo (bottom right) -->
      <image 
        href="${logoUrl}" 
        x="${logoX}" 
        y="${logoY}" 
        width="${logoSize}" 
        height="${logoSize}" 
        preserveAspectRatio="xMidYMid meet"
      />
    </svg>
  `.trim()
}

// Generate HTML preview
const svg = generateOGImage(episode)
const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>OG Image Preview - Episode ${episodeNum}</title>
  <style>
    body {
      margin: 0;
      padding: 20px;
      background: #1a1a1a;
      display: flex;
      flex-direction: column;
      align-items: center;
      font-family: Arial, sans-serif;
      color: white;
    }
    .preview-container {
      background: white;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.3);
      margin-bottom: 20px;
    }
    .preview-container svg {
      display: block;
    }
    .info {
      text-align: center;
      margin-bottom: 20px;
    }
    .controls {
      display: flex;
      gap: 10px;
      margin-top: 20px;
    }
    input {
      padding: 8px;
      font-size: 16px;
      width: 100px;
    }
    button {
      padding: 8px 16px;
      font-size: 16px;
      background: #4CAF50;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
    button:hover {
      background: #45a049;
    }
  </style>
</head>
<body>
  <div class="info">
    <h1>OG Image Preview</h1>
    <p>Episode ${episodeNum}: ${episode.artists.join(' & ')} - ${episode.genre}</p>
    <p>Size: 1200x630px (OG image standard)</p>
  </div>
  
  <div class="preview-container">
    ${svg}
  </div>
  
  <div class="controls">
    <input type="number" id="episodeNum" value="${episodeNum}" min="1" max="${episodes.length}">
    <button onclick="loadEpisode()">Load Episode</button>
    <button onclick="downloadSVG()">Download SVG</button>
  </div>
  
  <script>
    function loadEpisode() {
      const episodeNum = document.getElementById('episodeNum').value;
      window.location.href = \`?episode=\${episodeNum}\`;
    }
    
    function downloadSVG() {
      const svg = document.querySelector('svg');
      const svgData = new XMLSerializer().serializeToString(svg);
      const blob = new Blob([svgData], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = \`og-image-episode-${episodeNum}.svg\`;
      a.click();
      URL.revokeObjectURL(url);
    }
    
    // Handle URL parameter
    const params = new URLSearchParams(window.location.search);
    const episodeParam = params.get('episode');
    if (episodeParam) {
      document.getElementById('episodeNum').value = episodeParam;
    }
  </script>
</body>
</html>`

// Write preview file
const outputPath = path.join(__dirname, 'preview.html')
fs.writeFileSync(outputPath, html, 'utf-8')

console.log(`✅ Generated preview.html for Episode ${episodeNum}`)
console.log(`   Artist: ${episode.artists.join(' & ')}`)
console.log(`   Genre: ${episode.genre}`)
console.log(`\n📂 Open in browser:`)
console.log(`   Linux/WSL: xdg-open preview.html`)
console.log(`   Mac: open preview.html`)
console.log(`   Windows: start preview.html`)
console.log(`   Or manually: file://${outputPath}`)
