import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonContent, IonIcon, AlertController } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { searchOutline } from 'ionicons/icons';
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
    addIcons({ searchOutline });
  }

  ngOnInit() {
    this.titleService.setTitle('Gestión de Clientes');
    this.loadClients();
  }

  loadClients() {
    this.loading = true;
    this.error = '';
    this.clientsApi
      .list(this.searchTerm)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (res) => {
          this.clients = res.data;
          this.totalPages = Math.ceil(this.clients.length / this.pageSize);
          this.updatePage();
        },
        error: (err) => {
          this.error = err.error?.message || 'Error al cargar los clientes';
          console.error('Error loading clients:', err);
        },
      });
  }

  updatePage() {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.filteredClients = this.clients.slice(start, end);
  }

  changePage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.updatePage();
  }

  onSearch(event: Event) {
    const input = event.target as HTMLInputElement;
    this.searchTerm = input.value;
    this.currentPage = 1;
    this.loadClients();
  }

  saveClient() {
    if (this.clientForm.invalid) {
      // Marcar todos los campos como touched para mostrar errores
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
    const request = this.editingClient
      ? this.clientsApi.update(this.editingClient.id, payload)
      : this.clientsApi.create(payload);

    request.pipe(finalize(() => (this.loading = false))).subscribe({
      next: () => {
        this.resetForm();
        this.loadClients();
      },
      error: (err) => {
        this.error = err.error?.message || 'Error al guardar el cliente';
        console.error('Error saving client:', err);
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
  }

  async deleteClient(id: number) {
    const alert = await this.alertCtrl.create({
      header: 'Eliminar cliente',
      message: '¿Estás seguro de que deseas eliminar este cliente?',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: () => {
            this.loading = true;
            this.clientsApi
              .delete(id)
              .pipe(finalize(() => (this.loading = false)))
              .subscribe({
                next: () => {
                  this.loadClients();
                },
                error: (err) => {
                  this.error = err.error?.message || 'Error al eliminar cliente';
                  console.error('Error deleting client:', err);
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
    this.clientForm.reset({
      name: '',
      dni: '',
      phone: '',
      address: '',
    });
    this.editingClient = null;
    this.error = '';
    this.clientForm.markAsUntouched();
  }
}
