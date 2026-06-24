import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { IonList, IonItem, IonIcon, IonLabel } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  homeOutline,
  peopleOutline,
  cubeOutline,
  cartOutline,
  barChartOutline,
  gridOutline,
  documentTextOutline,
} from 'ionicons/icons';
import { AuthSessionService } from '../../core/services/auth-session.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, IonList, IonItem, IonIcon, IonLabel],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
  private auth = inject(AuthSessionService);
  user = this.auth.getCurrentUser();
  isAdmin = this.user?.role === 'ADMIN';

  constructor() {
    addIcons({
      homeOutline,
      peopleOutline,
      cubeOutline,
      cartOutline,
      barChartOutline,
      gridOutline,
      documentTextOutline,
    });
  }
}
