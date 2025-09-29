import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../services/api.service';
import { ForgotPasswordRequest } from '../../../models/user.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './forgot-password.component.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ForgotPasswordComponent {
  email: string = '';
  emailInvalid: boolean = false;
  isLoading: boolean = false;
  successMessage: string = '';
  errorMessage: string = '';

  constructor(private apiService: ApiService) {}

  validateEmail() {
    if (!this.email.trim()) {
      this.emailInvalid = true;
      return;
    }

    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    this.emailInvalid = !pattern.test(this.email);
  }

  onSubmit() {
    this.validateEmail();
    this.successMessage = '';
    this.errorMessage = '';

    if (this.emailInvalid) return;

    this.isLoading = true;

    const request: ForgotPasswordRequest = {
      email: this.email,
    };

    this.apiService.forgotPassword(request).subscribe({
      next: (response) => {
        console.log('Respuesta:', response);
        this.isLoading = false;
        this.email = '';

        Swal.fire({
          icon: 'success',
          title: '¡Correo enviado!',
          text:
            response ||
            'Revisa tu bandeja de entrada para recuperar tu contraseña.',
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton: false,
        });
      },
      error: (error) => {
        console.error('Error:', error);
        this.isLoading = false;

        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.error || 'No se pudo enviar el correo de recuperación.',
        });
      },
    });
  }
}