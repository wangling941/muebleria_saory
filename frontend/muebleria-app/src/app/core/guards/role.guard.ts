import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthSessionService } from '../services/auth-session.service';
import { UserRole } from '../../auth/interfaces/auth.interface';

export const roleGuard = (allowedRoles: UserRole[]): CanActivateFn => {
  return () => {
    const auth = inject(AuthSessionService);
    const router = inject(Router);
    const user = auth.getCurrentUser();
    if (!user) return router.createUrlTree(['/auth/login']);
    if (allowedRoles.includes(user.role)) return true;
    return router.createUrlTree(['/app/dashboard']);
  };
};
