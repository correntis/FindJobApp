import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';
import { endpoints } from '../../config/api.config';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  constructor(private readonly httpClient: HttpClient) {}

  getById(userId: string): Observable<User> {
    const endpoint = endpoints.users.getById(userId);
    return this.httpClient.get<User>(endpoint);
  }

  update(userId: string, user: Partial<User>): Observable<User> {
    const endpoint = endpoints.users.updateById(userId);
    return this.httpClient.put<User>(endpoint, user);
  }
}
