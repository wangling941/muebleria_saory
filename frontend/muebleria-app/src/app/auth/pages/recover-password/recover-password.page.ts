import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { IonContent, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { mailOutline, alertCircleOutline, checkmarkCircleOutline } from 'ionicons/icons';
import { AuthApiService } from '../../../core/services/auth-api.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-recover-password',
  standalone: true,
  templateUrl: './recover-password.page.html',
  styleUrls: ['./recover-password.page.scss'],
  imports: [CommonModule, ReactiveFormsModule, RouterLink, IonContent, IonIcon],
})
export class RecoverPasswordPage {
  private fb = inject(FormBuilder);
  private authApi = inject(AuthApiService);

  form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
  });

  loading = false;
  success = false;
  error = '';
  emailSent = '';

  constructor() {
    addIcons({ mailOutline, alertCircleOutline, checkmarkCircleOutline });
  }

  submit() {
    if (this.form.invalid || this.loading) return;
    this.loading = true;
    this.error = '';
    const email = this.form.value.email!;

    this.authApi
      .recoverPassword(email)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: () => {
          this.success = true;
          this.emailSent = email;
        },
        error: (err) => {
          this.error = err.error?.message || 'Error al enviar el correo. Intenta nuevamente.';
        },
      });
  }
}
