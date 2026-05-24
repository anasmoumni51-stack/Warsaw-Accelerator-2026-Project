// Google Places API (New) response types
export interface PlacePhoto {
  name: string;
  widthPx?: number;
  heightPx?: number;
}

export interface AddressComponent {
  longText: string;
  types?: string[];
}

export interface RawPlace {
  id: string;
  displayName?: { text: string; languageCode?: string };
  formattedAddress?: string;
  addressComponents?: AddressComponent[];
  internationalPhoneNumber?: string;
  rating?: number;
  userRatingCount?: number;
  websiteUri?: string;
  types?: string[];
  location?: { latitude: number; longitude: number };
  priceLevel?: string;
  photos?: PlacePhoto[];
  editorialSummary?: { text: string };
}

export interface PlacesApiResponse {
  places: RawPlace[];
  nextPageToken?: string;
}

// Final cleaned salon shape for database
export interface CleanSalon {
  name: string;
  nameNorm: string;
  address: string;
  addressNorm: string;
  streetNumber: string;
  district: string;
  city: string;
  country: string;
  postcode: string;
  phone: string;
  website: string;
  services: string[];
  priceRange: string;
  rating: number;
  reviewCount: number;
  lat: number;
  lng: number;
  imageUrl: string;
}

// District center point for mapping
export interface DistrictCenter {
  name: string;
  lat: number;
  lng: number;
}
