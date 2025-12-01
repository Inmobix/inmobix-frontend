import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { ApiService } from '../../../services/api.service';
import { UserResponse } from '../../../models/user.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './admin.component.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AdminComponent implements OnInit {
  // Para búsqueda por documento
  searchDocumento = '';
  searchedUser: UserResponse | null = null;
  isSearching = false;

  constructor(
    private authService: AuthService,
    private apiService: ApiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Verificar que el usuario sea admin
    if (!this.isAdmin()) {
      Swal.fire('Acceso Denegado', 'No tienes permisos para acceder a esta sección', 'error');
      this.router.navigate(['/dashboard/home']);
    }
  }

  /**
   * Verificar si el usuario es ADMIN
   */
  isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  /**
   * Buscar usuario por documento
   */
  searchByDocumento(): void {
    if (!this.searchDocumento.trim()) {
      Swal.fire('Advertencia', 'Ingresa un documento', 'warning');
      return;
    }

    this.isSearching = true;

    this.apiService.getByDocumento(this.searchDocumento).subscribe({
      next: (user) => {
        this.isSearching = false;
        this.searchedUser = user;
        
        Swal.fire({
          icon: 'success',
          title: 'Usuario encontrado',
          html: `
            <div class="text-left">
              <p><strong>Nombre:</strong> ${user.name}</p>
              <p><strong>Email:</strong> ${user.email}</p>
              <p><strong>Username:</strong> ${user.username}</p>
              <p><strong>Rol:</strong> ${user.role}</p>
              <p><strong>Documento:</strong> ${user.documento || 'No registrado'}</p>
              <p><strong>Teléfono:</strong> ${user.phone || 'No registrado'}</p>
            </div>
          `,
          confirmButtonText: 'Cerrar'
        });
      },
      error: (error) => {
        this.isSearching = false;
        const errorMsg = error.error?.message || 'Usuario no encontrado';
        Swal.fire('Error', errorMsg, 'error');
        this.searchedUser = null;
      }
    });
  }

  /**
   * Limpiar búsqueda
   */
  clearSearch(): void {
    this.searchDocumento = '';
    this.searchedUser = null;
  }
}
