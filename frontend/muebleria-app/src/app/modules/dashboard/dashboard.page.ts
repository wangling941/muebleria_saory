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
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  imports: [CommonModule, IonContent, IonIcon],
})
export class DashboardPage {
  private auth = inject(AuthSessionService);
  private router = inject(Router);

  user = this.auth.getCurrentUser();
  isAdmin = this.user?.role === 'ADMIN';

  constructor() {
    addIcons({ cartOutline, cubeOutline, barChartOutline, peopleOutline, statsChartOutline });
  }

  goTo(path: string) {
    this.router.navigate([path]);
  }
}
