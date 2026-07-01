import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  ApiResponse,
  PaginatedApiResponse,
} from '../models/api.model';
import {
  DashboardData,
  Influencer,
  InfluencerFilters,
  PriceRange,
} from '../models/influencer.model';

@Injectable({ providedIn: 'root' })
export class InfluencerService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/influencers`;

  list(filters: InfluencerFilters = {}): Observable<PaginatedApiResponse<Influencer>> {
    return this.http.get<PaginatedApiResponse<Influencer>>(this.baseUrl, {
      params: this.buildParams(filters),
      withCredentials: true,
    });
  }

  getById(id: number): Observable<ApiResponse<Influencer>> {
    return this.http.get<ApiResponse<Influencer>>(`${this.baseUrl}/${id}`);
  }

  create(formData: FormData): Observable<ApiResponse<Influencer>> {
    return this.http.post<ApiResponse<Influencer>>(this.baseUrl, formData, {
      withCredentials: true,
    });
  }

  update(id: number, formData: FormData): Observable<ApiResponse<Influencer>> {
    formData.append('_method', 'PUT');
    return this.http.post<ApiResponse<Influencer>>(`${this.baseUrl}/${id}`, formData, {
      withCredentials: true,
    });
  }

  delete(id: number): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(`${this.baseUrl}/${id}`, {
      withCredentials: true,
    });
  }

  bulkDelete(ids: number[]): Observable<ApiResponse<{ deleted_count: number }>> {
    return this.http.post<ApiResponse<{ deleted_count: number }>>(
      `${this.baseUrl}/bulk-delete`,
      { ids },
      { withCredentials: true }
    );
  }

  getPriceRange(): Observable<ApiResponse<PriceRange>> {
    return this.http.get<ApiResponse<PriceRange>>(`${this.baseUrl}/price-range`);
  }

  private buildParams(filters: InfluencerFilters): HttpParams {
    let params = new HttpParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params = params.set(key, String(value));
      }
    });
    return params;
  }
}

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private readonly http = inject(HttpClient);

  getData(): Observable<ApiResponse<DashboardData>> {
    return this.http.get<ApiResponse<DashboardData>>(
      `${environment.apiUrl}/dashboard`,
      { withCredentials: true }
    );
  }
}
