import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { ApiService } from '../../../services/api.service';
import { FileDownloadService } from '../../../services/file-download.service';
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
  searchDocumento = '';
  searchedUser: UserResponse | null = null;
  isSearching = false;
  isDownloading = false;

  constructor(
    private authService: AuthService,
    private apiService: ApiService,
    private fileDownloadService: FileDownloadService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (!this.isAdmin()) {
      Swal.fire('Acceso Denegado', 'No tienes permisos para acceder a esta sección', 'error');
      this.router.navigate(['/dashboard/home']);
    }
  }

  isAdmin(): boolean {
    return this.authService.isAdmin();
  }

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

  clearSearch(): void {
    this.searchDocumento = '';
    this.searchedUser = null;
  }

  /**
   * Descargar reporte PDF de todos los usuarios
   */
  downloadAllUsersPdf(): void {
    this.isDownloading = true;

    this.apiService.downloadAllUsersPdfReport().subscribe({
      next: (blob) => {
        const fileName = this.fileDownloadService.generateFileName('reporte_usuarios', 'pdf');
        this.fileDownloadService.downloadFile(blob, fileName);
        this.isDownloading = false;
        
        Swal.fire({
          icon: 'success',
          title: 'Descarga exitosa',
          text: 'El reporte PDF se ha descargado correctamente',
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton: false
        });
      },
      error: (error) => {
        this.isDownloading = false;
        const errorMsg = error.error?.message || 'Error al descargar el reporte PDF';
        Swal.fire('Error', errorMsg, 'error');
      }
    });
  }

  /**
   * Descargar reporte Excel de todos los usuarios
   */
  downloadAllUsersExcel(): void {
    this.isDownloading = true;

    this.apiService.downloadAllUsersExcelReport().subscribe({
      next: (blob) => {
        const fileName = this.fileDownloadService.generateFileName('reporte_usuarios', 'xlsx');
        this.fileDownloadService.downloadFile(blob, fileName);
        this.isDownloading = false;
        
        Swal.fire({
          icon: 'success',
          title: 'Descarga exitosa',
          text: 'El reporte Excel se ha descargado correctamente',
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton: false
        });
      },
      error: (error) => {
        this.isDownloading = false;
        const errorMsg = error.error?.message || 'Error al descargar el reporte Excel';
        Swal.fire('Error', errorMsg, 'error');
      }
    });
  }
}