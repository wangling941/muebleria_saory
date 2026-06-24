import { Component } from '@angular/core';
import { IonMenu, IonContent, IonRouterOutlet, MenuController } from '@ionic/angular/standalone';
import { HeaderComponent } from './header/header.component';
import { SidebarComponent } from './sidebar/sidebar.component';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [IonMenu, IonContent, IonRouterOutlet, HeaderComponent, SidebarComponent],
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.scss'],
})
export class ShellComponent {
  constructor(private menuCtrl: MenuController) {}
  openMenu() {
    this.menuCtrl.open('main-menu');
  }
}
