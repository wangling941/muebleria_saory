import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { IonContent, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  cartOutline,
  cubeOutline,
  barChartOutline,
  peopleOutline,
  statsChartOutline,
} from 'ionicons/icons';
import { AuthSessionService } from '../../core/services/auth-session.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, IonContent, IonIcon],
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage {
  private router = inject(Router);
  private auth = inject(AuthSessionService);
  user = this.auth.getCurrentUser();
  isAdmin = this.user?.role === 'ADMIN';

  constructor() {
    addIcons({ cartOutline, cubeOutline, barChartOutline, peopleOutline, statsChartOutline });
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
  }
}
