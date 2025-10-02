// Request para registro
export interface UserRequest {
  name: string;
  email: string;
  username: string;
  password: string;
  phone?: string;
  birthDate?: string;
}

// Request para login
export interface LoginRequest {
  email: string;
  password: string;
}

// Request para recuperar contraseña
export interface ForgotPasswordRequest {
  email: string;
}

// Response del backend
export interface UserResponse {
  id: number;
  name: string;
  email: string;
  username: string;
  phone?: string;
  birthDate?: string;
}

// Response de login
export interface LoginResponse {
  message: string;
  token?: string;
}