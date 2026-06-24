import { Component, inject, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonContent, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  cashOutline,
  cubeOutline,
  peopleOutline,
  receiptOutline,
  starOutline,
} from 'ionicons/icons';
import { AuthSessionService } from '../../core/services/auth-session.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  encapsulation: ViewEncapsulation.None,
  imports: [CommonModule, IonContent, IonIcon],
})
export class DashboardPage {
  private auth = inject(AuthSessionService);
  user = this.auth.getCurrentUser();

  constructor() {
    addIcons({ cashOutline, cubeOutline, peopleOutline, receiptOutline, starOutline });
  }
}
