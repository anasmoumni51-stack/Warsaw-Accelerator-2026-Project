export interface Salon {
  id: number;
  name: string;
  address: string;
  streetNumber?: string;
  district: string;
  city: string;
  country: string;
  postcode: string;
  phone?: string;
  website?: string;
  services: string[];
  priceRange: string;
  rating: number;
  reviewCount: number;
  imageUrl?: string;
  lat: number;
  lng: number;
}

export interface SalonSummary {
  id: number;
  name: string;
  district: string;
  rating: number;
  priceRange: string;
  imageUrl?: string;
  lat: number;
  lng: number;
  services: string[];
  reviewCount: number;
}

export interface SalonDetail extends Salon {
  // SalonDetail has all fields from Salon
}

export interface SalonUpdate {
  name: string;
  address: string;
  streetNumber?: string | null;
  city?: string | null;
  country?: string | null;
  postcode?: string | null;
  district: string;
  phone: string;
  website: string;
  services: string[];
  priceRange?: string | null;
  rating: number;
  reviewCount: number;
}

export interface SalonFilters {
  district?: string;
  service?: string;
}

export interface PaginatedResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

export interface Service {
  id: string;
  label: string;
  icon: React.ComponentType;
}

export interface FilterState {
  services: string[];
  district: string;
  priceMin: number;
  priceMax: number;
  minRating: number;
  search: string;
}
