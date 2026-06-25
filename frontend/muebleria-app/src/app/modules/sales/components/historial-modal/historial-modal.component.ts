import { Component, Input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ModalController,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButton,
  IonIcon,
  IonContent,
  IonBadge,
  IonGrid,
  IonRow,
  IonCol,
} from '@ionic/angular/standalone';
import {
  closeOutline,
  calendarOutline,
  cashOutline,
  personOutline,
  pricetagOutline,
} from 'ionicons/icons';
import { addIcons } from 'ionicons';

export interface HistorialVenta {
  code: string;
  customerName: string;
  total: number;
  createdAt: string;
}

@Component({
  selector: 'app-historial-modal',
  standalone: true,
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButton,
    IonIcon,
    IonContent,
    IonBadge,
    IonGrid,
    IonRow,
    IonCol,
  ],
  templateUrl: './historial-modal.component.html',
  styleUrls: ['./historial-modal.component.scss'],
})
export class HistorialModalComponent {
  @Input() ventas: HistorialVenta[] = [];

  totalMonto = computed(() => {
    return this.ventas.reduce((sum, v) => sum + v.total, 0);
  });

  constructor(private modalController: ModalController) {
    addIcons({ closeOutline, calendarOutline, cashOutline, personOutline, pricetagOutline });
  }

  close() {
    this.modalController.dismiss();
  }
}
