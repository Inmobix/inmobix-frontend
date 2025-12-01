import { Injectable } from "@angular/core"
import { BehaviorSubject, Observable } from "rxjs"
import type { UserResponse } from "../models/user.model"

@Injectable({
  providedIn: "root",
})
export class AuthService {
  // Keys para localStorage
  private readonly TOKEN_KEY = "inmobix_token"
  private readonly USER_KEY = "inmobix_user"
  private readonly USER_ID_KEY = "inmobix_user_id"
  private readonly USER_ROLE_KEY = "inmobix_user_role"

  // Observable del usuario actual
  private currentUserSubject = new BehaviorSubject<UserResponse | null>(
    this.getUserFromStorage()
  )
  public currentUser$ = this.currentUserSubject.asObservable()

  constructor() {
    // Verificar si hay datos en localStorage al iniciar
    this.checkStoredAuth()
  }

  /**
   * Verificar autenticación almacenada
   */
  private checkStoredAuth(): void {
    const user = this.getUserFromStorage()
    if (user) {
      this.currentUserSubject.next(user)
    }
  }

  /**
   * Guardar datos de autenticación completos
   */
  setAuthData(user: UserResponse): void {
    
    // Guardar usuario completo
    localStorage.setItem(this.USER_KEY, JSON.stringify(user))
    
    // Guardar ID
    localStorage.setItem(this.USER_ID_KEY, user.id)
    
    // Guardar rol
    if (user.role) {
      localStorage.setItem(this.USER_ROLE_KEY, user.role)
    }
    
    // Actualizar observable
    this.currentUserSubject.next(user)
  }

  /**
   * Guardar token JWT (si lo usas en el futuro)
   */
  setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token)
  }

  /**
   * Obtener token JWT
   */
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY)
  }

  /**
   * Obtener usuario actual desde el observable
   */
  getCurrentUser(): UserResponse | null {
    return this.currentUserSubject.value
  }

  /**
   * Obtener user ID
   */
  getUserId(): string | null {
    return localStorage.getItem(this.USER_ID_KEY)
  }

  /**
   * Obtener role del usuario
   */
  getUserRole(): string | null {
    return localStorage.getItem(this.USER_ROLE_KEY)
  }

  /**
   * Verificar si el usuario es ADMIN
   */
  isAdmin(): boolean {
    return this.getUserRole() === "ADMIN"
  }

  /**
   * Verificar si el usuario está autenticado
   */
  isAuthenticated(): boolean {
    const user = this.getCurrentUser()
    const userId = this.getUserId()
    return !!(user && userId)
  }

  /**
   * Actualizar datos del usuario en localStorage
   */
  updateUserData(user: UserResponse): void {
    this.setAuthData(user)
  }

  /**
   * Cerrar sesión - limpiar todo
   */
  logout(): void {
    
    // Limpiar localStorage
    localStorage.removeItem(this.TOKEN_KEY)
    localStorage.removeItem(this.USER_KEY)
    localStorage.removeItem(this.USER_ID_KEY)
    localStorage.removeItem(this.USER_ROLE_KEY)
    
    // Limpiar también tokens temporales si existen
    localStorage.removeItem("verificationToken")
    localStorage.removeItem("resetPasswordToken")
    localStorage.removeItem("emailToVerify")
    
    // Actualizar observable
    this.currentUserSubject.next(null)
  }

  /**
   * Obtener usuario desde localStorage
   */
  private getUserFromStorage(): UserResponse | null {
    const userJson = localStorage.getItem(this.USER_KEY)
    if (userJson) {
      try {
        return JSON.parse(userJson) as UserResponse
      } catch (error) {
        return null
      }
    }
    return null
  }

  /**
   * Verificar si los datos en localStorage son válidos
   */
  validateStoredData(): boolean {
    const user = this.getUserFromStorage()
    const userId = this.getUserId()
    const userRole = this.getUserRole()

    if (!user || !userId) {
      this.logout() // Limpiar si hay inconsistencias
      return false
    }

    // Verificar que el ID coincida
    if (user.id !== userId) {
      this.logout()
      return false
    }

    return true
  }
}