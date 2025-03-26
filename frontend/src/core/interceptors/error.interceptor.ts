import {
    HttpEvent,
    HttpHandlerFn,
    HttpInterceptorFn,
    HttpRequest,
  } from '@angular/common/http';
  import { inject } from '@angular/core';
  import { Router } from '@angular/router';
  import { Observable, catchError, throwError } from 'rxjs';
  
  export const errorInterceptor: HttpInterceptorFn = (
    req: HttpRequest<any>,
    next: HttpHandlerFn
  ): Observable<HttpEvent<any>> => {
    const router = inject(Router);
  
    return next(req).pipe(
      catchError((error) => {
        console.error('HTTP Error:', error);
  
        if (error.status === 401) {
          router.navigate(['/sign-in']);
        }
  
        return throwError(() => error);
      })
    );
  };
  