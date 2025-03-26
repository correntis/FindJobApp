import {
  HttpEvent,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, Observable, switchMap, throwError } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { LocalStorageService } from '../services/local-storage.service';
import { UserStateService } from '../services/user-state.service';
import { AuthService } from '../services/auth.service';
import { constants } from '../../config/constsntas';
import { AuthUser } from '../models/auth-user.model';

export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn
): Observable<HttpEvent<any>> => {
  console.log('Auth Interceptor triggered');

  const localStorageService = inject(LocalStorageService);
  const userStateService = inject(UserStateService);
  const authService = inject(AuthService);
  const router = inject(Router);
  
  if (req.url.includes('refresh') || req.url.includes('login') || req.url.includes('register')) {
    return next(req);
  }

  const authUser = userStateService.authUserValue;

  if (!authUser || !authUser.accessToken) {
    return next(req);
  }

  if (isAccessTokenExpired(authUser)) {
    return handleTokenRefresh(
      req,
      next,
      authUser,
      authService,
      localStorageService,
      userStateService,
      router
    );
  } else {
    const reqWithToken = addTokenToRequest(req, authUser.accessToken);
    return next(reqWithToken).pipe(
      catchError((error) => {
        if (error.status === 401) {
          return handleTokenRefresh(
            req,
            next,
            authUser,
            authService,
            localStorageService,
            userStateService,
            router
          );
        }
        return throwError(() => error);
      })
    );
  }
};

const handleTokenRefresh = (
  request: HttpRequest<unknown>,
  next: HttpHandlerFn,
  authUser: AuthUser,
  authService: AuthService,
  localStorageService: LocalStorageService,
  userStateService: UserStateService,
  router: Router
): Observable<HttpEvent<unknown>> => {
  if (!authUser.refreshToken) {
    console.warn('No refresh token available, redirecting to login...');
    router.navigate(['/sign-in']);
    return throwError(() => new Error('No refresh token'));
  }

  return authService.refreshToken(authUser.refreshToken).pipe(
    switchMap((result) => {
      console.log('REFRESH');
      if (result.accessToken) {
        authUser.accessToken = result.accessToken;
        const updatedUser: AuthUser = {
          ...authUser,
        };

        localStorageService.setItem(
          constants.localStorageKeys.user,
          updatedUser
        );
        userStateService.setUser(updatedUser);

        return next(addTokenToRequest(request, updatedUser.accessToken));
      }

      console.error('Token refresh failed, redirecting to login...');
      router.navigate(['/sign-in']);
      return throwError(() => new Error('Failed to refresh token'));
    }),
    catchError((err) => {
      console.error('Refresh token error:', err);
      router.navigate(['/sign-in']);
      return throwError(() => err);
    })
  );
};

const isAccessTokenExpired = (authUser: AuthUser): boolean => {
  if (authUser.accessToken) {
    try {
      const decodedToken = jwtDecode<{ exp: number }>(authUser.accessToken);
      const currentTime = Math.floor(new Date().getTime() / 1000);
      const isExpired = currentTime >= decodedToken.exp;
      return isExpired;
    } catch (error) {
      console.error('Error decoding token:', error);
      return true;
    }
  }
  return true;
};


const addTokenToRequest = (
  request: HttpRequest<unknown>,
  token: string
): HttpRequest<unknown> => {
  return request.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`,
    },
  });
};
