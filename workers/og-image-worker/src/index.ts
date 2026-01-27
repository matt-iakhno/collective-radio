/**
 * Cloudflare Worker for generating Open Graph images for Collective Radio episodes
 * 
 * Route: /og-image/:episodeNum
 * 
 * This worker:
 * 1. Fetches episode data from episodes.json (hosted on CDN)
 * 2. Fetches the episode's cover art
 * 3. Generates an OG image (1200x630px) with episode info overlay
 * 4. Returns the image with proper headers
 * 5. Caches generated images in Cloudflare KV or R2
 */

export interface Env {
  // KV namespace for caching generated images
  OG_IMAGE_CACHE?: KVNamespace;
  // R2 bucket for episodes.json (optional, can also fetch from CDN)
  EPISODES_BUCKET?: R2Bucket;
  // CDN URL for episodes.json
  EPISODES_CDN_URL?: string;
}

interface Episode {
  episodeNum: number;
  artists: string[];
  url: string;
  coverArt: string;
  releaseDate: string;
  genre: string;
  mood: string;
  coverArtBlurhash: string;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const pathParts = url.pathname.split("/");
    const episodeNumStr = pathParts[pathParts.length - 1];

    // Validate episode number
    const episodeNum = parseInt(episodeNumStr, 10);
    if (isNaN(episodeNum) || episodeNum < 1) {
      return new Response("Invalid episode number", { status: 400 });
    }

    // Check cache first
    if (env.OG_IMAGE_CACHE) {
      const cacheKey = `og-image-${episodeNum}`;
      const cached = await env.OG_IMAGE_CACHE.get(cacheKey, { type: "arrayBuffer" });
      if (cached) {
        return new Response(cached, {
          headers: {
            "Content-Type": "image/svg+xml",
            "Cache-Control": "public, max-age=31536000, immutable",
          },
        });
      }
    }

    try {
      // Fetch episode data
      const episode = await fetchEpisodeData(episodeNum, env);
      if (!episode) {
        return new Response("Episode not found", { status: 404 });
      }

      // Generate OG image
      const imageBuffer = await generateOGImage(episode);

      // Cache the image
      if (env.OG_IMAGE_CACHE && imageBuffer) {
        const cacheKey = `og-image-${episodeNum}`;
        await env.OG_IMAGE_CACHE.put(cacheKey, imageBuffer, {
          expirationTtl: 60 * 60 * 24 * 365, // 1 year
        });
      }

      return new Response(imageBuffer, {
        headers: {
          "Content-Type": "image/svg+xml",
          "Cache-Control": "public, max-age=31536000, immutable",
        },
      });
    } catch (error) {
      console.error("Error generating OG image:", error);
      return new Response("Error generating image", { status: 500 });
    }
  },
};

async function fetchEpisodeData(episodeNum: number, env: Env): Promise<Episode | null> {
  // Try to fetch from R2 bucket first, then fall back to CDN
  let episodesJson: string | null = null;
  let lastError: string | null = null;

  if (env.EPISODES_BUCKET) {
    try {
      const object = await env.EPISODES_BUCKET.get("episodes.json");
      if (object) {
        episodesJson = await object.text();
        console.log("Successfully fetched episodes.json from R2");
      }
    } catch (error) {
      lastError = `R2 error: ${error}`;
      console.error("Error fetching from R2:", error);
    }
  }

  if (!episodesJson && env.EPISODES_CDN_URL) {
    try {
      console.log(`Fetching from EPISODES_CDN_URL: ${env.EPISODES_CDN_URL}`);
      const response = await fetch(env.EPISODES_CDN_URL);
      if (response.ok) {
        episodesJson = await response.text();
        console.log("Successfully fetched episodes.json from EPISODES_CDN_URL");
      } else {
        lastError = `CDN URL returned status: ${response.status}`;
        console.error(`Failed to fetch from EPISODES_CDN_URL: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      lastError = `CDN URL error: ${error}`;
      console.error("Error fetching from CDN:", error);
    }
  }

  // Fallback: fetch from the main site's CDN
  if (!episodesJson) {
    try {
      const fallbackUrl = "https://media.collectiveradio.com/episodes.json";
      console.log(`Fetching from fallback URL: ${fallbackUrl}`);
      const response = await fetch(fallbackUrl);
      if (response.ok) {
        episodesJson = await response.text();
        console.log("Successfully fetched episodes.json from fallback URL");
      } else {
        lastError = `Fallback URL returned status: ${response.status}`;
        console.error(`Failed to fetch from fallback URL: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      lastError = `Fallback URL error: ${error}`;
      console.error("Error fetching episodes.json from fallback:", error);
    }
  }

  if (!episodesJson) {
    console.error("Failed to fetch episodes.json from all sources. Last error:", lastError);
    return null;
  }

  try {
    const episodes: Episode[] = JSON.parse(episodesJson);
    console.log(`Parsed ${episodes.length} episodes from JSON`);
    const episode = episodes.find((ep) => ep.episodeNum === episodeNum);
    if (!episode) {
      console.error(`Episode ${episodeNum} not found in episodes array`);
    } else {
      console.log(`Found episode ${episodeNum}: ${episode.artists.join(" & ")} - ${episode.genre}`);
    }
    return episode || null;
  } catch (error) {
    console.error("Error parsing episodes.json:", error);
    return null;
  }
}

/**
 * Fetches Goldman font files and converts them to base64 data URIs
 * Caches the fonts to avoid fetching on every request
 */
async function getGoldmanFonts(): Promise<{ regular: string; bold: string }> {
  // Google Fonts API URLs for Goldman font (WOFF2 format)
  const regularUrl = "https://fonts.gstatic.com/s/goldman/v21/pe0uMIWbN4JFplR2LDJ4C8v8ATo.woff2";
  const boldUrl = "https://fonts.gstatic.com/s/goldman/v21/pe0sMIWbN4JFplR2FI5YJ8v8ATo.woff2";

  try {
    // Fetch both font files in parallel
    const [regularResponse, boldResponse] = await Promise.all([
      fetch(regularUrl),
      fetch(boldUrl),
    ]);

    if (!regularResponse.ok || !boldResponse.ok) {
      throw new Error("Failed to fetch fonts");
    }

    // Convert to base64
    const regularArrayBuffer = await regularResponse.arrayBuffer();
    const boldArrayBuffer = await boldResponse.arrayBuffer();

    // Convert ArrayBuffer to base64
    const arrayBufferToBase64 = (buffer: ArrayBuffer): string => {
      const bytes = new Uint8Array(buffer);
      let binary = "";
      for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      return btoa(binary);
    };

    const regularBase64 = arrayBufferToBase64(regularArrayBuffer);
    const boldBase64 = arrayBufferToBase64(boldArrayBuffer);

    return {
      regular: `data:font/woff2;base64,${regularBase64}`,
      bold: `data:font/woff2;base64,${boldBase64}`,
    };
  } catch (error) {
    console.error("Error fetching Goldman fonts:", error);
    // Return empty strings to fall back to system fonts
    return { regular: "", bold: "" };
  }
}

async function generateOGImage(episode: Episode): Promise<ArrayBuffer> {
  // OG image standard size: 1200x630px
  const width = 1200;
  const height = 630;

  // Escape text for SVG to prevent XSS
  const escapeXml = (unsafe: string): string => {
    return unsafe
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  };

  const episodeText = escapeXml(`Episode ${episode.episodeNum}`);
  const genre = escapeXml(episode.genre);

  // Logo URL - using the CDN URL
  const logoUrl = "https://www.collectiveradio.com/android-chrome-192x192.png";

  // Cover art square size (left side)
  const coverSize = height; // 630px square
  const coverX = 0;
  const coverY = 0;

  // Text area (right side)
  const textX = coverSize + 60; // Start after cover + padding
  const textStartY = 160; // Top padding
  const lineHeight = 60; // Equal spacing between lines
  const fontSize = 42; // Same font size for all lines

  // Logo size and position (bottom right)
  const logoSize = 120;
  const logoX = width - logoSize;
  const logoY = height - logoSize;

  // Calculate max width for artist text (from textX to before logo, with padding)
  const maxArtistWidth = logoX - textX - 40;

  // Prepare artist names with wrapping logic
  // If text is too long and there are 2 artists, split at " & "
  let artistLine1 = "";
  let artistLine2 = "";
  const fullArtistName = episode.artists.join(" & ");

  if (episode.artists.length === 2) {
    // Estimate text width more accurately
    // For Goldman font at 42px: average character width is approximately 0.6 * fontSize
    // This gives us ~25px per character on average
    const avgCharWidth = fontSize * 0.6;
    const estimatedWidth = fullArtistName.length * avgCharWidth;

    if (estimatedWidth > maxArtistWidth) {
      // Split at " & " - first line gets first artist + " &", second line gets second artist
      artistLine1 = escapeXml(episode.artists[0] + " &");
      artistLine2 = escapeXml(episode.artists[1]);
    } else {
      // Fits on one line
      artistLine1 = escapeXml(fullArtistName);
      artistLine2 = "";
    }
  } else {
    artistLine1 = escapeXml(fullArtistName);
    artistLine2 = "";
  }

  // Fetch Goldman fonts and embed them
  const fonts = await getGoldmanFonts();
  const fontFace = fonts.regular && fonts.bold
    ? `
      <defs>
        <style>
          @font-face {
            font-family: 'Goldman';
            font-style: normal;
            font-weight: 400;
            font-display: swap;
            src: url('${fonts.regular}') format('woff2');
          }
          @font-face {
            font-family: 'Goldman';
            font-style: normal;
            font-weight: 700;
            font-display: swap;
            src: url('${fonts.bold}') format('woff2');
          }
        </style>
      </defs>
    `
    : "";

  const fontFamily = fonts.regular && fonts.bold ? "Goldman, Arial, sans-serif" : "Arial, sans-serif";

  // Generate SVG matching the design
  const svg = `
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
          y="${textStartY + (lineHeight * 2)}" 
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
          y="${textStartY + (lineHeight * 3)}" 
          font-family="${fontFamily}" 
          font-size="${fontSize}" 
          font-weight="400" 
          fill="white"
        >
          ${artistLine2}
        </text>
        ` : ""}
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
  `.trim();

  // Return SVG as ArrayBuffer
  const encoded = new TextEncoder().encode(svg);
  return encoded.buffer as ArrayBuffer;
}
