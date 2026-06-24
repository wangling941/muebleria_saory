import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonContent } from '@ionic/angular/standalone';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, IonContent],
  template: `<ion-content
    ><h2>Productos</h2>
    <p>Módulo de productos (placeholder)</p></ion-content
  >`,
})
export class ProductsPage {}
