import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { ApiService } from '../../../services/api.service';
import { UserResponse, UserUpdateRequest } from '../../../models/user.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.component.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ProfileComponent implements OnInit {
  user: UserResponse | null = null;
  isEditing = false;
  isLoading = false;

  // Formulario de edición
  editForm: UserUpdateRequest = {
    name: '',
    username: '',
    email: '',
    phone: '',
    birthDate: '',
    documento: ''
  };

  // Datos originales para comparar
  private originalData: UserUpdateRequest = {
    name: '',
    username: '',
    email: '',
    phone: '',
    birthDate: '',
    documento: ''
  };

  constructor(
    private authService: AuthService,
    private apiService: ApiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadUserData();
  }

  /**
   * Verificar si hay cambios en el formulario
   */
  get hasChanges(): boolean {
    return JSON.stringify(this.editForm) !== JSON.stringify(this.originalData);
  }

  /**
   * Cargar datos del usuario actual
   */
  loadUserData(): void {
    this.user = this.authService.getCurrentUser();
    
    if (!this.user) {
      Swal.fire('Error', 'No se encontró información del usuario', 'error');
      this.router.navigate(['/login']);
      return;
    }

    // Inicializar formulario con datos actuales
    this.editForm = {
      name: this.user.name || '',
      username: this.user.username || '',
      email: this.user.email || '',
      phone: this.user.phone || '',
      birthDate: this.user.birthDate || '',
      documento: this.user.documento || ''
    };

    // Guardar copia de los datos originales
    this.originalData = { ...this.editForm };
  }

  /**
   * Activar modo edición
   */
  enableEdit(): void {
    this.isEditing = true;
  }

  /**
   * Cancelar edición
   */
  cancelEdit(): void {
    this.isEditing = false;
    this.loadUserData(); // Recargar datos originales
  }

  /**
   * Paso 1: Solicitar token de edición
   */
  requestEdit(): void {
    if (!this.user?.id) return;

    this.isLoading = true;

    this.apiService.requestEditToken(this.user.id).subscribe({
      next: () => {
        this.isLoading = false;
        
        Swal.fire({
          icon: 'info',
          title: 'Confirma tu edición',
          html: `
            <p>Te hemos enviado un correo a <strong>${this.user?.email}</strong></p>
            <p>Ingresa el token que recibiste para confirmar los cambios:</p>
          `,
          input: 'text',
          inputLabel: 'Token de confirmación',
          inputPlaceholder: 'Ingresa el token',
          showCancelButton: true,
          confirmButtonText: 'Confirmar',
          cancelButtonText: 'Cancelar',
          preConfirm: (token) => {
            if (!token) {
              Swal.showValidationMessage('Debes ingresar el token');
              return false;
            }
            return token;
          }
        }).then((result) => {
          if (result.isConfirmed && result.value) {
            this.confirmEdit(result.value);
          }
        });
      },
      error: (error) => {
        this.isLoading = false;
        const errorMsg = error.error?.message || 'Error al solicitar edición';
        Swal.fire('Error', errorMsg, 'error');
      }
    });
  }

  /**
   * Paso 2: Confirmar edición con token
   */
  confirmEdit(token: string): void {
    this.isLoading = true;

    this.apiService.confirmUpdate(token, this.editForm).subscribe({
      next: (updatedUser) => {
        this.isLoading = false;
        this.user = updatedUser;
        this.isEditing = false;
        
        Swal.fire({
          icon: 'success',
          title: '¡Perfil actualizado!',
          text: 'Tus datos se han actualizado correctamente',
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton: false
        });
      },
      error: (error) => {
        this.isLoading = false;
        const errorMsg = error.error?.message || 'Error al confirmar edición';
        Swal.fire('Error', errorMsg, 'error');
      }
    });
  }

  /**
   * Paso 1: Solicitar eliminación de cuenta
   */
  requestDelete(): void {
    if (!this.user?.id) return;

    Swal.fire({
      icon: 'warning',
      title: '¿Eliminar cuenta?',
      text: 'Esta acción es irreversible. ¿Estás seguro?',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.isLoading = true;

        this.apiService.requestDeleteToken(this.user!.id).subscribe({
          next: () => {
            this.isLoading = false;
            
            Swal.fire({
              icon: 'info',
              title: 'Confirma la eliminación',
              html: `
                <p>Te hemos enviado un correo a <strong>${this.user?.email}</strong></p>
                <p>Ingresa el token para confirmar la eliminación:</p>
              `,
              input: 'text',
              inputLabel: 'Token de confirmación',
              inputPlaceholder: 'Ingresa el token',
              showCancelButton: true,
              confirmButtonText: 'Eliminar cuenta',
              cancelButtonText: 'Cancelar',
              confirmButtonColor: '#d33',
              preConfirm: (token) => {
                if (!token) {
                  Swal.showValidationMessage('Debes ingresar el token');
                  return false;
                }
                return token;
              }
            }).then((result) => {
              if (result.isConfirmed && result.value) {
                this.confirmDelete(result.value);
              }
            });
          },
          error: (error) => {
            this.isLoading = false;
            const errorMsg = error.error?.message || 'Error al solicitar eliminación';
            Swal.fire('Error', errorMsg, 'error');
          }
        });
      }
    });
  }

  /**
   * Paso 2: Confirmar eliminación con token
   */
  confirmDelete(token: string): void {
    this.isLoading = true;

    this.apiService.confirmDelete(token).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Cuenta eliminada',
          text: 'Tu cuenta ha sido eliminada permanentemente',
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton: false
        }).then(() => {
          this.router.navigate(['/']);
        });
      },
      error: (error) => {
        this.isLoading = false;
        const errorMsg = error.error?.message || 'Error al confirmar eliminación';
        Swal.fire('Error', errorMsg, 'error');
      }
    });
  }
}