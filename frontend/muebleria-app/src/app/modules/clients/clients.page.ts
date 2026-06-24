import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonContent, IonIcon, AlertController } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { searchOutline, alertCircleOutline, createOutline, trashOutline } from 'ionicons/icons';
import { ClientsApiService } from './services/clients-api.service';
import { Client } from './interfaces/client.interface';
import { PageTitleService } from '../../core/services/page-title.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-clients',
  standalone: true,
  templateUrl: './clients.page.html',
  styleUrls: ['./clients.page.scss'],
  imports: [CommonModule, ReactiveFormsModule, IonContent, IonIcon],
})
export class ClientsPage implements OnInit {
  private fb = inject(FormBuilder);
  private clientsApi = inject(ClientsApiService);
  private alertCtrl = inject(AlertController);
  private titleService = inject(PageTitleService);
  private searchTimeout: any;

  clientForm = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    dni: ['', [Validators.required, Validators.pattern(/^\d{8}$/)]],
    phone: ['', [Validators.pattern(/^\d{9}$/)]],
    address: [''],
  });

  clients: Client[] = [];
  filteredClients: Client[] = [];
  currentPage = 1;
  pageSize = 10;
  totalPages = 1;
  editingClient: Client | null = null;
  searchTerm = '';
  loading = false;
  error = '';

  constructor() {
    addIcons({ searchOutline, alertCircleOutline, createOutline, trashOutline });
    console.log('✅ ClientsPage cargado');
  }

  ngOnInit() {
    this.titleService.setTitle('Gestión de Clientes');
    this.loadClients();
  }

  loadClients() {
    this.loading = true;
    this.error = '';
    console.log('🔍 Cargando clientes con searchTerm:', this.searchTerm);

    this.clientsApi
      .list(this.searchTerm)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (res) => {
          console.log('📋 Clientes recibidos:', res);
          this.clients = (res.data || []) as Client[];
          this.totalPages = Math.max(1, Math.ceil(this.clients.length / this.pageSize));
          if (this.currentPage > this.totalPages) this.currentPage = 1;
          this.updatePage();
          console.log(`📄 Total clientes: ${this.clients.length}, Páginas: ${this.totalPages}`);
        },
        error: (err) => {
          console.error('❌ Error cargando clientes:', err);
          this.error = err.error?.message || 'Error al cargar los clientes';
        },
      });
  }

  updatePage() {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.filteredClients = this.clients.slice(start, end);
    console.log(`📄 Página ${this.currentPage}: ${this.filteredClients.length} clientes mostrados`);
  }

  changePage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.updatePage();
  }

  onSearch(event: Event) {
    const input = event.target as HTMLInputElement;
    clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => {
      this.searchTerm = input.value;
      this.currentPage = 1;
      this.loadClients();
    }, 400);
  }

  saveClient() {
    if (this.clientForm.invalid) {
      this.clientForm.markAllAsTouched();
      return;
    }

    const formValue = this.clientForm.getRawValue();
    const payload = {
      name: formValue.name,
      dni: formValue.dni,
      phone: formValue.phone || undefined,
      address: formValue.address || undefined,
    };

    this.loading = true;
    this.error = '';
    console.log('💾 Guardando cliente:', payload);

    const request = this.editingClient
      ? this.clientsApi.update(this.editingClient.id, payload)
      : this.clientsApi.create(payload);

    request.pipe(finalize(() => (this.loading = false))).subscribe({
      next: (res) => {
        if (res && res.data) {
          console.log('✅ Cliente guardado correctamente');
          this.resetForm();
          this.loadClients();
        }
      },
      error: (err) => {
        console.error('❌ Error guardando cliente:', err);
        this.error = err.error?.message || 'Error al guardar el cliente';
      },
    });
  }

  editClient(client: Client) {
    this.editingClient = client;
    this.clientForm.patchValue({
      name: client.name,
      dni: client.dni,
      phone: client.phone || '',
      address: client.address || '',
    });
    console.log('✏️ Editando cliente:', client);
  }

  async deleteClient(id: number) {
    console.log('🗑️ Eliminando cliente ID:', id);

    const alert = await this.alertCtrl.create({
      header: 'Eliminar cliente',
      message: '¿Estás seguro de que deseas eliminar este cliente?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('❌ Eliminación cancelada');
          },
        },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: () => {
            console.log('✅ Confirmada eliminación para ID:', id);
            this.loading = true;
            this.error = '';
            this.clientsApi
              .delete(id)
              .pipe(finalize(() => (this.loading = false)))
              .subscribe({
                next: () => {
                  console.log('✅ Cliente eliminado correctamente');
                  this.resetForm();
                  this.loadClients();
                },
                error: (err) => {
                  console.error('❌ Error eliminando cliente:', err);
                  this.error = err.error?.message || 'Error al eliminar cliente';
                },
              });
          },
        },
      ],
    });

    await alert.present();
  }

  cancelEdit() {
    this.resetForm();
  }

  private resetForm() {
    this.clientForm.reset({ name: '', dni: '', phone: '', address: '' });
    this.editingClient = null;
    this.error = '';
    this.clientForm.markAsUntouched();
  }
}
