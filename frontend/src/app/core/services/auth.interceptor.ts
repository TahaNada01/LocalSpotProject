import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { HttpErrorResponse, HttpRequest, HttpHandlerFn } from '@angular/common/http';
import { catchError, switchMap, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn) => {
  const authService = inject(AuthService);

  // Ne pas intercepter les appels externes (ex: Google Places API)
  const isExternalRequest = req.url.startsWith('https://places.googleapis.com');
  if (isExternalRequest) {
    return next(req); // Laisse passer sans modifier
  }

  const token = localStorage.getItem('token');

  let authReq = req;
  if (token) {
  console.log('interceptor activé - token présent');
  authReq = req.clone({
    setHeaders: { Authorization: `Bearer ${token}` },
  });
}

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      // Tente un refresh token si 401 et un refreshToken existe
      if (error.status === 401 && localStorage.getItem('refreshToken')) {
        return authService.refreshToken().pipe(
          switchMap((res) => {
            const newToken = res.token;
            const newReq = req.clone({
              setHeaders: { Authorization: `Bearer ${newToken}` },
            });
            return next(newReq);
          }),
          catchError(() => {
            //Déconnexion et redirection si le refresh échoue
            authService.logout();
            window.location.href = '/auth/login';
            return throwError(() => new Error('Session expired'));
          })
        );
      }

      return throwError(() => error);
    })
  );
};
