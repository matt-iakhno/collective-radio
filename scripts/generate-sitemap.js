import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read episodes.json
const episodesPath = path.join(__dirname, "../src/assets/episodes.json");
const episodes = JSON.parse(fs.readFileSync(episodesPath, "utf-8"));

// Get current date for lastmod
const currentDate = new Date().toISOString().split("T")[0];

// Generate sitemap
const baseUrl = "https://www.collectiveradio.com";
const urls = [];

// Home page
urls.push({
  loc: baseUrl,
  lastmod: currentDate,
  changefreq: "weekly",
  priority: "1.0",
});

// Episode pages
episodes.forEach((episode) => {
  urls.push({
    loc: `${baseUrl}/${episode.episodeNum}`,
    lastmod: episode.releaseDate || currentDate,
    changefreq: "monthly",
    priority: "0.8",
  });
});

// Generate XML
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${urls
  .map(
    (url) => `    <url>
        <loc>${url.loc}</loc>
        <lastmod>${url.lastmod}</lastmod>
        <changefreq>${url.changefreq}</changefreq>
        <priority>${url.priority}</priority>
    </url>`,
  )
  .join("\n")}
</urlset>`;

// Write to public folder
const outputPath = path.join(__dirname, "../public/sitemap.xml");
fs.writeFileSync(outputPath, sitemap, "utf-8");

console.log(`✅ Generated sitemap.xml with ${urls.length} URLs`);
console.log(`   - Home page: 1`);
console.log(`   - Episodes: ${episodes.length}`);
