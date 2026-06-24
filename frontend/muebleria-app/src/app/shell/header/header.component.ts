import { Component, EventEmitter, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonHeader,
  IonToolbar,
  IonButton,
  IonIcon,
  IonAvatar,
  IonPopover,
  IonList,
  IonItem,
  IonContent,
  IonTitle,
  IonLabel,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { menuOutline, personOutline, logOutOutline, settingsOutline } from 'ionicons/icons';
import { Router } from '@angular/router';
import { AuthSessionService } from '../../core/services/auth-session.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonButton,
    IonIcon,
    IonAvatar,
    IonPopover,
    IonList,
    IonItem,
    IonContent,
    IonTitle,
    IonLabel,
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  @Output() menuClick = new EventEmitter<void>();
  private auth = inject(AuthSessionService);
  private router = inject(Router);
  user = this.auth.getCurrentUser();

  constructor() {
    addIcons({ menuOutline, personOutline, logOutOutline, settingsOutline });
  }

  logout() {
    this.auth.clearSession();
    this.router.navigate(['/auth/login']);
  }

  getInitials(): string {
    if (!this.user) return '?';
    const parts = this.user.fullName.split(' ');
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
}
