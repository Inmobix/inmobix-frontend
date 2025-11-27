import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { PropertyService } from '../../../services/property.service';
import { PropertyResponse } from '../../../models/property.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './search.component.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SearchComponent {
  properties: PropertyResponse[] = [];
  loading = false;

  searchCity = "";
  searchType = "";
  searchTransaction = "";
  minPrice: number | null = null;
  maxPrice: number | null = null;

  constructor(private propertyService: PropertyService) {}

  searchByCity(): void {
    if (!this.searchCity) {
      Swal.fire("Advertencia", "Por favor ingresa una ciudad", "warning");
      return;
    }
    this.loading = true;
    this.propertyService.getPropertiesByCity(this.searchCity).subscribe({
      next: (data) => {
        this.properties = data;
        this.loading = false;
      },
      error: (error) => {
        console.error("Error en búsqueda:", error);
        Swal.fire("Error", "No se pudo realizar la búsqueda", "error");
        this.loading = false;
      },
    });
  }

  searchByType(): void {
    if (!this.searchType) {
      Swal.fire("Advertencia", "Por favor selecciona un tipo", "warning");
      return;
    }
    this.loading = true;
    this.propertyService.getPropertiesByType(this.searchType).subscribe({
      next: (data) => {
        this.properties = data;
        this.loading = false;
      },
      error: (error) => {
        console.error("Error en búsqueda:", error);
        Swal.fire("Error", "No se pudo realizar la búsqueda", "error");
        this.loading = false;
      },
    });
  }

  searchByTransaction(): void {
    if (!this.searchTransaction) {
      Swal.fire("Advertencia", "Por favor selecciona un tipo de transacción", "warning");
      return;
    }
    this.loading = true;
    this.propertyService.getPropertiesByTransaction(this.searchTransaction).subscribe({
      next: (data) => {
        this.properties = data;
        this.loading = false;
      },
      error: (error) => {
        console.error("Error en búsqueda:", error);
        Swal.fire("Error", "No se pudo realizar la búsqueda", "error");
        this.loading = false;
      },
    });
  }

  searchByPriceRange(): void {
    if (this.minPrice === null || this.maxPrice === null) {
      Swal.fire("Advertencia", "Por favor ingresa ambos precios", "warning");
      return;
    }
    this.loading = true;
    this.propertyService.getPropertiesByPriceRange(this.minPrice, this.maxPrice).subscribe({
      next: (data) => {
        this.properties = data;
        this.loading = false;
      },
      error: (error) => {
        console.error("Error en búsqueda:", error);
        Swal.fire("Error", "No se pudo realizar la búsqueda", "error");
        this.loading = false;
      },
    });
  }
}
