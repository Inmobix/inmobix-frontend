// Respuesta genérica del backend (todas las respuestas vienen envueltas en esto)
export interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
  timestamp: string
}

// Request para registro
export interface UserRequest {
  name: string
  email: string
  username: string
  password: string
  documento?: string // Agregado documento opcional
  phone?: string
  birthDate?: string // LocalDate del backend -> string en ISO format
}

// Request para login
export interface LoginRequest {
  email: string
  password: string
}

// Request para recuperar contraseña
export interface ForgotPasswordRequest {
  email: string
}

export interface VerifyWithTokenRequest {
  verificationToken: string
  code: string
}

export interface ResetPasswordWithTokenRequest {
  resetPasswordToken: string
  code: string
  newPassword: string
}

export interface UserUpdateRequest {
  name?: string
  email?: string
  username?: string
  documento?: string
  phone?: string
  birthDate?: string
}

// Response del backend - Usuario
export interface UserResponse {
  id: string // UUID del backend se convierte en string
  name: string
  email: string
  username: string
  documento?: string // Agregado documento
  phone?: string
  birthDate?: string
  role?: string // Agregado role (ADMIN, USER)
  verificationToken?: string // Solo presente en registro
  resetPasswordToken?: string // Solo presente en forgot-password
}

// Response de login - incluye token JWT y datos del usuario
export interface LoginResponse {
  token: string
  user: {
    id: string
    name: string
    email: string
    username: string
    documento?: string
    phone?: string
    birthDate?: string
    role?: string
  }
}