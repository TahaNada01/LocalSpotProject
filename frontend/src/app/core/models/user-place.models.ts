export interface CreateUserPlace {
  name: string;
  category: string;
  addressLine: string;
  city: string;
  postalCode: string;
  country: string;
  shortDescription: string;
  priceRange?: '' | '€' | '€€' | '€€€';
  avgPrice?: number | null;
  openingHoursJson?: string;
}

export interface UpdateUserPlace {
  name?: string;
  category?: string;
  addressLine?: string;
  city?: string;
  postalCode?: string;
  country?: string;
  shortDescription?: string;
  priceRange?: '' | '€' | '€€' | '€€€';
  avgPrice?: number | null;
  openingHoursJson?: string; 
}

export interface UserPlaceResponse {
  id: number;
  name: string;
  imageUrl: string;
  createdById: number;
  openingHoursJson?: string | null; 
}
