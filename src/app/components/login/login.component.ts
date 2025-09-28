import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  emailError: string = '';
  passwordError: string = '';

  private emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  validateEmail() {
    if (!this.email) {
      this.emailError = 'El email es obligatorio.';
    } else if (!this.emailRegex.test(this.email)) {
      this.emailError = 'Formato de email inválido.';
    } else {
      this.emailError = '';
    }
  }

  validatePassword() {
    if (!this.password) {
      this.passwordError = 'La contraseña es obligatoria.';
    } else {
      this.passwordError = '';
    }
  }

  // Validación al enviar el formulario
  onSubmit() {
    this.validateEmail();
    this.validatePassword();

    if (!this.emailError && !this.passwordError) {
      // Aquí iría la llamada a la API
    }
  }
}