import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './register.component.html',
})
export class RegisterComponent {
  name: string = '';
  username: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  telefono?: string;
  fechaNacimiento?: Date;

  nameError: boolean = false;
  usernameError: boolean = false;
  emailError: boolean = false;
  passwordError: boolean = false;
  confirmPasswordError: boolean = false;
  confirmPasswordMismatch: boolean = false;

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
    // Aquí iría la lógica para enviar los datos al servicio backend
  }
}