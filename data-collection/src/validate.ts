import "dotenv/config";
import { readFileSync, writeFileSync } from "node:fs";
import type { RawPlace, CleanSalon, AddressComponent } from "./utils/types.js";
import { getDistrict } from "./utils/districts.js";

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

export function normalize(str: string): string {
  return str.trim().toLowerCase().replace(/\s+/g, " ");
}

export function cleanName(raw: string): string {
  let name = raw.trim();
  // Remove decorative symbols
  // eslint-disable-next-line no-misleading-character-class
  name = name.replace(/[★✦⭐☆⚡✂️💇💅🌟]+/gu, "").trim();
  // Remove "Warszawa" / "Warsaw" suffixes (with optional dash/comma)
  name = name.replace(/[,.\-\s]*(warszawa|warsaw)\s*$/i, "").trim();
  // Collapse multiple spaces
  name = name.replace(/\s+/g, " ");
  // Trim to 80 chars
  if (name.length > 80) {
    name = name.substring(0, 80).trim();
  }
  return name;
}

export function normalizePhone(raw: string | undefined): string | null {
  if (!raw) return null;
  const digits = raw.replace(/\D/g, "");
  if (digits.length < 9) return null;
  // Polish numbers: 9 digits locally, or 11 with country code 48
  if (digits.startsWith("48") && digits.length >= 11) {
    return `+48 ${digits.slice(2, 5)} ${digits.slice(5, 8)} ${digits.slice(8, 11)}`;
  }
  if (digits.length === 9) {
    return `+48 ${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`;
  }
  return `+${digits}`;
}

export function normalizeWebsite(raw: string | undefined): string | null {
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

export function clampRating(rating: number | undefined): number | null {
  if (rating === undefined || rating === null) return null;
  if (rating < 0 || rating > 5) return null;
  return Math.round(rating * 10) / 10;
}

export function mapServices(types: string[] | undefined): string[] {
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

export function dedup(places: RawPlace[]): RawPlace[] {
  const byKey = new Map<string, RawPlace>();

  for (const place of places) {
    const name = normalize(cleanName(place.displayName?.text ?? ""));
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

// District tiers
const DISTRICT_PREMIUM = new Set(["Śródmieście", "Wola", "Mokotów"]);
const DISTRICT_MID = new Set(["Żoliborz", "Ochota", "Praga-Południe", "Bielany", "Ursynów", "Wilanów"]);

// Service tiers (premium = clinic/full-service, budget = single-focus)
const SERVICE_PREMIUM = new Set(["Skin Care", "Beauty Treatment", "Makeup"]);

// Google Places returns null priceLevel for Polish salons (tested 2026-05-24)
// So we estimate based on district tier + service breadth
export function assignPriceRange(district: string, services: string[]): string {
  const hasPremiumService = services.some((s) => SERVICE_PREMIUM.has(s));
  const multiService = services.length >= 2;
  const isPremiumDistrict = DISTRICT_PREMIUM.has(district);
  const isMidDistrict = DISTRICT_MID.has(district);

  // zł zł zł — premium district with multiple services or a premium service
  if (isPremiumDistrict && (multiService || hasPremiumService)) return "zł zł zł";
  // zł zł — premium district (1 service), or mid district with 2+ services
  if (isPremiumDistrict || (isMidDistrict && multiService)) return "zł zł";
  // zł — everything else
  return "zł";
}

// Extract city, country, postcode, street, street number from Google addressComponents
function extractAddress(components?: AddressComponent[]): {
  address: string;
  streetNumber: string;
  city: string;
  country: string;
  postcode: string;
} {
  if (!components) return { address: "", streetNumber: "", city: "", country: "", postcode: "" };

  const route = components.find((c) => c.types?.includes("route"));
  const streetNum = components.find((c) => c.types?.includes("street_number"));
  const subpremise = components.find((c) => c.types?.includes("subpremise"));
  const city = components.find((c) => c.types?.includes("locality"));
  const country = components.find((c) => c.types?.includes("country"));
  const postcode = components.find((c) => c.types?.includes("postal_code"));

  // Combine street number + unit if both exist (e.g., "4/U9")
  let streetNumber = streetNum?.longText?.trim() ?? "";
  if (subpremise?.longText) {
    streetNumber = streetNumber ? `${streetNumber}/${subpremise.longText.trim()}` : subpremise.longText.trim();
  }

  return {
    address: route?.longText?.trim() ?? "",
    streetNumber,
    city: city?.longText?.trim() ?? "",
    country: country?.longText?.trim() ?? "",
    postcode: postcode?.longText?.trim() ?? "",
  };
}

// Build Google Places photo URL from photo name (without API key)
function buildPhotoUrl(photoName: string | undefined): string {
  if (!photoName) return "";
  return `https://places.googleapis.com/v1/${photoName}/media?maxWidthPx=800`;
}

function transform(place: RawPlace): CleanSalon | null {
  const name = cleanName(place.displayName?.text ?? "");
  const fullAddress = place.formattedAddress?.trim();
  if (!name || !fullAddress) return null;

  const loc = place.location;
  const lat = loc?.latitude ?? 0;
  const lng = loc?.longitude ?? 0;
  const district = lat && lng ? getDistrict(lat, lng) : "Unknown";
  const { address, streetNumber, city, country, postcode } = extractAddress(place.addressComponents);

  // Skip if no street address — bad data
  if (!address) return null;

  // Map services first — only keep places with at least one desired service
  const services = mapServices(place.types);
  if (services.length === 0) return null;

  // Exclude salons with 0 or null rating
  const rating = clampRating(place.rating);
  if (!rating || rating === 0) return null;

  // Build Google Places photo URL from first photo (without API key)
  const photos = place.photos ?? [];
  const imageUrl = photos.length > 0 ? buildPhotoUrl(photos[0]?.name) : "";

  return {
    name,
    nameNorm: normalize(name),
    address,
    addressNorm: normalize(fullAddress),
    streetNumber,
    district,
    city,
    country,
    postcode,
    phone: normalizePhone(place.internationalPhoneNumber) ?? "",
    website: normalizeWebsite(place.websiteUri) ?? "",
    services,
    priceRange: assignPriceRange(district, services),
    rating,
    reviewCount: place.userRatingCount ?? 0,
    lat,
    lng,
    imageUrl,
  };
}

function validate() {
  console.log("Reading output/raw-salons.json...");
  const raw: RawPlace[] = JSON.parse(readFileSync("output/raw-salons.json", "utf-8"));
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
  console.log(`Skipped (missing name/address or not a salon): ${skipped}`);

  // Summary stats
  const districts = new Map<string, number>();
  for (const s of cleaned) {
    districts.set(s.district, (districts.get(s.district) ?? 0) + 1);
  }
  console.log("\nBy district:");
  for (const [d, count] of [...districts.entries()].sort((a, b) => b[1] - a[1])) {
    console.log(`  ${d}: ${count}`);
  }

  const withPhone = cleaned.filter((s) => s.phone !== "").length;
  const withWebsite = cleaned.filter((s) => s.website !== "").length;
  const withRating = cleaned.filter((s) => s.rating > 0).length;
  const withPhotos = cleaned.filter((s) => s.imageUrl !== "").length;
  const withPrice = cleaned.filter((s) => s.priceRange !== "").length;
  console.log(`\nData completeness:`);
  console.log(`  Phone: ${withPhone}/${cleaned.length}`);
  console.log(`  Website: ${withWebsite}/${cleaned.length}`);
  console.log(`  Rating: ${withRating}/${cleaned.length}`);
  console.log(`  Photos: ${withPhotos}/${cleaned.length}`);
  console.log(`  Price range: ${withPrice}/${cleaned.length}`);

  writeFileSync("output/validated-salons.json", JSON.stringify(cleaned, null, 2));
  console.log(`\nSaved to output/validated-salons.json`);
}

validate();
