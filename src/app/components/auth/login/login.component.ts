import { Component, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core"
import { CommonModule } from "@angular/common"
import { RouterModule, Router } from "@angular/router"
import { FormsModule } from "@angular/forms"
import { ApiService } from "../../../services/api.service"
import type { LoginRequest } from "../../../models/user.model"
import Swal from "sweetalert2"

@Component({
  selector: "app-login",
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: "./login.component.html",
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LoginComponent {
  email = ""
  password = ""
  emailError = ""
  passwordError = ""
  isLoading = false
  errorMessage = ""

  private emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  constructor(
    private apiService: ApiService,
    private router: Router,
  ) {}

  validateEmail() {
    if (!this.email) {
      this.emailError = "El email es obligatorio."
    } else if (!this.emailRegex.test(this.email)) {
      this.emailError = "Formato de email inválido."
    } else {
      this.emailError = ""
    }
  }

  validatePassword() {
    if (!this.password) {
      this.passwordError = "La contraseña es obligatoria."
    } else {
      this.passwordError = ""
    }
  }

  onSubmit() {
    this.validateEmail()
    this.validatePassword()

    if (!this.emailError && !this.passwordError) {
      this.isLoading = true

      const credentials: LoginRequest = {
        email: this.email,
        password: this.password,
      }

      this.apiService.loginUser(credentials).subscribe({
        next: (response) => {
          console.log("Login exitoso:", response)
          if (response.token) {
            localStorage.setItem("authToken", response.token)
            localStorage.setItem("userId", response.user.id)
            localStorage.setItem("userName", response.user.name)
            localStorage.setItem("userEmail", response.user.email)
          }
          this.isLoading = false

          Swal.fire({
            icon: "success",
            title: "¡Inicio de sesión exitoso!",
            text: "Redirigiendo al dashboard...",
            timer: 1500,
            timerProgressBar: true,
            showConfirmButton: false,
          }).then(() => {
            this.router.navigate(["/dashboard"])
          })
        },
        error: (error) => {
          console.error("Error en login:", error)
          this.isLoading = false

          Swal.fire({
            icon: "error",
            title: "Error al iniciar sesión",
            text: error.error?.message || "Verifica tus credenciales.",
          })
        },
      })
    }
  }
}
