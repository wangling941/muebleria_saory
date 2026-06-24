// header.component.ts
import { Component, inject, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButton,
  IonIcon,
  IonButtons,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { menuOutline, logOutOutline } from 'ionicons/icons';
import { AuthSessionService } from '../../core/services/auth-session.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, IonHeader, IonToolbar, IonTitle, IonButton, IonIcon, IonButtons],
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button (click)="menuClick.emit()">
            <ion-icon name="menu-outline"></ion-icon>
          </ion-button>
        </ion-buttons>
        <ion-title>Mueblería IGEN</ion-title>
        <ion-buttons slot="end">
          <ion-button (click)="logout()">
            <ion-icon name="log-out-outline"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
  `,
  styles: [
    `
      ion-header ion-toolbar {
        --background: #0a5c2e;
        --color: white;
      }
    `,
  ],
})
export class HeaderComponent {
  @Output() menuClick = new EventEmitter<void>();
  private auth = inject(AuthSessionService);
  private router = inject(Router);

  constructor() {
    addIcons({ menuOutline, logOutOutline });
  }

  logout() {
    this.auth.clearSession();
    this.router.navigate(['/auth/login']);
  }
}
