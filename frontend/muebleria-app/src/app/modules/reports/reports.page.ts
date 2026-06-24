import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonContent } from '@ionic/angular/standalone';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, IonContent],
  template: `<ion-content
    ><h2>Reportes</h2>
    <p>Módulo de reportes (placeholder)</p></ion-content
  >`,
})
export class ReportsPage {}
