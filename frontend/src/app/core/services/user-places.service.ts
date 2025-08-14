import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CreateUserPlace, UpdateUserPlace, UserPlaceResponse } from '../models/user-place.models';
import { Observable } from 'rxjs';

const BASE = 'http://localhost:9091/api/places/user';

@Injectable({ providedIn: 'root' })
export class UserPlacesService {
  constructor(private http: HttpClient) {}

  create(data: CreateUserPlace, photo?: File | undefined): Observable<UserPlaceResponse> {
    const fd = new FormData();
    fd.append('data', new Blob([JSON.stringify(data)], { type: 'application/json' }));
    if (photo) fd.append('photo', photo);
    return this.http.post<UserPlaceResponse>(BASE, fd);
  }

  update(id: number, data: UpdateUserPlace, photo?: File | undefined): Observable<UserPlaceResponse> {
    const fd = new FormData();
    fd.append('data', new Blob([JSON.stringify(data)], { type: 'application/json' }));
    if (photo) fd.append('photo', photo);
    return this.http.patch<UserPlaceResponse>(`${BASE}/${id}`, fd);
  }

  getMine(): Observable<UserPlaceResponse[]> {
    return this.http.get<UserPlaceResponse[]>(`${BASE}/mine`);
  }

  getOne(id: number): Observable<UserPlaceResponse> {
    return this.http.get<UserPlaceResponse>(`${BASE}/${id}`);
  }

  delete(id: number) {
    return this.http.delete(`${BASE}/${id}`);
  }
}
