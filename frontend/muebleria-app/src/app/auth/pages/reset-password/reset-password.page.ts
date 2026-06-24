import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { IonContent, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  lockClosedOutline,
  eyeOutline,
  eyeOffOutline,
  alertCircleOutline,
  checkmarkCircleOutline,
} from 'ionicons/icons';
import { AuthApiService } from '../../../core/services/auth-api.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss'],
  imports: [CommonModule, ReactiveFormsModule, RouterLink, IonContent, IonIcon],
})
export class ResetPasswordPage implements OnInit {
  private fb = inject(FormBuilder);
  private authApi = inject(AuthApiService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  form = this.fb.nonNullable.group({
    newPassword: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required]],
  });

  token: string = '';
  loading = false;
  showPassword = false;
  error = '';
  success = false;

  constructor() {
    addIcons({
      lockClosedOutline,
      eyeOutline,
      eyeOffOutline,
      alertCircleOutline,
      checkmarkCircleOutline,
    });
  }

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.token = params['token'] || '';
      if (!this.token) {
        this.error = 'Token inválido o expirado';
      }
    });
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  submit() {
    if (this.form.invalid || this.loading || !this.token) return;
    if (this.form.value.newPassword !== this.form.value.confirmPassword) {
      this.error = 'Las contraseñas no coinciden';
      return;
    }

    this.loading = true;
    this.error = '';
    this.success = false;

    this.authApi
      .resetPassword(this.token, this.form.value.newPassword!)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: () => {
          this.success = true;
          setTimeout(() => {
            this.router.navigate(['/auth/login']);
          }, 2000);
        },
        error: (err) => {
          this.error = err.error?.message || 'Error al restablecer la contraseña';
        },
      });
  }

  // ✅ NUEVO MÉTODO PÚBLICO
  goToLogin() {
    this.router.navigate(['/auth/login']);
  }
}
