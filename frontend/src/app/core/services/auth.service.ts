import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LoginRequest } from '../../core/models/login-request.model';
import { LoginResponse } from '../../core/models/login-response.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:9091/auth';

  constructor(private http: HttpClient) {}

  // Appel pour l'inscription
  register(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, data);
  }

  // ✅ Appel pour la connexion (login)
  login(data: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, data);
  }

  logout(): void {
    localStorage.removeItem('token');
  }
  
}
