import { readFileSync, writeFileSync } from "node:fs";
import type { RawPlace, CleanSalon } from "./types.js";
import { getDistrict } from "./districts.js";

// Google price level enum → human-readable
const PRICE_MAP: Record<string, string> = {
  PRICE_LEVEL_FREE: "budget",
  PRICE_LEVEL_INEXPENSIVE: "budget",
  PRICE_LEVEL_MODERATE: "moderate",
  PRICE_LEVEL_EXPENSIVE: "expensive",
  PRICE_LEVEL_VERY_EXPENSIVE: "premium",
};

// Core salon types — only businesses that match these are kept
const SALON_TYPES = new Set([
  "hair_salon",
  "hair_care",
  "beauty_salon",
  "nail_salon",
  "skin_care_clinic",
  "barber_shop",
  "beautician",
  "makeup_artist",
]);

// Google types → service labels
const SERVICE_MAP: Record<string, string> = {
  hair_care: "Hair Styling",
  hair_salon: "Hair Styling",
  beauty_salon: "Beauty Treatment",
  nail_salon: "Nail Care",
  skin_care_clinic: "Skin Care",
  barber_shop: "Barber",
  beautician: "Beauty Treatment",
  makeup_artist: "Makeup",
};

function normalize(str: string): string {
  return str.trim().toLowerCase().replace(/\s+/g, " ");
}

function normalizePhone(raw: string | undefined): string | null {
  if (!raw) return null;
  const digits = raw.replace(/\D/g, "");
  if (digits.length < 9) return null;
  // Polish numbers: 9 digits locally, or 11 with country code 48
  if (digits.startsWith("48") && digits.length >= 11) {
    return `+48 ${digits.slice(2, 5)} ${digits.slice(5, 8)} ${digits.slice(8)}`;
  }
  if (digits.length === 9) {
    return `+48 ${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`;
  }
  return `+${digits}`;
}

function normalizeWebsite(raw: string | undefined): string | null {
  if (!raw) return null;
  let url = raw.trim();
  if (!url.startsWith("http")) {
    url = `https://${url}`;
  }
  try {
    new URL(url);
    return url;
  } catch {
    return null;
  }
}

function clampRating(rating: number | undefined): number | null {
  if (rating === undefined || rating === null) return null;
  if (rating < 0 || rating > 5) return null;
  return Math.round(rating * 10) / 10;
}

function mapPriceLevel(level: string | undefined): string | null {
  if (!level) return null;
  return PRICE_MAP[level] ?? null;
}

function mapServices(types: string[] | undefined): string[] {
  if (!types) return [];
  const services: string[] = [];
  for (const type of types) {
    const label = SERVICE_MAP[type];
    if (label && !services.includes(label)) {
      services.push(label);
    }
  }
  return services;
}

function dedup(places: RawPlace[]): RawPlace[] {
  const byKey = new Map<string, RawPlace>();

  for (const place of places) {
    const name = normalize(place.displayName?.text ?? "");
    const addr = normalize(place.formattedAddress ?? "");
    if (!name || !addr) continue;

    const key = `${name}|${addr}`;
    const existing = byKey.get(key);

    if (!existing) {
      byKey.set(key, place);
    } else {
      // Keep the one with more data (more fields populated)
      const existingScore = countFields(existing);
      const newScore = countFields(place);
      if (newScore > existingScore) {
        byKey.set(key, place);
      }
    }
  }

  return Array.from(byKey.values());
}

function countFields(place: RawPlace): number {
  let count = 0;
  if (place.displayName?.text) count++;
  if (place.formattedAddress) count++;
  if (place.internationalPhoneNumber) count++;
  if (place.rating !== undefined) count++;
  if (place.userRatingCount !== undefined) count++;
  if (place.websiteUri) count++;
  if (place.types?.length) count++;
  if (place.location) count++;
  if (place.priceLevel) count++;
  return count;
}

function isSalon(types: string[] | undefined, name: string): boolean {
  if (types && types.some((t) => SALON_TYPES.has(t))) return true;
  // Fallback: keep if name contains salon-related keywords (Google miscategorized)
  const lower = name.toLowerCase();
  const keywords = ["fryzjer", "salon", "hair", "beauty", "nails", "barber", "kosmetycz"];
  return keywords.some((kw) => lower.includes(kw));
}

function transform(place: RawPlace): CleanSalon | null {
  const name = place.displayName?.text?.trim();
  const address = place.formattedAddress?.trim();
  if (!name || !address) return null;
  if (!isSalon(place.types, name)) return null;

  const loc = place.location;
  const lat = loc?.latitude ?? 0;
  const lng = loc?.longitude ?? 0;

  return {
    name,
    address,
    district: lat && lng ? getDistrict(lat, lng) : "Unknown",
    phone: normalizePhone(place.internationalPhoneNumber),
    website: normalizeWebsite(place.websiteUri),
    services: mapServices(place.types),
    priceRange: mapPriceLevel(place.priceLevel),
    rating: clampRating(place.rating),
    reviewCount: place.userRatingCount ?? 0,
    lat,
    lng,
  };
}

function validate() {
  console.log("Reading raw-salons.json...");
  const raw: RawPlace[] = JSON.parse(readFileSync("raw-salons.json", "utf-8"));
  console.log(`Raw records: ${raw.length}`);

  console.log("\nDeduplicating...");
  const deduped = dedup(raw);
  console.log(`After dedup: ${deduped.length}`);

  console.log("\nTransforming and validating...");
  const cleaned: CleanSalon[] = [];
  let skipped = 0;

  for (const place of deduped) {
    const salon = transform(place);
    if (salon) {
      cleaned.push(salon);
    } else {
      skipped++;
    }
  }

  console.log(`Clean records: ${cleaned.length}`);
  console.log(`Skipped (missing name/address): ${skipped}`);

  // Summary stats
  const districts = new Map<string, number>();
  for (const s of cleaned) {
    districts.set(s.district, (districts.get(s.district) ?? 0) + 1);
  }
  console.log("\nBy district:");
  for (const [d, count] of [...districts.entries()].sort((a, b) => b[1] - a[1])) {
    console.log(`  ${d}: ${count}`);
  }

  const withPhone = cleaned.filter((s) => s.phone).length;
  const withWebsite = cleaned.filter((s) => s.website).length;
  const withRating = cleaned.filter((s) => s.rating !== null).length;
  console.log(`\nData completeness:`);
  console.log(`  Phone: ${withPhone}/${cleaned.length}`);
  console.log(`  Website: ${withWebsite}/${cleaned.length}`);
  console.log(`  Rating: ${withRating}/${cleaned.length}`);

  writeFileSync("clean-salons.json", JSON.stringify(cleaned, null, 2));
  console.log(`\nSaved to clean-salons.json`);
}

validate();
