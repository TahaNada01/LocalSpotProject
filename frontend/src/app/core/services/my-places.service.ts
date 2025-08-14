import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MyPlace } from '../models/my-place.model';
import { environment } from '../../../environments/environment';

export type UpdateMyPlacePayload = {
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
};

@Injectable({ providedIn: 'root' })
export class MyPlacesService {
  // base alignée sur environment
  private base = `${environment.apiUrl}/api/places/user`;

  constructor(private http: HttpClient) {}

  listMine(): Observable<MyPlace[]> {
    return this.http.get<MyPlace[]>(`${this.base}/mine`);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }

  update(id: number, payload: UpdateMyPlacePayload, newPhoto?: File): Observable<MyPlace> {
    const fd = new FormData();

    
    const body: UpdateMyPlacePayload = {
      name: payload.name ?? null as any,
      category: payload.category ?? null as any,
      addressLine: payload.addressLine ?? null as any,
      city: payload.city ?? null as any,
      postalCode: payload.postalCode ?? null as any,
      country: payload.country ?? null as any,
      shortDescription: payload.shortDescription ?? null as any,
      // autorise '' pour "auto", sinon '€' | '€€' | '€€€' | null
      priceRange: (payload.priceRange ?? null) as any,
      avgPrice: payload.avgPrice ?? null,
      openingHoursJson: payload.openingHoursJson ?? null as any,
    };

    
    fd.append('place', new Blob([JSON.stringify(body)], { type: 'application/json' }));
    if (newPhoto) fd.append('photo', newPhoto);

    // Laisser le navigateur définir le Content-Type (boundary)
    return this.http.put<MyPlace>(`${this.base}/${id}`, fd);
  }

 
}
