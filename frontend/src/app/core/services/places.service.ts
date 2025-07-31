import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PlaceService {

  constructor(private http: HttpClient) {}

  getPlaces(ville: string, type: string): Observable<any> {
    return this.http.get(`http://localhost:9091/api/places`, {
      params: { ville, type }
    });
  }

  getNextPage(token: string) {
    return this.http.get<any>(
      `https://maps.googleapis.com/maps/api/place/textsearch/json?pagetoken=${token}&key=${environment.googleApiKey}`
    );
  }
}
