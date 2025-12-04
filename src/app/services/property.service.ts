import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import type { Observable } from 'rxjs';
import type {
  PropertyRequest,
  PropertyResponse,
} from '../models/property.model';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class PropertyService {
  private apiUrl = `${environment.apiUrl}/properties`;

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders(): HttpHeaders {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    const token = this.authService.getToken();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    const userId = this.authService.getUserId();
    if (userId) {
      headers = headers.set('X-User-Id', userId);
    }

    return headers;
  }

  createProperty(request: PropertyRequest): Observable<PropertyResponse> {
    return this.http.post<PropertyResponse>(this.apiUrl, request, {
      headers: this.getHeaders(),
    });
  }

  getAllProperties(): Observable<PropertyResponse[]> {
    return this.http.get<PropertyResponse[]>(this.apiUrl, {
      headers: this.getHeaders(),
    });
  }

  getPropertyById(id: string): Observable<PropertyResponse> {
    return this.http.get<PropertyResponse>(`${this.apiUrl}/${id}`, {
      headers: this.getHeaders(),
    });
  }

  updateProperty(
    id: string,
    request: PropertyRequest
  ): Observable<PropertyResponse> {
    return this.http.put<PropertyResponse>(`${this.apiUrl}/${id}`, request, {
      headers: this.getHeaders(),
    });
  }

  deleteProperty(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, {
      headers: this.getHeaders(),
    });
  }

  getAvailableProperties(): Observable<PropertyResponse[]> {
    return this.http.get<PropertyResponse[]>(`${this.apiUrl}/available`, {
      headers: this.getHeaders(),
    });
  }

  getPropertiesByCity(city: string): Observable<PropertyResponse[]> {
    return this.http.get<PropertyResponse[]>(`${this.apiUrl}/city/${city}`, {
      headers: this.getHeaders(),
    });
  }

  getPropertiesByType(propertyType: string): Observable<PropertyResponse[]> {
    return this.http.get<PropertyResponse[]>(
      `${this.apiUrl}/type/${propertyType}`,
      { headers: this.getHeaders() }
    );
  }

  getPropertiesByTransaction(
    transactionType: string
  ): Observable<PropertyResponse[]> {
    return this.http.get<PropertyResponse[]>(
      `${this.apiUrl}/transaction/${transactionType}`,
      { headers: this.getHeaders() }
    );
  }

  getPropertiesByPriceRange(
    minPrice: number,
    maxPrice: number
  ): Observable<PropertyResponse[]> {
    const params = new HttpParams()
      .set('minPrice', minPrice.toString())
      .set('maxPrice', maxPrice.toString());

    return this.http.get<PropertyResponse[]>(`${this.apiUrl}/price-range`, {
      headers: this.getHeaders(),
      params,
    });
  }

  getPropertiesByUser(userId: string): Observable<PropertyResponse[]> {
    return this.http.get<PropertyResponse[]>(`${this.apiUrl}/user/${userId}`, {
      headers: this.getHeaders(),
    });
  }

  uploadImage(file: File): Observable<{ imageUrl: string }> {
    const formData = new FormData();
    formData.append('file', file);

    // Note: We don't set Content-Type header manually for FormData,
    // Angular/Browser sets it automatically with boundary
    let headers = new HttpHeaders();
    const token = this.authService.getToken();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    return this.http.post<{ imageUrl: string }>(`${this.apiUrl}/upload`, formData, {
      headers: headers
    });
  }

  deleteImage(imageUrl: string): Observable<void> {
    // Extract filename or send the full URL depending on backend requirement
    // Assuming we send the full URL or a relative path
    return this.http.delete<void>(`${this.apiUrl}/image`, {
      headers: this.getHeaders(),
      params: { imageUrl }
    });
  }
}
