/**
 * Script to clear all OG image cache entries from Cloudflare KV
 * Usage: node clear-cache.js [episodeNum]
 * If episodeNum is provided, only that episode is cleared
 * If no episodeNum, all episodes are cleared
 */

import { execSync } from 'child_process';

const namespaceId = 'd990c390b51347c3a58dbfe2c477b723';
const episodeNum = process.argv[2];

if (episodeNum) {
  // Delete specific episode
  const key = `og-image-${episodeNum}`;
  console.log(`Deleting cache for episode ${episodeNum}...`);
  try {
    execSync(`wrangler kv key delete --namespace-id=${namespaceId} "${key}"`, {
      stdio: 'inherit'
    });
    console.log(`✅ Cleared cache for episode ${episodeNum}`);
  } catch (error) {
    console.error(`❌ Error deleting key: ${error.message}`);
  }
} else {
  // List all keys and delete them
  console.log('Fetching all cache keys...');
  try {
    const output = execSync(
      `wrangler kv key list --namespace-id=${namespaceId}`,
      { encoding: 'utf-8' }
    );
    
    const keys = JSON.parse(output);
    console.log(`Found ${keys.length} cached images`);
    
    for (const keyObj of keys) {
      const key = keyObj.name;
      console.log(`Deleting ${key}...`);
      try {
        execSync(`wrangler kv key delete --namespace-id=${namespaceId} "${key}"`, {
          stdio: 'pipe'
        });
      } catch (error) {
        console.error(`Error deleting ${key}: ${error.message}`);
      }
    }
    
    console.log(`✅ Cleared all ${keys.length} cached images`);
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    console.error('Make sure you have wrangler installed and are authenticated');
  }
}
