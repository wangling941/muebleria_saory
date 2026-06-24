import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { IonContent, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { personCircleOutline, shieldOutline, peopleOutline } from 'ionicons/icons';
import { AuthSessionService } from '../../../core/services/auth-session.service';

@Component({
  selector: 'app-role-select',
  standalone: true,
  templateUrl: './role-select.page.html',
  styleUrls: ['./role-select.page.scss'],
  imports: [CommonModule, IonContent, IonIcon],
})
export class RoleSelectPage {
  private auth = inject(AuthSessionService);
  private router = inject(Router);
  user = this.auth.getCurrentUser();

  constructor() {
    addIcons({ personCircleOutline, shieldOutline, peopleOutline });
    if (!this.user) this.router.navigate(['/auth/login']);
  }

  selectRole() {
    this.router.navigate(['/app/dashboard']);
  }
}
