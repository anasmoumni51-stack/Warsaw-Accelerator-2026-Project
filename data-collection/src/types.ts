// Google Places API (New) response types
export interface RawPlace {
  id: string;
  displayName?: { text: string; languageCode?: string };
  formattedAddress?: string;
  internationalPhoneNumber?: string;
  rating?: number;
  userRatingCount?: number;
  websiteUri?: string;
  types?: string[];
  location?: { latitude: number; longitude: number };
  priceLevel?: string;
}

export interface PlacesApiResponse {
  places: RawPlace[];
  nextPageToken?: string;
}

// Final cleaned salon shape for database
export interface CleanSalon {
  name: string;
  address: string;
  district: string;
  phone: string | null;
  website: string | null;
  services: string[];
  priceRange: string | null;
  rating: number | null;
  reviewCount: number;
  lat: number;
  lng: number;
}

// District center point for mapping
export interface DistrictCenter {
  name: string;
  lat: number;
  lng: number;
}
