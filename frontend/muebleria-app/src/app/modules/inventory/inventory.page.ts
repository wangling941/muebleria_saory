import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { searchOutline } from 'ionicons/icons';

interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  imageUrl?: string;
  isActive: boolean;
}

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [CommonModule, FormsModule, IonContent, IonIcon],
  templateUrl: './inventory.page.html',
  styleUrls: ['./inventory.page.scss'],
})
export class InventoryPage implements OnInit {
  products: Product[] = [
    { id: 1, name: 'Silla Metálica', price: 120, stock: 10, imageUrl: '', isActive: true },
    { id: 2, name: 'Mesa de Comedor', price: 350, stock: 5, imageUrl: '', isActive: true },
    { id: 3, name: 'Armario 2 Puertas', price: 480, stock: 0, imageUrl: '', isActive: true },
    { id: 4, name: 'Estantería', price: 200, stock: 8, imageUrl: '', isActive: false },
  ];

  filteredProducts: Product[] = [];

  constructor() {
    addIcons({ searchOutline });
  }

  ngOnInit() {
    this.filteredProducts = [...this.products];
  }

  onSearch(event: Event) {
    const term = (event.target as HTMLInputElement).value.toLowerCase();
    this.filteredProducts = this.products.filter((p) => p.name.toLowerCase().includes(term));
  }

  openProductModal() {
    alert('Modal para agregar producto - Próximamente');
  }

  editProduct(product: Product) {
    alert(`Editar producto: ${product.name} - Próximamente`);
  }

  toggleProduct(product: Product) {
    product.isActive = !product.isActive;
    // Aquí iría la llamada a la API para actualizar el estado
  }
}
