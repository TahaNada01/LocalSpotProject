export interface PublicPlace {
  id: number;
  name: string;

  imageUrl?: string | null;
  createdById?: number | null;
  openingHoursJson?: string | null;

  
  addressLine?: string | null;
  city?: string | null;
  postalCode?: string | null;
  country?: string | null;
  category?: string | null;
  shortDescription?: string | null;
  avgPrice?: number | null;
  priceRange?: '€' | '€€' | '€€€' | null;
}

export interface PageResp<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}
