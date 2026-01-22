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
  const artistName = escapeXml(episode.artists.join(" & "));
  
  // Logo URL - using the CDN URL
  const logoUrl = "https://www.collectiveradio.com/android-chrome-192x192.png";
  
  // Cover art square size (left side)
  const coverSize = height; // 630px square
  const coverX = 0;
  const coverY = 0;
  
  // Text area (right side)
  const textX = coverSize + 60; // Start after cover + padding
  const textStartY = 150; // Top padding
  const lineHeight = 60; // Equal spacing between lines
  const fontSize = 42; // Same font size for all lines
  
  // Logo size and position (bottom right)
  const logoSize = 120;
  const logoX = width - logoSize;
  const logoY = height - logoSize;

  // Generate SVG matching the design
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
      <defs>
        <!-- Import Goldman font from Google Fonts -->
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Goldman:wght@400;700&display=swap');
        </style>
      </defs>
      
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
          font-family="Goldman, Arial, sans-serif" 
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
          font-family="Goldman, Arial, sans-serif" 
          font-size="${fontSize}" 
          font-weight="400" 
          fill="white"
        >
          ${genre}
        </text>
        
        <!-- Artist name -->
        <text 
          x="${textX}" 
          y="${textStartY + (lineHeight * 2)}" 
          font-family="Goldman, Arial, sans-serif" 
          font-size="${fontSize}" 
          font-weight="400" 
          fill="white"
        >
          ${artistName}
        </text>
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
  return new TextEncoder().encode(svg);
}
