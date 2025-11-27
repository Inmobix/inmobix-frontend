import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { PropertyService } from '../../../services/property.service';
import { AuthService } from '../../../services/auth.service';
import { PropertyRequest } from '../../../models/property.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-property-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './property-form.component.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PropertyFormComponent implements OnInit {
  propertyForm: PropertyRequest = {
    title: "",
    description: "",
    address: "",
    city: "",
    state: "",
    price: 0,
    area: 0,
    bedrooms: 0,
    bathrooms: 0,
    garages: 0,
    propertyType: "HOUSE",
    transactionType: "SALE",
    available: true,
    imageUrl: "",
    userId: 0,
  };

  loading = false;
  isEditing = false;
  editingPropertyId: number | null = null;

  constructor(
    private propertyService: PropertyService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditing = true;
        this.editingPropertyId = +params['id'];
        this.loadProperty(this.editingPropertyId);
      }
    });
  }

  loadProperty(id: number): void {
    this.loading = true;
    this.propertyService.getPropertyById(id).subscribe({
      next: (property) => {
        this.propertyForm = {
          title: property.title,
          description: property.description,
          address: property.address,
          city: property.city,
          state: property.state,
          price: property.price,
          area: property.area,
          bedrooms: property.bedrooms,
          bathrooms: property.bathrooms,
          garages: property.garages,
          propertyType: property.propertyType,
          transactionType: property.transactionType,
          available: property.available,
          imageUrl: property.imageUrl || "",
          userId: property.userId || 0,
        };
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading property:', error);
        Swal.fire('Error', 'No se pudo cargar la propiedad', 'error');
        this.router.navigate(['/dashboard/properties']);
      }
    });
  }

  saveProperty(): void {
    this.loading = true;

    if (this.isEditing && this.editingPropertyId) {
      this.propertyService.updateProperty(this.editingPropertyId, this.propertyForm).subscribe({
        next: () => {
          Swal.fire('Éxito', 'Propiedad actualizada correctamente', 'success');
          this.router.navigate(['/dashboard/properties']);
        },
        error: (error) => {
          console.error('Error updating property:', error);
          Swal.fire('Error', 'No se pudo actualizar la propiedad', 'error');
          this.loading = false;
        }
      });
    } else {
      // Assign current user ID
      const userId = this.authService.getUserId();
      if (userId) {
        this.propertyForm.userId = Number(userId);
      }

      this.propertyService.createProperty(this.propertyForm).subscribe({
        next: () => {
          Swal.fire('Éxito', 'Propiedad creada correctamente', 'success');
          this.router.navigate(['/dashboard/properties']);
        },
        error: (error) => {
          console.error('Error creating property:', error);
          const errorMessage = error.error?.message || error.message || "Error desconocido";
          Swal.fire('Error', `No se pudo crear la propiedad: ${errorMessage}`, 'error');
          this.loading = false;
        }
      });
    }
  }
}
