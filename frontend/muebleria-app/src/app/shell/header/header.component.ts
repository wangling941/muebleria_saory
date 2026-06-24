import { Component, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonMenuButton,
  IonButton,
  IonIcon,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { logOutOutline, menuOutline } from 'ionicons/icons';
import { Router } from '@angular/router';
import { AuthSessionService } from '../../core/services/auth-session.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonMenuButton,
    IonButton,
    IonIcon,
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  @Output() menuClick = new EventEmitter<void>();
  private auth = inject(AuthSessionService);
  private router = inject(Router);

  constructor() {
    addIcons({ logOutOutline, menuOutline });
  }

  logout() {
    this.auth.clearSession();
    this.router.navigate(['/auth/login']);
  }

  openMenu() {
    this.menuClick.emit();
  }
}
