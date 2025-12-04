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
    userId: '',
  };

  loading = false;
  isEditing = false;
  editingPropertyId: string | null = null;
  selectedFile: File | null = null;
  imagePreview: string | null = null;

  constructor(
    private propertyService: PropertyService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const propertyId = params['id'];
      if (propertyId) {
        this.isEditing = true;
        this.editingPropertyId = propertyId;
        this.loadProperty(propertyId);
      }
    });
  }

  loadProperty(id: string): void {
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
            userId: property.userId || '',
          };
          if (this.propertyForm.imageUrl) {
            this.imagePreview = this.propertyForm.imageUrl;
          }
          this.loading = false;
      },
      error: (error) => {
        Swal.fire('Error', 'No se pudo cargar la propiedad', 'error');
        this.router.navigate(['/dashboard/properties']);
      }
    });
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      // Validate file type (optional)
      if (!file.type.startsWith('public/images/')) {
        Swal.fire('Error', 'Por favor selecciona un archivo de imagen válido', 'error');
        return;
      }

      this.selectedFile = file;

      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage(): void {
    if (this.propertyForm.imageUrl) {
      Swal.fire({
        title: '¿Estás seguro?',
        text: "Se eliminará la imagen actual",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminar'
      }).then((result) => {
        if (result.isConfirmed) {
           this.propertyService.deleteImage(this.propertyForm.imageUrl!).subscribe({
             next: () => {
               this.clearImageState();
               Swal.fire('Eliminado', 'La imagen ha sido eliminada', 'success');
             },
             error: () => {
               // Even if backend fails, we might want to clear it locally or show error
               // For now, let's assume we just clear it locally if it fails or if it's just a path update
               this.clearImageState();
               Swal.fire('Info', 'Imagen removida de la vista', 'info');
             }
           });
        }
      });
    } else {
      this.clearImageState();
    }
  }

  private clearImageState(): void {
    this.selectedFile = null;
    this.imagePreview = null;
    this.propertyForm.imageUrl = "";
  }

  saveProperty(): void {
    // Validate required fields manually or rely on form valid state if passed
    if (!this.propertyForm.title || !this.propertyForm.city || !this.propertyForm.price) {
      Swal.fire('Error', 'Por favor completa los campos obligatorios (Título, Precio, Ciudad)', 'error');
      return;
    }

    this.loading = true;

    if (this.selectedFile) {
      this.propertyService.uploadImage(this.selectedFile).subscribe({
        next: (response) => {
          this.propertyForm.imageUrl = response.imageUrl;
          this.submitPropertyData();
        },
        error: (error) => {
          console.error('Error uploading image:', error);
          const errorMessage = error.error?.message || error.message || 'Error desconocido al subir la imagen';
          Swal.fire('Error', `Error al subir la imagen: ${errorMessage}`, 'error');
          this.loading = false;
        }
      });
    } else {
      this.submitPropertyData();
    }
  }

  submitPropertyData(): void {
    if (this.isEditing && this.editingPropertyId) {
      this.propertyService.updateProperty(this.editingPropertyId, this.propertyForm).subscribe({
        next: () => {
          Swal.fire('Éxito', 'Propiedad actualizada correctamente', 'success');
          this.router.navigate(['/dashboard/properties']);
        },
        error: (error) => {
          Swal.fire('Error', 'No se pudo actualizar la propiedad', 'error');
          this.loading = false;
        }
      });
    } else {
      // Assign current user ID
      const userId = this.authService.getUserId();
      if (userId) {
        this.propertyForm.userId = userId;
      }

      this.propertyService.createProperty(this.propertyForm).subscribe({
        next: () => {
          Swal.fire('Éxito', 'Propiedad creada correctamente', 'success');
          this.router.navigate(['/dashboard/properties']);
        },
        error: (error) => {
          const errorMessage = error.error?.message || error.message || "Error desconocido";
          Swal.fire('Error', `No se pudo crear la propiedad: ${errorMessage}`, 'error');
          this.loading = false;
        }
      });
    }
  }
}
