import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {
  IonList,
  IonItem,
  IonLabel,
  IonIcon,
  IonMenuToggle,
  IonAvatar,
} from '@ionic/angular/standalone';
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

interface MenuItem {
  label: string;
  icon: string;
  route: string;
  roles: string[];
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    IonList,
    IonItem,
    IonLabel,
    IonIcon,
    IonMenuToggle,
    IonAvatar,
  ],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
  private auth = inject(AuthSessionService);
  user = this.auth.getCurrentUser();

  menuItems: MenuItem[] = [
    {
      label: 'Dashboard',
      icon: 'home-outline',
      route: '/app/dashboard',
      roles: ['ADMIN', 'SELLER'],
    },
    {
      label: 'Clientes',
      icon: 'people-outline',
      route: '/app/clients',
      roles: ['ADMIN', 'SELLER'],
    },
    { label: 'Ventas', icon: 'cart-outline', route: '/app/sales', roles: ['ADMIN', 'SELLER'] },
    { label: 'Inventario', icon: 'cube-outline', route: '/app/inventory', roles: ['ADMIN'] },
    { label: 'Reportes', icon: 'bar-chart-outline', route: '/app/reports', roles: ['ADMIN'] },
    {
      label: 'Estadísticas',
      icon: 'stats-chart-outline',
      route: '/app/statistics',
      roles: ['ADMIN'],
    },
  ];

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

  get visibleMenuItems() {
    if (!this.user) return [];
    return this.menuItems.filter((item) => item.roles.includes(this.user!.role));
  }
}
