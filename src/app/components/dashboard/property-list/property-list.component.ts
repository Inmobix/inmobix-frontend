import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PropertyService } from '../../../services/property.service';
import { PropertyResponse } from '../../../models/property.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-property-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './property-list.component.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PropertyListComponent implements OnInit {
  properties: PropertyResponse[] = [];
  loading = false;

  constructor(private propertyService: PropertyService) {}

  ngOnInit(): void {
    this.loadProperties();
  }

  loadProperties(): void {
    this.loading = true;
    this.propertyService.getAllProperties().subscribe({
      next: (data) => {
        this.properties = data;
        this.loading = false;
      },
      error: (error) => {
        Swal.fire('Error', 'No se pudieron cargar las propiedades', 'error');
        this.loading = false;
      }
    });
  }

  loadAvailableProperties(): void {
    this.loading = true;
    this.propertyService.getAvailableProperties().subscribe({
      next: (data) => {
        this.properties = data;
        this.loading = false;
      },
      error: (error) => {
        Swal.fire('Error', 'No se pudieron cargar las propiedades disponibles', 'error');
        this.loading = false;
      }
    });
  }

  deleteProperty(id: string): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.loading = true;
        const property = this.properties.find(p => p.id === id);

        if (property && property.imageUrl) {
          this.propertyService.deleteImage(property.imageUrl).subscribe({
            next: () => this.executeDeleteProperty(id),
            error: (err) => {
              console.error('Error deleting image:', err);
              // Proceed with property deletion even if image deletion fails
              this.executeDeleteProperty(id);
            }
          });
        } else {
          this.executeDeleteProperty(id);
        }
      }
    });
  }

  private executeDeleteProperty(id: string): void {
    this.propertyService.deleteProperty(id).subscribe({
      next: () => {
        Swal.fire('Eliminado', 'La propiedad ha sido eliminada', 'success');
        this.loadProperties();
        this.loading = false;
      },
      error: (error) => {
        Swal.fire('Error', 'No se pudo eliminar la propiedad', 'error');
        this.loading = false;
      },
    });
  }

  onImageError(event: Event): void {
    const target = event.target as HTMLImageElement;
    if (target) {
      target.src = 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1073&q=80';
    }
  }
}
