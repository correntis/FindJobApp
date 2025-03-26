import { Injectable } from '@angular/core';
import { UserStateService } from '../../../core/services/user-state.service';
import { UserRoles } from '../../../core/enums/user-roles.enum';

@Injectable({
  providedIn: 'root'
})
export class AuthHelperService {

  constructor(private userStateService: UserStateService) { }

  isAuthenticated(): boolean {
    return !!this.userStateService.authUserValue;
  }

  isUser(): boolean {
    if (!this.isAuthenticated()) return false;
    return this.userStateService.authUserValue!.user.role === UserRoles.User;
  }

  isCompany(): boolean {
    if (!this.isAuthenticated()) return false;
    return this.userStateService.authUserValue!.user.role === UserRoles.Company;
  }

  getUserId(): string | null {
    if (!this.isAuthenticated()) return null;
    return this.userStateService.authUserValue!.user.id;
  }

  getUserRole(): UserRoles | null {
    if (!this.isAuthenticated()) return null;
    return this.userStateService.authUserValue!.user.role as UserRoles;
  }
}
