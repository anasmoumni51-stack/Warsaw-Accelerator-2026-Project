import "dotenv/config";
import { writeFileSync, mkdirSync } from "node:fs";
import type { RawPlace, PlacesApiResponse } from "./utils/types.js";
import { QUERIES } from "./utils/queries.js";

const API_KEY = process.env.GOOGLE_API_KEY;
if (!API_KEY) {
  console.error("Missing GOOGLE_API_KEY in .env");
  process.exit(1);
}

const ENDPOINT = "https://places.googleapis.com/v1/places:searchText";
const FIELD_MASK =
  "places.id,places.displayName,places.formattedAddress,places.addressComponents,places.internationalPhoneNumber,places.rating,places.userRatingCount,places.websiteUri,places.types,places.location,places.priceLevel,places.photos,places.editorialSummary,nextPageToken";

async function searchPage(
  query: string,
  pageToken?: string
): Promise<PlacesApiResponse> {
  const body: Record<string, unknown> = {
    textQuery: query,
    maxResultCount: 20,
  };
  if (pageToken) {
    body.pageToken = pageToken;
  }

  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": API_KEY!,
      "X-Goog-FieldMask": FIELD_MASK,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API error ${res.status}: ${text}`);
  }

  return (await res.json()) as PlacesApiResponse;
}

async function searchAll(query: string): Promise<RawPlace[]> {
  const results: RawPlace[] = [];
  let pageToken: string | undefined;
  let page = 0;

  do {
    page++;
    console.log(`  Query "${query}" — page ${page}`);
    const data = await searchPage(query, pageToken);
    if (data.places) {
      results.push(...data.places);
    }
    pageToken = data.nextPageToken;

    // Google requires a short delay before using nextPageToken
    if (pageToken) {
      await new Promise((r) => setTimeout(r, 2000));
    }
  } while (pageToken);

  return results;
}

async function collect() {
  console.log("Starting data collection from Google Places API...");

  // Run all queries in parallel
  const results = await Promise.all(
    QUERIES.map(async (query) => {
      console.log(`Searching: "${query}"`);
      try {
        const places = await searchAll(query);
        console.log(`  Found ${places.length} results`);
        return places;
      } catch (err) {
        console.error(`  ✗ Failed "${query}": ${err}`);
        return [];
      }
    })
  );

  // Concatenate all results
  const allResults = results.flat();
  console.log(`Collection complete.`);
  console.log(`Total raw results: ${allResults.length}`);

  mkdirSync("output", { recursive: true });
  writeFileSync("output/raw-salons.json", JSON.stringify(allResults, null, 2));
  console.log(`Saved to output/raw-salons.json`);
}

collect().catch((err) => {
  console.error("Collection failed:", err);
  process.exit(1);
});
