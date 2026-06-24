import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonContent } from '@ionic/angular/standalone';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [CommonModule, IonContent],
  template: `<ion-content
    ><h2>Inventario</h2>
    <p>Módulo de inventario (placeholder)</p></ion-content
  >`,
})
export class InventoryPage {}
