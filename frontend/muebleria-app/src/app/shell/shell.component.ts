import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { IonMenu, IonContent, MenuController } from '@ionic/angular/standalone';

import { HeaderComponent } from './header/header.component';
import { SidebarComponent } from './sidebar/sidebar.component';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [RouterOutlet, IonMenu, IonContent, HeaderComponent, SidebarComponent],
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.scss'],
})
export class ShellComponent {
  private menuCtrl = inject(MenuController);

  constructor() {
    console.log('✅ ShellComponent cargado');
  }

  openMenu(): void {
    this.menuCtrl.open('main-menu');
  }
}
