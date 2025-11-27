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

  getPropertyById(id: number): Observable<PropertyResponse> {
    return this.http.get<PropertyResponse>(`${this.apiUrl}/${id}`, {
      headers: this.getHeaders(),
    });
  }

  updateProperty(
    id: number,
    request: PropertyRequest
  ): Observable<PropertyResponse> {
    return this.http.put<PropertyResponse>(`${this.apiUrl}/${id}`, request, {
      headers: this.getHeaders(),
    });
  }

  deleteProperty(id: number): Observable<void> {
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

  getPropertiesByUser(userId: number): Observable<PropertyResponse[]> {
    return this.http.get<PropertyResponse[]>(`${this.apiUrl}/user/${userId}`, {
      headers: this.getHeaders(),
    });
  }
}
