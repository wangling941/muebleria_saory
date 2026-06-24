import { Component, inject, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButton,
  IonIcon,
  IonButtons,
  IonBadge,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { menuOutline, logOutOutline, personOutline } from 'ionicons/icons';
import { AuthSessionService } from '../../core/services/auth-session.service';
import { PageTitleService } from '../../core/services/page-title.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButton,
    IonIcon,
    IonButtons,
    IonBadge,
  ],
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button (click)="menuClick.emit()">
            <ion-icon name="menu-outline"></ion-icon>
          </ion-button>
        </ion-buttons>
        <ion-title>{{ title }}</ion-title>
        <ion-buttons slot="end">
          <ion-badge
            color="light"
            style="margin-right: 8px; background: rgba(255,255,255,0.2); color: white; padding: 6px 12px;"
          >
            <ion-icon name="person-outline" style="margin-right: 4px;"></ion-icon>
            {{ user?.fullName }} ({{ user?.role }})
          </ion-badge>
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
      ion-title {
        font-weight: 700;
        font-size: 1.2rem;
      }
      ion-badge {
        display: inline-flex;
        align-items: center;
        font-weight: 500;
        border-radius: 20px;
      }
    `,
  ],
})
export class HeaderComponent implements OnInit {
  @Output() menuClick = new EventEmitter<void>();
  private auth = inject(AuthSessionService);
  private router = inject(Router);
  private pageTitleService = inject(PageTitleService);

  title = 'Panel de Control';
  user = this.auth.getCurrentUser();

  constructor() {
    addIcons({ menuOutline, logOutOutline, personOutline });
  }

  ngOnInit() {
    this.pageTitleService.title$.subscribe((title) => {
      this.title = title;
    });
  }

  logout() {
    this.auth.clearSession();
    this.router.navigate(['/auth/login']);
  }
}
