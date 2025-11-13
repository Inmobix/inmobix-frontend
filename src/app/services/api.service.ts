import { Injectable } from "@angular/core"
import { HttpClient, HttpHeaders } from "@angular/common/http"
import type { Observable } from "rxjs"
import { map } from "rxjs/operators"
import type {
  ApiResponse,
  UserRequest,
  UserResponse,
  LoginRequest,
  LoginResponse,
  ForgotPasswordRequest,
  VerifyWithTokenRequest,
  ResetPasswordWithTokenRequest,
  UserUpdateRequest,
} from "../models/user.model"

const API_CONFIG = {
  production: false,
  apiUrl: "http://localhost:8080/api",
}

@Injectable({
  providedIn: "root",
})
export class ApiService {
  private apiUrl = API_CONFIG.apiUrl

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      "Content-Type": "application/json",
    })
  }

  private getAuthHeaders(userId?: string, userRole?: string): HttpHeaders {
    let headers = this.getHeaders()
    if (userId) {
      headers = headers.set("X-User-Id", userId)
    }
    if (userRole) {
      headers = headers.set("X-User-Role", userRole)
    }
    return headers
  }

  // Usuarios

  // POST /api/register - Retorna ApiResponse<UserResponse>
  registerUser(userData: UserRequest): Observable<UserResponse> {
    return this.http
      .post<ApiResponse<UserResponse>>(`${this.apiUrl}/register`, userData, {
        headers: this.getHeaders(),
      })
      .pipe(map((response) => response.data))
  }

  // POST /api/login - Retorna ApiResponse<LoginResponse>
  loginUser(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http
      .post<ApiResponse<LoginResponse>>(`${this.apiUrl}/login`, credentials, {
        headers: this.getHeaders(),
      })
      .pipe(map((response) => response.data))
  }

  // POST /api/forgot-password - Retorna ApiResponse<string>
  forgotPassword(request: ForgotPasswordRequest): Observable<string> {
    return this.http
      .post<ApiResponse<string>>(`${this.apiUrl}/forgot-password`, request, {
        headers: this.getHeaders(),
      })
      .pipe(map((response) => response.message))
  }

  verifyEmail(request: VerifyWithTokenRequest): Observable<string> {
    return this.http
      .post<ApiResponse<void>>(`${this.apiUrl}/user/verify`, request, {
        headers: this.getHeaders(),
      })
      .pipe(map((response) => response.message))
  }

  resetPassword(request: ResetPasswordWithTokenRequest): Observable<string> {
    return this.http
      .post<ApiResponse<void>>(`${this.apiUrl}/user/reset-password`, request, {
        headers: this.getHeaders(),
      })
      .pipe(map((response) => response.message))
  }

  resendVerificationEmail(email: string): Observable<UserResponse> {
    return this.http
      .post<ApiResponse<UserResponse>>(
        `${this.apiUrl}/user/resend-verification`,
        { email },
        { headers: this.getHeaders() },
      )
      .pipe(map((response) => response.data))
  }

  // GET /api/user/{id} - Retorna ApiResponse<UserResponse>
  getUserById(id: string, requesterId?: string, requesterRole?: string): Observable<UserResponse> {
    return this.http
      .get<ApiResponse<UserResponse>>(`${this.apiUrl}/user/${id}`, {
        headers: this.getAuthHeaders(requesterId, requesterRole),
      })
      .pipe(map((response) => response.data))
  }

  // GET /api/users - Retorna ApiResponse<UserResponse[]> (solo ADMIN)
  getAllUsers(requesterRole?: string): Observable<UserResponse[]> {
    return this.http
      .get<ApiResponse<UserResponse[]>>(`${this.apiUrl}/users`, {
        headers: this.getAuthHeaders(undefined, requesterRole),
      })
      .pipe(map((response) => response.data))
  }

  getUserByDocumento(documento: string, requesterId: string, requesterRole: string): Observable<UserResponse> {
    return this.http
      .get<ApiResponse<UserResponse>>(`${this.apiUrl}/user/documento/${documento}`, {
        headers: this.getAuthHeaders(requesterId, requesterRole),
      })
      .pipe(map((response) => response.data))
  }

  requestEditToken(id: string): Observable<string> {
    return this.http
      .post<ApiResponse<void>>(`${this.apiUrl}/user/request-edit/${id}`, null, {
        headers: this.getHeaders(),
      })
      .pipe(map((response) => response.message))
  }

  confirmUpdate(token: string, userData: UserUpdateRequest): Observable<UserResponse> {
    return this.http
      .put<ApiResponse<UserResponse>>(`${this.apiUrl}/user/confirm-edit?token=${token}`, userData, {
        headers: this.getHeaders(),
      })
      .pipe(map((response) => response.data))
  }

  requestDeleteToken(id: string): Observable<string> {
    return this.http
      .post<ApiResponse<void>>(`${this.apiUrl}/user/request-delete/${id}`, null, { headers: this.getHeaders() })
      .pipe(map((response) => response.message))
  }

  confirmDelete(token: string): Observable<string> {
    return this.http
      .delete<ApiResponse<void>>(`${this.apiUrl}/user/confirm-delete?token=${token}`, { headers: this.getHeaders() })
      .pipe(map((response) => response.message))
  }
}
