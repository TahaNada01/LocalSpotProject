import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

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

  // Tu pourras ajouter login(), logout(), me(), etc. ici ensuite
}
