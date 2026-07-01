import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse, PaginatedApiResponse } from '../models/api.model';
import { Category } from '../models/influencer.model';

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/categories`;

  list(activeOnly = true): Observable<ApiResponse<Category[]>> {
    const params = new HttpParams().set('active_only', String(activeOnly));
    return this.http.get<ApiResponse<Category[]>>(this.baseUrl, {
      params,
      withCredentials: true,
    });
  }

  listPaginated(
    page = 1,
    perPage = 15,
    search?: string
  ): Observable<PaginatedApiResponse<Category>> {
    let params = new HttpParams()
      .set('paginate', 'true')
      .set('page', String(page))
      .set('per_page', String(perPage));
    if (search) {
      params = params.set('search', search);
    }
    return this.http.get<PaginatedApiResponse<Category>>(this.baseUrl, {
      params,
      withCredentials: true,
    });
  }

  getById(id: number): Observable<ApiResponse<Category>> {
    return this.http.get<ApiResponse<Category>>(`${this.baseUrl}/${id}`);
  }

  create(data: Partial<Category>): Observable<ApiResponse<Category>> {
    return this.http.post<ApiResponse<Category>>(this.baseUrl, data, {
      withCredentials: true,
    });
  }

  update(id: number, data: Partial<Category>): Observable<ApiResponse<Category>> {
    return this.http.put<ApiResponse<Category>>(`${this.baseUrl}/${id}`, data, {
      withCredentials: true,
    });
  }

  delete(id: number): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(`${this.baseUrl}/${id}`, {
      withCredentials: true,
    });
  }
}
