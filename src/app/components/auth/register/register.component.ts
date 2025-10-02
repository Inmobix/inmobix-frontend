import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../services/api.service';
import { UserRequest } from '../../../models/user.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './register.component.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class RegisterComponent {
  name: string = '';
  username: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  telefono?: string;
  fechaNacimiento?: string;

  nameError: boolean = false;
  usernameError: boolean = false;
  emailError: boolean = false;
  passwordError: boolean = false;
  confirmPasswordError: boolean = false;
  confirmPasswordMismatch: boolean = false;
  isLoading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(private apiService: ApiService, private router: Router) {}

  validateName() {
    this.nameError = !this.name.trim();
  }

  validateUsername() {
    this.usernameError = !this.username.trim();
  }

  validateEmail() {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    this.emailError = !this.email.trim() || !emailPattern.test(this.email);
  }

  validatePassword() {
    this.passwordError = !this.password;
    this.validateConfirmPassword();
  }

  validateConfirmPassword() {
    this.confirmPasswordError = !this.confirmPassword;
    this.confirmPasswordMismatch =
      !!this.password &&
      !!this.confirmPassword &&
      this.password !== this.confirmPassword;
  }

  onSubmit() {
    this.validateName();
    this.validateUsername();
    this.validateEmail();
    this.validatePassword();
    this.validateConfirmPassword();
    this.errorMessage = '';
    this.successMessage = '';

    if (
      this.nameError ||
      this.usernameError ||
      this.emailError ||
      this.passwordError ||
      this.confirmPasswordError ||
      this.confirmPasswordMismatch
    ) {
      return;
    }

    this.isLoading = true;

    const userData: UserRequest = {
      name: this.name,
      username: this.username,
      email: this.email,
      password: this.password,
      phone: this.telefono,
      birthDate: this.fechaNacimiento,
    };

    this.apiService.registerUser(userData).subscribe({
      next: (response) => {
        console.log('Usuario registrado:', response);
        this.isLoading = false;
        Swal.fire({
          icon: 'success',
          title: '¡Registro exitoso!',
          text: 'Regresaras al login...',
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton: false,
        }).then(() => {
          this.router.navigate(['/login']);
        });
      },
      error: (error) => {
        console.error('Error en registro:', error);
        this.isLoading = false;
        Swal.fire({
          icon: 'error',
          title: '¡Error al registrar!',
          text: error.error?.message || 'Intenta nuevamente.',
        });
      },
    });
  }
}
