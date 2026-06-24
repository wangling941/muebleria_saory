import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonContent } from '@ionic/angular/standalone';

@Component({
  selector: 'app-statistics',
  standalone: true,
  imports: [CommonModule, IonContent],
  templateUrl: './statistics.page.html',
  styleUrls: ['./statistics.page.scss'],
})
export class StatisticsPage {
  totalRevenue = 87500.75;
  totalStock = 150;
  activeClients = 45;
  monthlySales = 28;

  starProduct = {
    name: 'Silla Metálica',
    stock: 10,
    sales: 25,
    imageUrl: '',
  };
}
