import { Component, inject, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButton,
  IonIcon,
  IonButtons,
  IonBadge,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { menuOutline, logOutOutline, personOutline } from 'ionicons/icons';
import { AuthSessionService } from '../../core/services/auth-session.service';
import { PageTitleService } from '../../core/services/page-title.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButton,
    IonIcon,
    IonButtons,
    IonBadge,
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  @Output() menuClick = new EventEmitter<void>();

  private auth = inject(AuthSessionService);
  private router = inject(Router);
  private pageTitleService = inject(PageTitleService);

  title = 'Panel de Control';
  user = this.auth.getCurrentUser();

  constructor() {
    addIcons({
      menuOutline,
      logOutOutline,
      personOutline,
    });
  }

  ngOnInit(): void {
    this.pageTitleService.title$.subscribe((title) => {
      this.title = title;
    });
  }

  logout(): void {
    this.auth.clearSession();
    this.router.navigate(['/auth/login']);
  }
}
