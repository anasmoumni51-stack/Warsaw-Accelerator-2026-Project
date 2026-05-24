import "dotenv/config";
import { readFileSync, writeFileSync } from "node:fs";
import type { CleanSalon } from "./types.js";

const DEFAULT_IMAGE_URL = "https://images.unsplash.com/photo-1560066984-138dadb4c035?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80";

/**
 * Fetch the public photoUri from Google Places API metadata
 */
async function resolvePhotoUrl(googlePhotoUrl: string, apiKey: string): Promise<string> {
  const urlWithKey = `${googlePhotoUrl}&key=${apiKey}`;
  
  try {
    const response = await fetch(urlWithKey, {
      redirect: 'manual' // Don't follow redirects automatically
    });
    
    // Check if we got a redirect (Google often redirects to the actual image)
    if (response.status === 302 || response.status === 301) {
      const location = response.headers.get('location');
      if (location) {
        return location;
      }
    }
    
    // Try to parse as JSON first
    const contentType = response.headers.get('content-type');
    if (contentType?.includes('application/json')) {
      const metadata = await response.json();
      const photoUri = metadata.photoUri || metadata.uri;
      if (photoUri) {
        return photoUri;
      }
    }
    
    // If we get here, the response might be the image itself
    // Check if it's a valid image by looking at content-type
    if (contentType?.includes('image/')) {
      // The URL we called is actually the direct image URL
      // Return the URL without the API key parameter
      return googlePhotoUrl;
    }
    
    throw new Error(`Unexpected response: ${response.status}`);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to resolve photo: ${message}`, { cause: error });
  }
}

async function fetchPhotos() {
  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    console.error("Missing GOOGLE_API_KEY in .env");
    process.exit(1);
  }

  console.log("Reading validated-salons.json...");
  const salons: CleanSalon[] = JSON.parse(
    readFileSync("output/validated-salons.json", "utf-8")
  );
  console.log(`Found ${salons.length} salons\n`);

  let resolved = 0;
  let failed = 0;
  let skipped = 0;

  for (let i = 0; i < salons.length; i++) {
    const salon = salons[i];
    const progress = `[${i + 1}/${salons.length}]`;

    // Skip if no image URL
    if (!salon.imageUrl || salon.imageUrl === "") {
      salon.imageUrl = DEFAULT_IMAGE_URL;
      skipped++;
      continue;
    }

    // Skip if already resolved (not a Google Places URL)
    if (!salon.imageUrl.includes("places.googleapis.com")) {
      skipped++;
      continue;
    }

    try {
      console.log(`${progress} Resolving ${salon.name}...`);
      const publicUrl = await resolvePhotoUrl(salon.imageUrl, apiKey);
      salon.imageUrl = publicUrl;
      resolved++;
      console.log(`  ✓ Resolved to public URL`);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.error(`  ✗ ${message}, using default image`);
      salon.imageUrl = DEFAULT_IMAGE_URL;
      failed++;
    }
  }

  writeFileSync("output/clean-salons.json", JSON.stringify(salons, null, 2));

  console.log(`\nFetch complete:`);
  console.log(`  Resolved: ${resolved}`);
  console.log(`  Failed: ${failed}`);
  console.log(`  Skipped: ${skipped}`);
  console.log(`\nUpdated clean-salons.json saved`);
}

fetchPhotos().catch((err) => {
  console.error("Fetch photos failed:", err);
  process.exit(1);
});
