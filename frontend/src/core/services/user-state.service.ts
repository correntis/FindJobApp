import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthUser } from '../models/auth-user.model';
import { HttpClient } from '@angular/common/http';
import { constants } from '../../config/constsntas';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root',
})
export class UserStateService {
  private userKey = constants.localStorageKeys.user;

  private authUserSubject: BehaviorSubject<AuthUser | null>;
  authUser$: Observable<AuthUser | null>;

  constructor(
    private httpClient: HttpClient,
    private localStorageService: LocalStorageService
  ) {
    const storedUser = localStorageService.getItem<AuthUser>(this.userKey);
    this.authUserSubject = new BehaviorSubject<AuthUser | null>(storedUser);
    this.authUser$ = this.authUserSubject.asObservable();
  }

  setUser(authUser: AuthUser | null) {
    if (authUser) {
      this.localStorageService.setItem(this.userKey, authUser);
    } else {
      this.localStorageService.removeItem(this.userKey);
    }
    this.authUserSubject.next(authUser);
  }

  get authUserValue(): AuthUser | null {
    return this.authUserSubject.value;
  }
}
