import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonContent,
  IonCard,
  IonCardContent,
  IonInput,
  IonItem,
  IonButton,
  IonIcon,
  IonSpinner,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { personOutline, lockClosedOutline, eyeOutline, eyeOffOutline } from 'ionicons/icons';
// ✅ Rutas corregidas
import { AuthApiService } from '../../../core/services/auth-api.service';
import { AuthSessionService } from '../../../core/services/auth-session.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonContent,
    IonCard,
    IonCardContent,
    IonInput,
    IonItem,
    IonButton,
    IonIcon,
    IonSpinner,
  ],
})
export class LoginPage {
  private fb = inject(FormBuilder);
  private authApi = inject(AuthApiService);
  private authSession = inject(AuthSessionService);
  private router = inject(Router);

  form = this.fb.nonNullable.group({
    identifier: ['', [Validators.required, Validators.minLength(3)]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  loading = false;
  showPassword = false;
  error = '';

  constructor() {
    addIcons({ personOutline, lockClosedOutline, eyeOutline, eyeOffOutline });
    if (this.authSession.isAuthenticated()) {
      this.router.navigate(['/app/dashboard']);
    }
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  submit() {
    if (this.form.invalid || this.loading) return;
    this.loading = true;
    this.error = '';
    this.authApi
      .login(this.form.getRawValue())
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (data) => {
          this.authSession.saveSession(data);
          this.router.navigate(['/app/dashboard']);
        },
        error: (err) => {
          this.error = err.error?.message || 'Error al iniciar sesión';
        },
      });
  }
}
