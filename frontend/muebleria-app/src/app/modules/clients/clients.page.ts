import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonContent } from '@ionic/angular/standalone';

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [CommonModule, IonContent],
  template: `<ion-content
    ><h2>Clientes</h2>
    <p>Módulo de clientes (placeholder)</p></ion-content
  >`,
})
export class ClientsPage {}
