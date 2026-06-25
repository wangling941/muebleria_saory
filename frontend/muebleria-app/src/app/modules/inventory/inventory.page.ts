import { Component, inject, OnInit, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  IonContent,
  IonIcon,
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButton,
  IonInput,
  IonItem,
  IonLabel,
  IonSpinner,
  IonBadge,
  ToastController,
  AlertController,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  searchOutline,
  closeOutline,
  saveOutline,
  imageOutline,
  trashOutline,
  createOutline,
} from 'ionicons/icons';
import { firstValueFrom } from 'rxjs';
import {
  ProductosApiService,
  Producto,
  CreateProductoRequest,
  UpdateProductoRequest,
} from '../../core/services/productos-api.service';
import { AuthSessionService } from '../../core/services/auth-session.service';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonContent,
    IonIcon,
    IonModal,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButton,
    IonInput,
    IonItem,
    IonLabel,
    IonSpinner,
    IonBadge,
  ],
  templateUrl: './inventory.page.html',
  styleUrls: ['./inventory.page.scss'],
})
export class InventoryPage implements OnInit {
  @ViewChild('productModal') productModal!: IonModal;

  // Estado
  productos = signal<Producto[]>([]);
  filteredProductos = signal<Producto[]>([]);
  isLoading = signal(false);
  isSaving = signal(false);
  searchTerm = signal('');
  isEditing = signal(false);
  editingId = signal<number | null>(null);
  previewImage = signal<string | null>(null);

  // Usuario
  private auth = inject(AuthSessionService);
  user = this.auth.getCurrentUser();
  isAdmin = this.user?.role === 'ADMIN';

  // Servicios
  private productosApi = inject(ProductosApiService);
  private fb = inject(FormBuilder);
  private toastCtrl = inject(ToastController);
  private alertCtrl = inject(AlertController);

  // Formulario
  productForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
    description: [''],
    price: ['', [Validators.required, Validators.min(0.01)]],
    stock: ['', [Validators.required, Validators.min(0)]],
    imageUrl: ['', [this.imageUrlValidator]],
    isActive: [true],
  });

  // Validador personalizado para URL de imagen
  private imageUrlValidator(control: any): { [key: string]: any } | null {
    const url = control.value;
    if (!url) return null;
    const pattern = /^https?:\/\/[a-zA-Z0-9\-._~:/?#[\]@!$&'()*+,;=]+$/;
    if (!pattern.test(url)) {
      return { invalidUrl: true };
    }
    const imgExtensions = /\.(jpg|jpeg|png|gif|webp|svg|bmp)$/i;
    if (!imgExtensions.test(url) && !url.includes('data:image')) {
      return { notImage: true };
    }
    return null;
  }

  constructor() {
    addIcons({
      searchOutline,
      closeOutline,
      saveOutline,
      imageOutline,
      trashOutline,
      createOutline,
    });
  }

  ngOnInit() {
    this.cargarProductos();
  }

  // ========== CRUD ==========
  cargarProductos() {
    this.isLoading.set(true);
    this.productosApi.listar().subscribe({
      next: (data) => {
        this.productos.set(data);
        this.filteredProductos.set(data);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
        this.mostrarError('Error al cargar productos');
      },
    });
  }

  onSearch(event: Event) {
    const term = (event.target as HTMLInputElement).value.toLowerCase();
    this.searchTerm.set(term);
    if (!term) {
      this.filteredProductos.set(this.productos());
      return;
    }
    this.filteredProductos.set(this.productos().filter((p) => p.name.toLowerCase().includes(term)));
  }

  // ========== ABRIR MODAL (CREAR / EDITAR) ==========
  openCreateModal() {
    this.isEditing.set(false);
    this.editingId.set(null);
    this.productForm.reset({
      name: '',
      description: '',
      price: '',
      stock: '',
      imageUrl: '',
      isActive: true,
    });
    this.previewImage.set(null);
    this.productModal.present();
  }

  openEditModal(product: Producto) {
    this.isEditing.set(true);
    this.editingId.set(product.id);
    this.productForm.patchValue({
      name: product.name,
      description: product.description || '',
      price: product.price,
      stock: product.stock,
      imageUrl: product.imageUrl || '',
      isActive: product.isActive,
    });
    this.previewImage.set(product.imageUrl || null);
    this.productModal.present();
  }

  closeModal() {
    this.productModal.dismiss();
    this.productForm.reset();
    this.previewImage.set(null);
  }

  onImageUrlChange() {
    const url = this.productForm.get('imageUrl')?.value;
    this.previewImage.set(url || null);
  }

  // ========== GUARDAR PRODUCTO (CORREGIDO) ==========
  async guardarProducto() {
    if (this.productForm.invalid) {
      this.marcarTocados();
      this.mostrarError('Corrige los errores en el formulario');
      return;
    }

    this.isSaving.set(true);
    const formValue = this.productForm.value;

    try {
      if (this.isEditing() && this.editingId()) {
        // --- ACTUALIZAR ---
        const payload: UpdateProductoRequest = {
          name: formValue.name,
          description: formValue.description || undefined,
          price: formValue.price,
          stock: formValue.stock,
          imageUrl: formValue.imageUrl || undefined,
        };
        const updated = await firstValueFrom(
          this.productosApi.actualizar(this.editingId()!, payload),
        );
        // ✅ Verificación explícita para evitar undefined
        if (!updated) {
          this.mostrarError('No se recibió respuesta del servidor');
          return;
        }

        const currentProducts = this.productos();
        const index = currentProducts.findIndex((p) => p.id === updated.id);
        if (index !== -1) {
          const newProducts = [...currentProducts];
          newProducts[index] = updated;
          this.productos.set(newProducts);
          this.filteredProductos.set(newProducts);
        }
        this.mostrarExito('Producto actualizado');
      } else {
        // --- CREAR ---
        const payload: CreateProductoRequest = {
          name: formValue.name,
          description: formValue.description || undefined,
          price: formValue.price,
          stock: formValue.stock,
          imageUrl: formValue.imageUrl || undefined,
          isActive: true,
        };
        const nuevo = await firstValueFrom(this.productosApi.crear(payload));
        // ✅ Verificación explícita
        if (!nuevo) {
          this.mostrarError('No se recibió respuesta del servidor');
          return;
        }

        const currentProducts = this.productos();
        this.productos.set([nuevo, ...currentProducts]);
        this.filteredProductos.set(this.productos());
        this.mostrarExito('Producto creado');
      }

      this.closeModal();
    } catch (error: any) {
      this.mostrarError(error?.error?.message || 'Error al guardar producto');
    } finally {
      this.isSaving.set(false);
    }
  }

  // ========== CAMBIAR ESTADO ==========
  async toggleStatus(product: Producto) {
    if (!this.isAdmin) {
      this.mostrarError('Solo administradores pueden cambiar el estado');
      return;
    }

    const nuevoEstado = !product.isActive;
    const mensaje = nuevoEstado
      ? '¿Deseas activar este producto?'
      : '¿Deseas desactivar este producto?';

    const alert = await this.alertCtrl.create({
      header: 'Cambiar estado',
      message: mensaje,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Confirmar',
          handler: () => {
            this.productosApi.cambiarEstado(product.id, nuevoEstado).subscribe({
              next: (actualizado) => {
                // ✅ Verificación
                if (!actualizado) {
                  this.mostrarError('No se recibió respuesta del servidor');
                  return;
                }
                const currentProducts = this.productos();
                const index = currentProducts.findIndex((p) => p.id === actualizado.id);
                if (index !== -1) {
                  const newProducts = [...currentProducts];
                  newProducts[index] = actualizado;
                  this.productos.set(newProducts);
                  this.filteredProductos.set(newProducts);
                }
                this.mostrarExito(`Producto ${nuevoEstado ? 'activado' : 'desactivado'}`);
              },
              error: () => this.mostrarError('Error al cambiar estado'),
            });
          },
        },
      ],
    });
    await alert.present();
  }

  // ========== ELIMINAR PRODUCTO ==========
  async eliminarProducto(product: Producto) {
    if (!this.isAdmin) {
      this.mostrarError('Solo administradores pueden eliminar productos');
      return;
    }

    const alert = await this.alertCtrl.create({
      header: 'Eliminar producto',
      message: `¿Estás seguro de eliminar "${product.name}"? Esta acción no se puede deshacer.`,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: () => {
            this.productosApi.eliminar(product.id).subscribe({
              next: () => {
                const currentProducts = this.productos();
                const newProducts = currentProducts.filter((p) => p.id !== product.id);
                this.productos.set(newProducts);
                this.filteredProductos.set(newProducts);
                this.mostrarExito('Producto eliminado');
              },
              error: () => this.mostrarError('Error al eliminar producto'),
            });
          },
        },
      ],
    });
    await alert.present();
  }

  // ========== UTILIDADES ==========
  private marcarTocados() {
    Object.keys(this.productForm.controls).forEach((key) => {
      this.productForm.get(key)?.markAsTouched();
    });
  }

  private async mostrarError(mensaje: string) {
    const toast = await this.toastCtrl.create({
      message: mensaje,
      duration: 3000,
      color: 'danger',
      position: 'top',
    });
    toast.present();
  }

  private async mostrarExito(mensaje: string) {
    const toast = await this.toastCtrl.create({
      message: mensaje,
      duration: 2000,
      color: 'success',
      position: 'top',
    });
    toast.present();
  }
}
