// src/app/core/services/community.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PageResp, PublicPlace } from '../models/community.models';

@Injectable({ providedIn: 'root' })
export class CommunityService {
  private baseUrl = 'http://localhost:9091/api/places/public';

  constructor(private http: HttpClient) {}

  list(params: { page?: number; size?: number; city?: string; category?: string }): Observable<PageResp<PublicPlace>> {
    const p = new HttpParams({
      fromObject: {
        page: String(params.page ?? 0),
        size: String(params.size ?? 12),
        ...(params.city ? { city: params.city } : {}),
        ...(params.category ? { category: params.category } : {}),
      }
    });
    return this.http.get<PageResp<PublicPlace>>(this.baseUrl, { params: p });
  }

  getOne(id: number): Observable<PublicPlace> {
    return this.http.get<PublicPlace>(`${this.baseUrl}/${id}`);
  }
}
