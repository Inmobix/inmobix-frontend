import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  UserRequest,
  UserResponse,
  LoginRequest,
  ForgotPasswordRequest,
} from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
    });
  }

  // Usuarios

  // POST /api/register
  registerUser(userData: UserRequest): Observable<UserResponse> {
    return this.http.post<UserResponse>(`${this.apiUrl}/register`, userData, {
      headers: this.getHeaders(),
    });
  }

  // POST /api/login
  loginUser(credentials: LoginRequest): Observable<string> {
    return this.http.post(`${this.apiUrl}/login`, credentials, {
      headers: this.getHeaders(),
      responseType: 'text', // El backend retorna un String
    });
  }

  // POST /api/forgot-password
  forgotPassword(request: ForgotPasswordRequest): Observable<string> {
    return this.http.post(`${this.apiUrl}/forgot-password`, request, {
      headers: this.getHeaders(),
      responseType: 'text', // El backend retorna un String
    });
  }

  // GET /api/user/{id}
  getUserById(id: number): Observable<UserResponse> {
    return this.http.get<UserResponse>(`${this.apiUrl}/user/${id}`, {
      headers: this.getHeaders(),
    });
  }

  // GET /api/users
  getAllUsers(): Observable<UserResponse[]> {
    return this.http.get<UserResponse[]>(`${this.apiUrl}/users`, {
      headers: this.getHeaders(),
    });
  }
}