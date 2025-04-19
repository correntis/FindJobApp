import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { Observable, of } from 'rxjs';
import { AuthUser } from '../models/auth-user.model';
import { endpoints } from '../../config/api.config';
import { RegisterUserDto } from '../dto/auth/register-user.dto';
import { LoginUserDto } from '../dto/auth/login-user.dto';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private readonly httpClient: HttpClient) {}

  register(registerUserDto: RegisterUserDto): Observable<AuthUser> {
    const endpoint = endpoints.auth.register();
    return this.httpClient.post<AuthUser>(endpoint, registerUserDto);
  }

  login(loginUserDto: LoginUserDto): Observable<AuthUser> {
    const endpoint = endpoints.auth.login();
    return this.httpClient.post<AuthUser>(endpoint, loginUserDto);
  }

  refreshToken(refreshToken: string): Observable<{ accessToken: string}> {
    const endpoint = endpoints.auth.refreshToken(refreshToken);
    return this.httpClient.get<{accessToken: string}>(endpoint);
  }

  logout(): Observable<void> {
    return of(void 0);
  }
}
