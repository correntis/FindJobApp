import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthHelperService } from '../../app/src/shared/auth-helper.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authHelper = inject(AuthHelperService);
  const router = inject(Router);

  if (authHelper.isAuthenticated()) {
    return true;
  }

  router.navigate(['/sign-in']);
  return false;
};
