import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonContent,
  IonCard,
  IonCardContent,
  IonGrid,
  IonRow,
  IonCol,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, IonContent, IonCard, IonCardContent, IonGrid, IonRow, IonCol],
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage {
  stats = [
    { label: 'Ventas hoy', value: 'S/ 0.00', color: '#0a5c2e' },
    { label: 'Ganancias mensuales', value: 'S/ 0.00', color: '#1a3a8a' },
    { label: 'Productos vendidos', value: '0', color: '#f59e0b' },
    { label: 'Clientes activos', value: '0', color: '#7c3aed' },
  ];
}
