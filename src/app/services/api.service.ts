import { Injectable } from "@angular/core"
import { HttpClient, HttpHeaders } from "@angular/common/http"
import type { Observable } from "rxjs"
import { map, catchError, tap } from "rxjs/operators"
import { throwError } from "rxjs"
import { environment } from "../../environments/environment"
import type {
  UserRequest,
  UserResponse,
  LoginRequest,
  ForgotPasswordRequest,
  ApiResponse,
  VerifyWithTokenRequest,
  ResetPasswordWithTokenRequest,
  UserUpdateRequest,
  ForgotPasswordResponse,
} from "../models/user.model"
import { AuthService } from "./auth.service"

@Injectable({
  providedIn: "root",
})
export class ApiService {
  private apiUrl = environment.apiUrl

  constructor(
    private http: HttpClient,
    private authService: AuthService,
  ) {}

  /**
   * Obtener headers para peticiones con autenticación
   */
  private getAuthHeaders(): HttpHeaders {
    const headers: any = {
      "Content-Type": "application/json",
    }

    const userId = this.authService.getUserId()
    if (userId) {
      headers["X-User-Id"] = userId
    }

    const userRole = this.authService.getUserRole()
    if (userRole) {
      headers["X-User-Role"] = userRole
    }

    const token = this.authService.getToken()
    if (token) {
      headers["Authorization"] = `Bearer ${token}`
    }

    return new HttpHeaders(headers)
  }

  /**
   * Obtener headers básicos (sin autenticación)
   */
  private getBasicHeaders(): HttpHeaders {
    return new HttpHeaders({
      "Content-Type": "application/json",
    })
  }

  // ==================== ENDPOINTS DE USUARIO ====================

  /**
   * POST /api/register - Registrar nuevo usuario
   */
  registerUser(userData: UserRequest): Observable<UserResponse> {
    const url = `${this.apiUrl}/register`

    return this.http
      .post<ApiResponse<UserResponse>>(url, userData, {
        headers: this.getBasicHeaders(),
      })
      .pipe(
        map((response) => {
          const verificationToken = response.data.verificationToken
          
          if (verificationToken) {
            localStorage.setItem("verificationToken", verificationToken)
            localStorage.setItem("emailToVerify", userData.email)
          }
          
          return {
            ...response.data,
            message: response.message,
          }
        }),
        catchError((error) => {
          return throwError(() => error)
        }),
      )
  }

  /**
   * POST /api/login - Iniciar sesión
   */
  loginUser(credentials: LoginRequest): Observable<UserResponse> {
    const url = `${this.apiUrl}/login`

    return this.http
      .post<ApiResponse<UserResponse>>(url, credentials, {
        headers: this.getBasicHeaders(),
      })
      .pipe(
        tap((response) => {
          // AuthService ya guardará los datos
        }),
        map((response) => {
          return {
            ...response.data,
            message: response.message,
          }
        }),
        catchError((error) => {
          return throwError(() => error)
        }),
      )
  }

  /**
   * POST /api/forgot-password - Solicitar recuperación de contraseña
   */
  forgotPassword(request: ForgotPasswordRequest): Observable<ForgotPasswordResponse> {
    const url = `${this.apiUrl}/forgot-password`

    return this.http
      .post<ApiResponse<ForgotPasswordResponse>>(url, request, {
        headers: this.getBasicHeaders(),
      })
      .pipe(
        map((response) => {
          
          if (response.data && response.data.resetPasswordToken) {
            localStorage.setItem("resetPasswordToken", response.data.resetPasswordToken)
          }
          
          return { 
            ...response.data, 
            message: response.message 
          }
        }),
        catchError((error) => {
          return throwError(() => error)
        }),
      )
  }

  /**
   * POST /api/user/verify - Verificar email con token y código
   */
  verifyEmail(request: VerifyWithTokenRequest): Observable<any> {
    const url = `${this.apiUrl}/user/verify`

    return this.http
      .post<ApiResponse<any>>(url, request, {
        headers: this.getBasicHeaders(),
      })
      .pipe(
        tap(() => {
          // Limpiar tokens de verificación
          localStorage.removeItem("verificationToken")
          localStorage.removeItem("emailToVerify")
        }),
        map((response) => {
          return { 
            message: response.message, 
            data: response.data 
          }
        }),
        catchError((error) => {
          return throwError(() => error)
        }),
      )
  }

  /**
   * POST /api/user/reset-password - Resetear contraseña con token y código
   */
  resetPassword(request: ResetPasswordWithTokenRequest): Observable<any> {
    const url = `${this.apiUrl}/user/reset-password`

    return this.http
      .post<ApiResponse<any>>(url, request, {
        headers: this.getBasicHeaders(),
      })
      .pipe(
        tap(() => {
          // Limpiar token de reset
          localStorage.removeItem("resetPasswordToken")
        }),
        map((response) => {
          return { 
            message: response.message, 
            data: response.data 
          }
        }),
        catchError((error) => {
          return throwError(() => error)
        }),
      )
  }

  /**
   * POST /api/user/resend-verification - Reenviar código de verificación
   */
  resendVerificationEmail(request: ForgotPasswordRequest): Observable<UserResponse> {
    const url = `${this.apiUrl}/user/resend-verification`

    return this.http
      .post<ApiResponse<UserResponse>>(url, request, {
        headers: this.getBasicHeaders(),
      })
      .pipe(
        map((response) => {
          if (response.data.verificationToken) {
            localStorage.setItem("verificationToken", response.data.verificationToken)
            localStorage.setItem("emailToVerify", request.email)
          }
          
          return { 
            ...response.data, 
            message: response.message 
          }
        }),
        catchError((error) => {
          return throwError(() => error)
        }),
      )
  }

  /**
   * GET /api/user/documento/{documento} - Buscar usuario por documento
   * Requiere autenticación
   */
  getByDocumento(documento: string): Observable<UserResponse> {
    const url = `${this.apiUrl}/user/documento/${documento}`

    return this.http
      .get<ApiResponse<UserResponse>>(url, {
        headers: this.getAuthHeaders(),
      })
      .pipe(
        map((response) => response.data),
        catchError((error) => {
          return throwError(() => error)
        }),
      )
  }

  /**
   * GET /api/users - Listar todos los usuarios
   * Solo ADMIN
   */
  getAllUsers(): Observable<UserResponse[]> {
    const url = `${this.apiUrl}/users`

    return this.http
      .get<ApiResponse<UserResponse[]>>(url, {
        headers: this.getAuthHeaders(),
      })
      .pipe(
        map((response) => response.data),
        catchError((error) => {
          return throwError(() => error)
        }),
      )
  }

  /**
   * POST /api/user/request-edit/{id} - Solicitar token para editar cuenta
   */
  requestEditToken(id: string): Observable<void> {
    const url = `${this.apiUrl}/user/request-edit/${id}`

    return this.http
      .post<ApiResponse<void>>(url, null, {
        headers: this.getAuthHeaders(),
      })
      .pipe(
        map((response) => {
          return response.data
        }),
        catchError((error) => {
          return throwError(() => error)
        }),
      )
  }

  /**
   * PUT /api/user/confirm-edit?token={token} - Confirmar edición con token
   */
  confirmUpdate(token: string, request: UserUpdateRequest): Observable<UserResponse> {
    const url = `${this.apiUrl}/user/confirm-edit?token=${token}`

    return this.http
      .put<ApiResponse<UserResponse>>(url, request, {
        headers: this.getAuthHeaders(),
      })
      .pipe(
        tap((response) => {
          // Actualizar datos del usuario en AuthService
          this.authService.updateUserData(response.data)
        }),
        map((response) => response.data),
        catchError((error) => {
          return throwError(() => error)
        }),
      )
  }

  /**
   * POST /api/user/request-delete/{id} - Solicitar token para eliminar cuenta
   */
  requestDeleteToken(id: string): Observable<void> {
    const url = `${this.apiUrl}/user/request-delete/${id}`

    return this.http
      .post<ApiResponse<void>>(url, null, {
        headers: this.getAuthHeaders(),
      })
      .pipe(
        map((response) => {
          return response.data
        }),
        catchError((error) => {
          return throwError(() => error)
        }),
      )
  }

  /**
   * DELETE /api/user/confirm-delete?token={token} - Confirmar eliminación con token
   */
  confirmDelete(token: string): Observable<void> {
    const url = `${this.apiUrl}/user/confirm-delete?token=${token}`

    return this.http
      .delete<ApiResponse<void>>(url, {
        headers: this.getAuthHeaders(),
      })
      .pipe(
        tap(() => {
          // Cerrar sesión después de eliminar
          this.authService.logout()
        }),
        map((response) => response.data),
        catchError((error) => {
          return throwError(() => error)
        }),
      )
  }

  // ==================== ENDPOINTS DE REPORTES ====================

  /**
   * GET /api/users/report/pdf - Descargar reporte PDF de todos los usuarios
   * Solo ADMIN
   */
  downloadAllUsersPdfReport(): Observable<Blob> {
    const url = `${this.apiUrl}/users/report/pdf`;

    return this.http.get(url, {
      headers: this.getAuthHeaders(),
      responseType: 'blob'
    }).pipe(
      catchError((error) => {
        console.error('Error al descargar reporte PDF:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * GET /api/users/report/excel - Descargar reporte Excel de todos los usuarios
   * Solo ADMIN
   */
  downloadAllUsersExcelReport(): Observable<Blob> {
    const url = `${this.apiUrl}/users/report/excel`;

    return this.http.get(url, {
      headers: this.getAuthHeaders(),
      responseType: 'blob'
    }).pipe(
      catchError((error) => {
        console.error('Error al descargar reporte Excel:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * GET /api/user/{userId}/report/pdf - Descargar reporte PDF de un usuario específico
   * Owner o ADMIN
   */
  downloadUserPdfReport(userId: string): Observable<Blob> {
    const url = `${this.apiUrl}/user/${userId}/report/pdf`;

    return this.http.get(url, {
      headers: this.getAuthHeaders(),
      responseType: 'blob'
    }).pipe(
      catchError((error) => {
        console.error('Error al descargar reporte PDF del usuario:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * GET /api/user/{userId}/report/excel - Descargar reporte Excel de un usuario específico
   * Owner o ADMIN
   */
  downloadUserExcelReport(userId: string): Observable<Blob> {
    const url = `${this.apiUrl}/user/${userId}/report/excel`;

    return this.http.get(url, {
      headers: this.getAuthHeaders(),
      responseType: 'blob'
    }).pipe(
      catchError((error) => {
        console.error('Error al descargar reporte Excel del usuario:', error);
        return throwError(() => error);
      })
    );
  }
}