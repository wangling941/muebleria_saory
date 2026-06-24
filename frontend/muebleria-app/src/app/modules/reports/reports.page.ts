import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent } from '@ionic/angular/standalone';

interface ProductSale {
  name: string;
  sold: number;
  imageUrl?: string;
}

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, FormsModule, IonContent],
  templateUrl: './reports.page.html',
  styleUrls: ['./reports.page.scss'],
})
export class ReportsPage implements OnInit {
  selectedDate: string = '';
  todaySales = 15;
  monthlyRevenue = 12500.5;
  totalProductsSold = 48;
  totalRevenue = 87500.75;

  topProducts: ProductSale[] = [
    { name: 'Silla Metálica', sold: 25, imageUrl: '' },
    { name: 'Mesa de Comedor', sold: 12, imageUrl: '' },
    { name: 'Armario 2 Puertas', sold: 8, imageUrl: '' },
  ];

  constructor() {}

  ngOnInit() {}

  applyFilter() {
    // Aquí iría la llamada a la API para filtrar por fecha
    console.log('Filtrar por fecha:', this.selectedDate);
  }

  resetFilter() {
    this.selectedDate = '';
    this.applyFilter();
  }
}
