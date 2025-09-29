import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent {
constructor(private apiService: ApiService, private router: Router) {}
  logout() {
    localStorage.removeItem('token'); // eliminar token
    this.router.navigate(['/login']); // redirigir a login
  }

  buscarUsuarioPorId() {
  Swal.fire({
    title: 'Buscar usuario',
    input: 'number',
    inputLabel: 'Ingresa el ID del usuario',
    showCancelButton: true,
    confirmButtonText: 'Buscar',
  }).then((result) => {
    if (result.isConfirmed && result.value) {
      const id = result.value;
      this.apiService.getUserById(id).subscribe({
        next: (user) => {
          Swal.fire({
            title: `Usuario encontrado`,
            html: `
              <p><b>ID:</b> ${user.id}</p>
              <p><b>Nombre:</b> ${user.name}</p>
              <p><b>Email:</b> ${user.email}</p>
            `,
            icon: 'success',
          });
        },
        error: () => {
          Swal.fire('Error', 'No se encontró el usuario', 'error');
        },
      });
    }
  });
}
}