import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { IonList, IonItem, IonIcon, IonLabel, IonAvatar } from '@ionic/angular/standalone';

import { addIcons } from 'ionicons';

import {
  homeOutline,
  peopleOutline,
  cartOutline,
  cubeOutline,
  barChartOutline,
  statsChartOutline,
  personCircleOutline,
} from 'ionicons/icons';

import { AuthSessionService } from '../../core/services/auth-session.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    IonList,
    IonItem,
    IonIcon,
    IonLabel,
    IonAvatar,
  ],
  template: `
    <div class="sidebar-wrapper">
      <ion-list>
        <ion-item routerLink="/app/dashboard" routerLinkActive="active">
          <ion-icon name="home-outline" slot="start"> </ion-icon>
          <ion-label>Panel de Control</ion-label>
        </ion-item>

        <ion-item routerLink="/app/clients" routerLinkActive="active">
          <ion-icon name="people-outline" slot="start"> </ion-icon>
          <ion-label>Clientes</ion-label>
        </ion-item>

        <ion-item routerLink="/app/sales" routerLinkActive="active">
          <ion-icon name="cart-outline" slot="start"> </ion-icon>
          <ion-label>Ventas</ion-label>
        </ion-item>

        <ion-item *ngIf="isAdmin" routerLink="/app/inventory" routerLinkActive="active">
          <ion-icon name="cube-outline" slot="start"> </ion-icon>
          <ion-label>Inventario</ion-label>
        </ion-item>

        <ion-item *ngIf="isAdmin" routerLink="/app/reports" routerLinkActive="active">
          <ion-icon name="bar-chart-outline" slot="start"> </ion-icon>
          <ion-label>Reportes</ion-label>
        </ion-item>

        <ion-item *ngIf="isAdmin" routerLink="/app/stats" routerLinkActive="active">
          <ion-icon name="stats-chart-outline" slot="start"> </ion-icon>
          <ion-label>Panel Estadístico</ion-label>
        </ion-item>
      </ion-list>

      <div class="user-info">
        <ion-avatar>
          <ion-icon name="person-circle-outline"></ion-icon>
        </ion-avatar>

        <ion-label>
          <h2>{{ user?.fullName }}</h2>
          <p>{{ user?.role }}</p>
        </ion-label>
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        height: 100%;
        background: #0f5b2d;
      }

      .sidebar-wrapper {
        height: 100%;
        display: flex;
        flex-direction: column;
        padding: 12px 0;
      }

      ion-list {
        flex: 1;
        background: transparent;
        padding: 0;
      }

      ion-item {
        --background: transparent;
        --background-hover: rgba(255, 255, 255, 0.1);
        --color: white;
        --padding-start: 18px;
        --border-color: rgba(255, 255, 255, 0.08);
        --min-height: 52px;
      }

      ion-item.active {
        --background: rgba(255, 255, 255, 0.15);
        font-weight: 600;
      }

      ion-icon {
        color: white;
      }

      .user-info {
        margin-top: auto;
        margin-bottom: 20px;
        margin-left: 16px;
        margin-right: 16px;

        display: flex;
        align-items: center;
        gap: 12px;

        padding: 12px;

        background: rgba(255, 255, 255, 0.12);
        border-radius: 12px;
      }

      .user-info ion-avatar {
        width: 48px;
        height: 48px;

        display: flex;
        align-items: center;
        justify-content: center;

        background: rgba(255, 255, 255, 0.15);
        border-radius: 50%;
      }

      .user-info ion-avatar ion-icon {
        font-size: 34px;
        color: white;
      }

      .user-info ion-label h2 {
        margin: 0;
        color: white;
        font-size: 14px;
        font-weight: 600;
      }

      .user-info ion-label p {
        margin: 0;
        color: rgba(255, 255, 255, 0.75);
        font-size: 12px;
        text-transform: uppercase;
      }
    `,
  ],
})
export class SidebarComponent {
  private auth = inject(AuthSessionService);

  user = this.auth.getCurrentUser();

  isAdmin = this.user?.role === 'ADMIN';

  constructor() {
    addIcons({
      homeOutline,
      peopleOutline,
      cartOutline,
      cubeOutline,
      barChartOutline,
      statsChartOutline,
      personCircleOutline,
    });
  }
}
