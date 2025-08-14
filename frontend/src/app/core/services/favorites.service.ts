import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Favorite } from '../models/favorite.model';

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {
  private baseUrl = 'http://localhost:9091/favorites';

  constructor(private http: HttpClient) {}

  getFavorites(): Observable<Favorite[]> {
    return this.http.get<Favorite[]>(this.baseUrl);
  }

  deleteFavorite(placeId: string): Observable<string> {
    return this.http.delete(`${this.baseUrl}/${placeId}`, {
      responseType: 'text' as 'text' 
    });
  }

  addFavorite(favorite: Favorite): Observable<Favorite> {
    return this.http.post<Favorite>(this.baseUrl, favorite);
  }
}
