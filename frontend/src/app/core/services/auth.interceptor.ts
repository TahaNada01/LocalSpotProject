import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('token');

    let authReq = req;
    if (token) {
      authReq = req.clone({
        setHeaders: { Authorization: `Bearer ${token}` },
      });
    }

    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401 && localStorage.getItem('refreshToken')) {
          // Tentative de refresh du token
          return this.authService.refreshToken().pipe(
            switchMap((res) => {
              const newToken = res.token;
              const newReq = req.clone({
                setHeaders: { Authorization: `Bearer ${newToken}` },
              });
              return next.handle(newReq); // Relancer la requête
            }),
            catchError(() => {
              this.authService.logout();
              window.location.href = '/auth/login'; // Redirection manuelle
              return throwError(() => new Error('Session expired'));
            })
          );
        }
        return throwError(() => error);
      })
    );
  }
}
