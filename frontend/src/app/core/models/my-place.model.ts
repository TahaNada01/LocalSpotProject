export interface MyPlace {
  id: number;
  name: string;
  imageUrl?: string;
  createdById?: number;
  openingHoursJson?: string;

  addressLine?: string;
  city?: string;
  postalCode?: string;
  country?: string;

  category?: string;
  shortDescription?: string;
  avgPrice?: number | null;
  priceRange?: '€' | '€€' | '€€€' | '' | null;
}
