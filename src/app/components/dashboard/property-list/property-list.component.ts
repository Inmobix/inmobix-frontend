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

  deleteProperty(id: number): void {
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
    });
  }
}
