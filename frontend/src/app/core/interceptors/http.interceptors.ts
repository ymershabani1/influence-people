import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { ToastService } from '../services/toast.service';
import { ApiErrorResponse } from '../models/api.model';

export const credentialsInterceptor: HttpInterceptorFn = (req, next) => {
  const apiReq = req.clone({ withCredentials: true });
  return next(apiReq);
};

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toast = inject(ToastService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 422) {
        const body = error.error as ApiErrorResponse;
        const firstError = body.errors
          ? Object.values(body.errors)[0]?.[0]
          : body.message;
        toast.error(firstError || 'Validation failed.');
      } else if (error.status === 401) {
        // Silent for auth checks
      } else if (error.status === 403) {
        toast.error('You do not have permission to perform this action.');
      } else if (error.status >= 500) {
        toast.error('Server error. Please try again later.');
      } else if (error.status !== 0) {
        const body = error.error as ApiErrorResponse;
        toast.error(body?.message || 'An error occurred.');
      }

      return throwError(() => error);
    })
  );
};
