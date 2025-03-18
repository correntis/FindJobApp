import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { Observable } from 'rxjs';
import { AuthUser } from '../models/auth-user.model';
import { endpoints } from '../../config/api.config';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private readonly httpClient: HttpClient) {}

  register(user: Partial<User>): Observable<AuthUser> {
    const endpoint = endpoints.auth.register();
    return this.httpClient.post<AuthUser>(endpoint, user);
  }

  login(email: string, password: string): Observable<AuthUser> {
    const endpoint = endpoints.auth.login();
    return this.httpClient.post<AuthUser>(endpoint, {
      email,
      password,
    });
  }

  refreshToken(refreshToken: string) : Observable<string> {
    const endpoint = endpoints.auth.refreshToken(refreshToken);
    return this.httpClient.get<string>(endpoint);
  }
}
