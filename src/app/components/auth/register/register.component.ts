import { Component, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core"
import { CommonModule } from "@angular/common"
import { RouterModule, Router } from "@angular/router"
import { FormsModule } from "@angular/forms"
import { ApiService } from "../../../services/api.service"
import type { UserRequest } from "../../../models/user.model"
import Swal from "sweetalert2"

@Component({
  selector: "app-register",
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: "./register.component.html",
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class RegisterComponent {
  name = ""
  username = ""
  email = ""
  password = ""
  confirmPassword = ""
  telefono = ""
  fechaNacimiento = ""
  documento = ""

  nameError = false
  usernameError = false
  emailError = false
  passwordError = false
  confirmPasswordError = false
  confirmPasswordMismatch = false
  isLoading = false

  private emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  constructor(
    private apiService: ApiService,
    private router: Router,
  ) {}

  validateName() {
    this.nameError = !this.name.trim()
  }

  validateUsername() {
    this.usernameError = !this.username.trim()
  }

  validateEmail() {
    this.emailError = !this.email.trim() || !this.emailRegex.test(this.email)
  }

  validatePassword() {
    this.passwordError = !this.password || this.password.length < 6
    if (!this.passwordError && this.confirmPassword) {
      this.validateConfirmPassword()
    }
  }

  validateConfirmPassword() {
    this.confirmPasswordError = !this.confirmPassword
    this.confirmPasswordMismatch =
      this.password !== "" &&
      this.confirmPassword !== "" &&
      this.password !== this.confirmPassword
  }

  isFormValid(): boolean {
    // Retorna true solo si todos los campos obligatorios están llenos y válidos
    return (
      this.name.trim() !== "" &&
      this.username.trim() !== "" &&
      this.email.trim() !== "" &&
      this.emailRegex.test(this.email) &&
      this.password !== "" &&
      this.password.length >= 6 &&
      this.confirmPassword !== "" &&
      this.password === this.confirmPassword &&
      !this.nameError &&
      !this.usernameError &&
      !this.emailError &&
      !this.passwordError &&
      !this.confirmPasswordError &&
      !this.confirmPasswordMismatch
    )
  }

  onSubmit() {
    // Validar todos los campos antes de enviar
    this.validateName()
    this.validateUsername()
    this.validateEmail()
    this.validatePassword()
    this.validateConfirmPassword()

    // Si hay algún error, mostrar alerta y no enviar
    if (!this.isFormValid()) {
      Swal.fire({
        icon: "warning",
        title: "Campos incompletos",
        text: "Por favor completa todos los campos obligatorios correctamente",
      })
      return
    }

    this.isLoading = true

    const userData: UserRequest = {
      name: this.name.trim(),
      username: this.username.trim(),
      email: this.email.trim(),
      password: this.password,
      phone: this.telefono.trim() || undefined,
      birthDate: this.fechaNacimiento || undefined,
      documento: this.documento.trim() || undefined,
    }

    this.apiService.registerUser(userData).subscribe({
      next: (response) => {
        console.log("Usuario registrado:", response)
        this.isLoading = false
        Swal.fire({
          icon: "success",
          title: "¡Registro exitoso!",
          text: "Regresarás al login...",
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton: false,
        }).then(() => {
          this.router.navigate(["/login"])
        })
      },
      error: (error) => {
        console.error("Error en registro:", error)
        this.isLoading = false
        Swal.fire({
          icon: "error",
          title: "¡Error al registrar!",
          text: error.error?.message || "Intenta nuevamente.",
        })
      },
    })
  }
}