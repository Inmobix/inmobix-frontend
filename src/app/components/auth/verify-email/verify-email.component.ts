import { Component, type OnInit, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core"
import { CommonModule } from "@angular/common"
import { RouterModule, Router, ActivatedRoute } from "@angular/router"
import { FormsModule } from "@angular/forms"
import { ApiService } from "../../../services/api.service"
import { VerifyWithTokenRequest } from "../../../models/user.model"
import Swal from "sweetalert2"

@Component({
  selector: "app-verify-email",
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: "./verify-email.component.html",
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class VerifyEmailComponent implements OnInit {
  verificationToken = ""
  code = ""
  codeError = ""
  isLoading = false
  message = ""

  constructor(
    private apiService: ApiService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {
    // Obtener token de la URL si viene como query param
    this.route.queryParams.subscribe((params) => {
      if (params["token"]) {
        this.verificationToken = params["token"]
      }
    })
  }

  validateCode() {
    if (!this.code || this.code.length !== 6) {
      this.codeError = "El código debe tener 6 dígitos"
    } else {
      this.codeError = ""
    }
  }

  onSubmit() {
    this.validateCode()

    if (!this.codeError && this.verificationToken && this.code) {
      this.isLoading = true

      const verifyData: VerifyWithTokenRequest = {
        verificationToken: this.verificationToken,
        code: this.code,
      }

      this.apiService.verifyEmail(verifyData).subscribe({
        next: (response) => {
          this.isLoading = false
          const message = response.message || "Email verificado exitosamente"

          Swal.fire({
            icon: "success",
            title: "¡Verificación exitosa!",
            text: message,
            timer: 2000,
            timerProgressBar: true,
            showConfirmButton: false,
          }).then(() => {
            this.router.navigate(["/login"])
          })
        },
        error: (error: any) => {
          this.isLoading = false
          const errorMsg = error.error?.message || "Error al verificar el email. Intenta nuevamente."

          Swal.fire({
            icon: "error",
            title: "Error de verificación",
            text: errorMsg,
          })
        },
      })
    } else if (!this.verificationToken) {
      Swal.fire({
        icon: "warning",
        title: "Token faltante",
        text: "No se encontró el token de verificación. Por favor, revisa tu email.",
      })
    }
  }

  resendCode() {
    if (!this.verificationToken) {
      Swal.fire({
        icon: "warning",
        title: "Token faltante",
        text: "No se puede reenviar el código sin un token válido.",
      })
      return
    }

    this.isLoading = true
    // Aquí implementarías la llamada al endpoint de reenvío
    // this.apiService.resendVerificationCode(this.verificationToken).subscribe(...)
    this.isLoading = false
  }
}
