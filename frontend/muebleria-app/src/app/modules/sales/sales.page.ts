import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent } from '@ionic/angular/standalone';

interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  isActive: boolean;
}

interface Client {
  id: number;
  name: string;
  dni: string;
}

interface SaleItem {
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

@Component({
  selector: 'app-sales',
  standalone: true,
  imports: [CommonModule, FormsModule, IonContent],
  templateUrl: './sales.page.html',
  styleUrls: ['./sales.page.scss'],
})
export class SalesPage implements OnInit {
  clients: Client[] = [
    { id: 1, name: 'Juan Pérez', dni: '12345678' },
    { id: 2, name: 'María García', dni: '87654321' },
  ];

  products: Product[] = [
    { id: 1, name: 'Silla Metálica', price: 120, stock: 10, isActive: true },
    { id: 2, name: 'Mesa de Comedor', price: 350, stock: 5, isActive: true },
    { id: 3, name: 'Armario 2 Puertas', price: 480, stock: 0, isActive: true },
    { id: 4, name: 'Estantería', price: 200, stock: 8, isActive: false },
  ];

  selectedClient: number | null = null;
  selectedProduct: number | null = null;
  quantity = 1;
  unitPrice = 0;
  saleItems: SaleItem[] = [];
  paymentMethod: string = 'CASH';
  subtotal = 0;
  discount = 0;
  igv = 0;
  total = 0;

  constructor() {}

  ngOnInit() {}

  selectClient(event: Event) {
    const select = event.target as HTMLSelectElement;
    this.selectedClient = select.value ? parseInt(select.value) : null;
  }

  selectProduct(event: Event) {
    const select = event.target as HTMLSelectElement;
    this.selectedProduct = select.value ? parseInt(select.value) : null;
    const product = this.products.find((p) => p.id === this.selectedProduct);
    if (product) {
      this.unitPrice = product.price;
    }
  }

  calculateTotals() {
    this.subtotal = this.saleItems.reduce((sum, item) => sum + item.lineTotal, 0);
    this.igv = this.subtotal * 0.18;
    this.total = this.subtotal + this.igv - this.discount;
  }

  addItem() {
    if (!this.selectedProduct || this.quantity < 1) return;
    const product = this.products.find((p) => p.id === this.selectedProduct);
    if (!product || !product.isActive || product.stock === 0) return;

    const lineTotal = this.quantity * this.unitPrice;
    this.saleItems.push({
      productId: product.id,
      productName: product.name,
      quantity: this.quantity,
      unitPrice: this.unitPrice,
      lineTotal,
    });

    this.selectedProduct = null;
    this.quantity = 1;
    this.unitPrice = 0;
    this.calculateTotals();
  }

  removeItem(index: number) {
    this.saleItems.splice(index, 1);
    this.calculateTotals();
  }

  openClientModal() {
    // Implementar modal para agregar cliente
    alert('Modal para agregar cliente - Próximamente');
  }

  registerSale() {
    if (this.saleItems.length === 0 || !this.selectedClient) return;
    alert('Venta registrada exitosamente!');
    this.saleItems = [];
    this.selectedClient = null;
    this.calculateTotals();
  }
}
