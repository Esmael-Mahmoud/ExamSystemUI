import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const roleGuardGuard: CanActivateFn = (route, state) => {
  const router= inject(Router)
  const userRole= localStorage.getItem('userRole');
  if(userRole=='Teacher'){
  return true;
  }
 router.navigate(['/home']);
    return false;
};
