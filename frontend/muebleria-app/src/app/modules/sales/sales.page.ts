import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonContent } from '@ionic/angular/standalone';

@Component({
  selector: 'app-sales',
  standalone: true,
  imports: [CommonModule, IonContent],
  template: `<ion-content
    ><h2>Ventas</h2>
    <p>Módulo de ventas (placeholder)</p></ion-content
  >`,
})
export class SalesPage {}
