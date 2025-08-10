import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class PlaceService {
  private readonly baseUrl = 'http://localhost:9091/api/places'; 

  constructor(private http: HttpClient) {}

 
  getPlaces(ville: string, type: string): Observable<any> {
    return this.http.get(`${this.baseUrl}`, { params: { ville, type } });
  }

  
  getNextPage(token: string): Observable<any> {
    return this.http.get<any>(
      'https://maps.googleapis.com/maps/api/place/textsearch/json',
      { params: { pagetoken: token, key: environment.googleApiKey } }
    );
  }

  //Détails d’un lieu (via backend)
  getPlaceDetails(placeId: string): Observable<any> {
    const params = new HttpParams()
      .set('placeId', placeId)
      .set(
        'fields',
        'place_id,name,formatted_address,geometry,opening_hours,website,' +
          'international_phone_number,rating,user_ratings_total,price_level,types,photos,reviews'
      );

    // L’API backend renvoie { result: {...}, status: "OK" } -> on map sur result
    return this.http
      .get<{ result: any }>(`${this.baseUrl}/details`, { params })
      .pipe(map(res => res.result));
  }

  //URL photo (via backend)
  getPhotoUrl(photoRef: string, maxWidth = 900): string {
    return `${this.baseUrl}/photo?photoreference=${encodeURIComponent(photoRef)}&maxwidth=${maxWidth}`;
  }
}
