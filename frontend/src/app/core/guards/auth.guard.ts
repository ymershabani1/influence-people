import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { map, catchError, of } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (
  _route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  const redirectToLogin = () =>
    router.createUrlTree(['/admin/login'], { queryParams: { returnUrl: state.url } });

  if (auth.isAuthenticated()) {
    return true;
  }

  return auth.checkAuth().pipe(
    map((res) => {
      if (res.success && res.data?.user) {
        return true;
      }
      return redirectToLogin();
    }),
    catchError(() => of(redirectToLogin()))
  );
};

export const guestGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.isAuthenticated()) {
    const returnUrl = route.queryParamMap.get('returnUrl') ?? '/';
    return router.parseUrl(returnUrl);
  }

  return true;
};
