import type { DistrictCenter } from "./types.js";

// Warsaw's 18 districts with approximate center coordinates
export const WARSAW_DISTRICTS: DistrictCenter[] = [
  { name: "Mokotów", lat: 52.1922, lng: 21.0083 },
  { name: "Praga-Południe", lat: 52.2400, lng: 21.0600 },
  { name: "Ursynów", lat: 52.1500, lng: 21.0300 },
  { name: "Wola", lat: 52.2400, lng: 20.9600 },
  { name: "Bielany", lat: 52.2800, lng: 20.9300 },
  { name: "Targówek", lat: 52.2800, lng: 21.0600 },
  { name: "Bemowo", lat: 52.2500, lng: 20.9100 },
  { name: "Śródmieście", lat: 52.2297, lng: 21.0122 },
  { name: "Białołęka", lat: 52.3100, lng: 21.0000 },
  { name: "Ochota", lat: 52.2100, lng: 20.9800 },
  { name: "Wawer", lat: 52.2100, lng: 21.1500 },
  { name: "Praga-Północ", lat: 52.2600, lng: 21.0300 },
  { name: "Ursus", lat: 52.2000, lng: 20.8800 },
  { name: "Żoliborz", lat: 52.2700, lng: 20.9800 },
  { name: "Włochy", lat: 52.1800, lng: 20.9200 },
  { name: "Wilanów", lat: 52.1700, lng: 21.0900 },
  { name: "Wesoła", lat: 52.2500, lng: 21.1300 },
  { name: "Rembertów", lat: 52.2600, lng: 21.1100 },
];

// Haversine distance in kilometers
function haversine(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// Find the nearest Warsaw district for given coordinates
export function getDistrict(lat: number, lng: number): string {
  let nearest = WARSAW_DISTRICTS[0];
  let minDist = Infinity;

  for (const district of WARSAW_DISTRICTS) {
    const dist = haversine(lat, lng, district.lat, district.lng);
    if (dist < minDist) {
      minDist = dist;
      nearest = district;
    }
  }

  return nearest.name;
}
