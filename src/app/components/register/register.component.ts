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

  onSubmit() {
    console.log('Datos del registro:', {
      name: this.name,
      username: this.username,
      email: this.email,
      password: this.password,
      confirmPassword: this.confirmPassword,
      telefono: this.telefono,
      fechaNacimiento: this.fechaNacimiento,
    });
  }
}