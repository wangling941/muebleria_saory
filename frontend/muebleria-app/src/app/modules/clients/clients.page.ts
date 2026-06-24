import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonContent, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { searchOutline } from 'ionicons/icons';

interface Client {
  id: number;
  name: string;
  dni: string;
  phone?: string;
  address?: string;
}

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, IonContent, IonIcon],
  templateUrl: './clients.page.html',
  styleUrls: ['./clients.page.scss'],
})
export class ClientsPage implements OnInit {
  private fb = inject(FormBuilder);

  clients: Client[] = [
    {
      id: 1,
      name: 'Juan Pérez',
      dni: '12345678',
      phone: '987654321',
      address: 'Av. Principal 123',
    },
    {
      id: 2,
      name: 'María García',
      dni: '87654321',
      phone: '912345678',
      address: 'Calle Secundaria 456',
    },
  ];

  filteredClients: Client[] = [];
  editingClient: Client | null = null;
  currentPage = 1;
  pageSize = 5;
  totalPages = 1;
  searchTerm = '';

  clientForm = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    dni: ['', [Validators.required, Validators.pattern(/^\d{8}$/)]],
    phone: [''],
    address: [''],
  });

  constructor() {
    addIcons({ searchOutline });
  }

  ngOnInit() {
    this.applyFilters();
  }

  onSearch(event: Event) {
    this.searchTerm = (event.target as HTMLInputElement).value;
    this.currentPage = 1;
    this.applyFilters();
  }

  applyFilters() {
    let filtered = this.clients;
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(
        (c) => c.name.toLowerCase().includes(term) || c.dni.includes(term),
      );
    }
    this.totalPages = Math.ceil(filtered.length / this.pageSize);
    const start = (this.currentPage - 1) * this.pageSize;
    this.filteredClients = filtered.slice(start, start + this.pageSize);
  }

  changePage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.applyFilters();
  }

  saveClient() {
    if (this.clientForm.invalid) return;
    const data = this.clientForm.getRawValue();

    if (this.editingClient) {
      const index = this.clients.findIndex((c) => c.id === this.editingClient!.id);
      this.clients[index] = { ...this.editingClient, ...data };
    } else {
      const newClient: Client = {
        id: Date.now(),
        ...data,
        phone: data.phone || undefined,
        address: data.address || undefined,
      };
      this.clients.push(newClient);
    }
    this.clientForm.reset();
    this.editingClient = null;
    this.applyFilters();
  }

  editClient(client: Client) {
    this.editingClient = client;
    this.clientForm.patchValue(client);
  }

  deleteClient(id?: number) {
    const targetId = id || this.editingClient?.id;
    if (!targetId) return;
    if (confirm('¿Eliminar este cliente?')) {
      this.clients = this.clients.filter((c) => c.id !== targetId);
      this.editingClient = null;
      this.clientForm.reset();
      this.applyFilters();
    }
  }

  cancelEdit() {
    this.editingClient = null;
    this.clientForm.reset();
  }
}
