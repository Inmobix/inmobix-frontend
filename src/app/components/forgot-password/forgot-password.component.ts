import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './forgot-password.component.html',
})
export class ForgotPasswordComponent {
  email: string = '';
  emailInvalid: boolean = false;

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
    if (this.emailInvalid) return;

    // Aquí iría la lógica para enviar el email de recuperación
  }
}