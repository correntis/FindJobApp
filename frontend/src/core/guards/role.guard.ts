import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthHelperService } from '../../app/src/shared/auth-helper.service';

export const roleGuard: CanActivateFn = (route, state) => {
  const authHelper = inject(AuthHelperService);
  const router = inject(Router);

  const roles = route.data?.['roles'] as string[];

  if (!roles?.length) {
    return true;
  }

  const userRole = authHelper.getUserRole();

  if (userRole && roles.includes(userRole)) {
    return true;
  }

  router.navigate(['/vacancies']);
  return false;
};
