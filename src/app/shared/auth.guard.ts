// auth.guard.ts
import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const isAuthenticated = authService.checkIfAuthenticated();

  if (!isAuthenticated) {
    router.navigate(['/login']); // Redirecionar para a página de login
    return false;
  }

  return true;
};
