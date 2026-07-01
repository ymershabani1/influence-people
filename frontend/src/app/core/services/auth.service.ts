import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, catchError, of, firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api.model';
import { AuthData, LoginCredentials, User } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  private readonly userSignal = signal<User | null>(null);
  readonly user = this.userSignal.asReadonly();
  readonly isAuthenticated = computed(() => this.userSignal() !== null);
  readonly isAdmin = computed(() => this.userSignal()?.role === 'admin');

  async initCsrf(): Promise<void> {
    await firstValueFrom(
      this.http.get('/sanctum/csrf-cookie', { withCredentials: true })
    );
  }

  login(credentials: LoginCredentials): Observable<ApiResponse<AuthData>> {
    return this.http
      .post<ApiResponse<AuthData>>(`${environment.apiUrl}/login`, credentials, {
        withCredentials: true,
      })
      .pipe(tap((res) => this.userSignal.set(res.data.user)));
  }

  logout(): Observable<ApiResponse<null>> {
    return this.http
      .post<ApiResponse<null>>(
        `${environment.apiUrl}/logout`,
        {},
        { withCredentials: true }
      )
      .pipe(
        tap(() => {
          this.userSignal.set(null);
          this.router.navigate(['/admin/login']);
        })
      );
  }

  checkAuth(): Observable<ApiResponse<AuthData>> {
    return this.http
      .get<ApiResponse<AuthData>>(`${environment.apiUrl}/me`, {
        withCredentials: true,
      })
      .pipe(
        tap((res) => this.userSignal.set(res.data.user)),
        catchError(() => {
          this.userSignal.set(null);
          return of({ success: false, message: '', data: { user: null! } });
        })
      );
  }
}
