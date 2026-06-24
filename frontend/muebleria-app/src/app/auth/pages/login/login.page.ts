import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { IonContent, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  personOutline,
  lockClosedOutline,
  eyeOutline,
  eyeOffOutline,
  alertCircleOutline,
} from 'ionicons/icons';
import { AuthApiService } from '../../../core/services/auth-api.service';
import { AuthSessionService } from '../../../core/services/auth-session.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  imports: [CommonModule, ReactiveFormsModule, RouterLink, IonContent, IonIcon],
})
export class LoginPage {
  private fb = inject(FormBuilder);
  private authApi = inject(AuthApiService);
  private authSession = inject(AuthSessionService);
  private router = inject(Router);

  form = this.fb.nonNullable.group({
    identifier: ['', [Validators.required, Validators.minLength(3)]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    remember: [false],
  });

  loading = false;
  showPassword = false;
  error = '';

  constructor() {
    addIcons({ personOutline, lockClosedOutline, eyeOutline, eyeOffOutline, alertCircleOutline });
    if (this.authSession.isAuthenticated()) {
      this.router.navigate(['/auth/role-select']);
    }
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  submit() {
    if (this.form.invalid || this.loading) return;
    this.loading = true;
    this.error = '';
    const { identifier, password } = this.form.getRawValue();
    this.authApi
      .login({ identifier, password })
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (data) => {
          this.authSession.saveSession(data);
          this.router.navigate(['/auth/role-select'], { replaceUrl: true });
        },
        error: (err) => {
          this.error = err.error?.message || 'Error al iniciar sesión';
        },
      });
  }
}
