import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import {
  IonList,
  IonItem,
  IonIcon,
  IonLabel,
  IonMenu,
  MenuController,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  homeOutline,
  peopleOutline,
  cartOutline,
  cubeOutline,
  barChartOutline,
  statsChartOutline,
} from 'ionicons/icons';
import { AuthSessionService } from '../../core/services/auth-session.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, IonList, IonItem, IonIcon, IonLabel],
  template: `
    <ion-list>
      <ion-item routerLink="/app/dashboard" routerLinkActive="active">
        <ion-icon name="home-outline" slot="start"></ion-icon>
        <ion-label>Dashboard</ion-label>
      </ion-item>
      <ion-item routerLink="/app/clients" routerLinkActive="active">
        <ion-icon name="people-outline" slot="start"></ion-icon>
        <ion-label>Clientes</ion-label>
      </ion-item>
      <ion-item routerLink="/app/sales" routerLinkActive="active">
        <ion-icon name="cart-outline" slot="start"></ion-icon>
        <ion-label>Ventas</ion-label>
      </ion-item>
      <ion-item *ngIf="isAdmin" routerLink="/app/inventory" routerLinkActive="active">
        <ion-icon name="cube-outline" slot="start"></ion-icon>
        <ion-label>Inventario</ion-label>
      </ion-item>
      <ion-item *ngIf="isAdmin" routerLink="/app/reports" routerLinkActive="active">
        <ion-icon name="bar-chart-outline" slot="start"></ion-icon>
        <ion-label>Reportes</ion-label>
      </ion-item>
      <ion-item *ngIf="isAdmin" routerLink="/app/stats" routerLinkActive="active">
        <ion-icon name="stats-chart-outline" slot="start"></ion-icon>
        <ion-label>Panel Estadístico</ion-label>
      </ion-item>
    </ion-list>
  `,
  styles: [
    `
      ion-list {
        background: transparent;
        padding: 0;
      }
      ion-item {
        --color: white;
        --background: transparent;
        --background-hover: rgba(255, 255, 255, 0.1);
        --border-color: rgba(255, 255, 255, 0.1);
        --padding-start: 16px;
        --min-height: 48px;
      }
      ion-item.active {
        --background: rgba(255, 255, 255, 0.15);
        font-weight: 600;
      }
      ion-icon {
        color: white;
      }
    `,
  ],
})
export class SidebarComponent {
  private auth = inject(AuthSessionService);
  isAdmin = this.auth.getCurrentUser()?.role === 'ADMIN';

  constructor() {
    addIcons({
      homeOutline,
      peopleOutline,
      cartOutline,
      cubeOutline,
      barChartOutline,
      statsChartOutline,
    });
  }
}
