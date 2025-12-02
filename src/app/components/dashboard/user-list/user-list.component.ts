import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../services/api.service';
import { FileDownloadService } from '../../../services/file-download.service';
import { UserResponse } from '../../../models/user.model';
import { RouterLink } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './user-list.component.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class UserListComponent implements OnInit {
  users: UserResponse[] = [];
  loading = true;
  downloadingUserId: string | null = null;

  constructor(
    private apiService: ApiService,
    private fileDownloadService: FileDownloadService
  ) {}

  ngOnInit() {
    this.apiService.getAllUsers().subscribe({
      next: (res) => {
        this.users = res;
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
      },
    });
  }

  /**
   * Descargar reporte PDF de un usuario específico
   */
  downloadUserPdfReport(user: UserResponse): void {
    this.downloadingUserId = user.id;

    this.apiService.downloadUserPdfReport(user.id).subscribe({
      next: (blob) => {
        const fileName = this.fileDownloadService.generateFileName(
          `reporte_${user.username}`,
          'pdf'
        );
        this.fileDownloadService.downloadFile(blob, fileName);
        this.downloadingUserId = null;

        Swal.fire({
          icon: 'success',
          title: 'Descarga exitosa',
          text: `Reporte PDF de ${user.name} descargado`,
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton: false
        });
      },
      error: (error) => {
        this.downloadingUserId = null;
        const errorMsg = error.error?.message || 'Error al descargar el reporte';
        Swal.fire('Error', errorMsg, 'error');
      }
    });
  }

  /**
   * Descargar reporte Excel de un usuario específico
   */
  downloadUserExcelReport(user: UserResponse): void {
    this.downloadingUserId = user.id;

    this.apiService.downloadUserExcelReport(user.id).subscribe({
      next: (blob) => {
        const fileName = this.fileDownloadService.generateFileName(
          `reporte_${user.username}`,
          'xlsx'
        );
        this.fileDownloadService.downloadFile(blob, fileName);
        this.downloadingUserId = null;

        Swal.fire({
          icon: 'success',
          title: 'Descarga exitosa',
          text: `Reporte Excel de ${user.name} descargado`,
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton: false
        });
      },
      error: (error) => {
        this.downloadingUserId = null;
        const errorMsg = error.error?.message || 'Error al descargar el reporte';
        Swal.fire('Error', errorMsg, 'error');
      }
    });
  }

  /**
   * Verificar si se está descargando reporte de un usuario
   */
  isDownloading(userId: string): boolean {
    return this.downloadingUserId === userId;
  }
}