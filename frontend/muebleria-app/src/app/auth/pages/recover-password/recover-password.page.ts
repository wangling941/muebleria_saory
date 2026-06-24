import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonContent,
  IonCard,
  IonCardContent,
  IonInput,
  IonItem,
  IonButton,
  IonIcon,
  IonSpinner,
  IonAlert,
} from '@ionic/angular/standalone';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { addIcons } from 'ionicons';
import { mailOutline, checkmarkCircleOutline, alertCircleOutline } from 'ionicons/icons';
import { AuthApiService } from '../../../core/services/auth-api.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-recover-password',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    IonContent,
    IonCard,
    IonCardContent,
    IonInput,
    IonItem,
    IonButton,
    IonIcon,
    IonSpinner,
    IonAlert,
  ],
  template: `
    <ion-content class="recover-content">
      <div class="recover-background">
        <div class="overlay"></div>
        <div class="recover-container">
          <ion-card class="recover-card">
            <ion-card-content>
              <h2>🔐 Recuperar contraseña</h2>
              <p class="subtitle">
                Ingresa tu correo electrónico y te enviaremos un enlace para restablecerla.
              </p>

              <!-- Formulario -->
              <form [formGroup]="form" (ngSubmit)="submit()" *ngIf="!success">
                <ion-item lines="none" class="form-item">
                  <ion-icon name="mail-outline" slot="start"></ion-icon>
                  <ion-input
                    formControlName="email"
                    type="email"
                    placeholder="correo@ejemplo.com"
                    [clearInput]="true"
                  ></ion-input>
                </ion-item>
                <div
                  class="error-msg"
                  *ngIf="form.get('email')?.touched && form.get('email')?.invalid"
                >
                  <ion-icon name="alert-circle-outline" slot="start"></ion-icon>
                  {{
                    form.get('email')?.hasError('required')
                      ? 'El correo es requerido'
                      : 'Ingresa un correo válido'
                  }}
                </div>

                <!-- Error general -->
                <div class="error-msg error-api" *ngIf="error">
                  <ion-icon name="alert-circle-outline" slot="start"></ion-icon>
                  {{ error }}
                </div>

                <ion-button
                  expand="block"
                  type="submit"
                  class="recover-btn"
                  [disabled]="form.invalid || loading"
                >
                  <ion-spinner *ngIf="loading" name="crescent" slot="start"></ion-spinner>
                  {{ loading ? 'Enviando...' : 'Enviar enlace' }}
                </ion-button>
              </form>

              <!-- Mensaje de éxito -->
              <div class="success-message" *ngIf="success">
                <ion-icon name="checkmark-circle-outline" class="success-icon"></ion-icon>
                <h3>¡Correo enviado!</h3>
                <p>
                  Hemos enviado un enlace de recuperación a <strong>{{ emailSent }}</strong
                  >. Revisa tu bandeja de entrada y sigue las instrucciones.
                </p>
                <ion-button expand="block" fill="outline" routerLink="/auth/login" class="back-btn">
                  Volver al inicio de sesión
                </ion-button>
              </div>

              <div class="back-link" *ngIf="!success">
                <a routerLink="/auth/login">← Volver al inicio de sesión</a>
              </div>
            </ion-card-content>
          </ion-card>
        </div>
      </div>
    </ion-content>
  `,
  styles: [
    `
      .recover-content {
        --background: transparent;
        height: 100vh;
      }
      .recover-background {
        position: relative;
        width: 100%;
        height: 100%;
        background: linear-gradient(135deg, #06401f, #0a5c2e);
        display: flex;
        align-items: center;
        justify-content: center;
        .overlay {
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.2);
        }
      }
      .recover-container {
        position: relative;
        z-index: 2;
        max-width: 420px;
        width: 100%;
        padding: 20px;
      }
      .recover-card {
        border-radius: 24px;
        background: rgba(255, 255, 255, 0.95);
        backdrop-filter: blur(10px);
        box-shadow: 0 30px 60px rgba(0, 0, 0, 0.3);
        ion-card-content {
          padding: 28px 24px;
          h2 {
            margin: 0 0 8px;
            color: #0a5c2e;
            font-weight: 700;
          }
          .subtitle {
            color: #475569;
            margin: 0 0 24px;
            font-size: 0.95rem;
          }
        }
      }
      .form-item {
        --background: #f1f5f9;
        --border-radius: 12px;
        --min-height: 52px;
        margin-bottom: 4px;
        ion-icon {
          color: #0a5c2e;
        }
      }
      .error-msg {
        font-size: 0.75rem;
        color: #dc2626;
        padding-left: 16px;
        margin-bottom: 12px;
        display: flex;
        align-items: center;
        gap: 4px;
        ion-icon {
          font-size: 16px;
        }
      }
      .error-api {
        text-align: center;
        background: rgba(220, 38, 38, 0.1);
        padding: 10px 12px;
        border-radius: 10px;
        margin: 8px 0 16px;
        justify-content: center;
      }
      .recover-btn {
        --background: #0a5c2e;
        --border-radius: 12px;
        --box-shadow: 0 4px 12px rgba(10, 92, 46, 0.3);
        height: 52px;
        font-weight: 700;
        margin-top: 8px;
      }
      .back-link {
        text-align: center;
        margin-top: 16px;
        a {
          color: #0a5c2e;
          text-decoration: none;
          font-size: 0.9rem;
          font-weight: 500;
          &:hover {
            text-decoration: underline;
          }
        }
      }
      .success-message {
        text-align: center;
        padding: 12px 0;
        .success-icon {
          font-size: 64px;
          color: #16a34a;
          margin-bottom: 12px;
        }
        h3 {
          color: #0a5c2e;
          font-size: 1.4rem;
          margin: 0 0 8px;
        }
        p {
          color: #475569;
          font-size: 0.95rem;
          line-height: 1.5;
          margin: 0 0 24px;
          strong {
            color: #0a5c2e;
          }
        }
        .back-btn {
          --border-color: #0a5c2e;
          --color: #0a5c2e;
          --border-radius: 12px;
          font-weight: 600;
        }
      }
    `,
  ],
})
export class RecoverPasswordPage {
  private fb = inject(FormBuilder);
  private authApi = inject(AuthApiService);
  private router = inject(Router);

  form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
  });

  loading = false;
  success = false;
  error = '';
  emailSent = '';

  constructor() {
    addIcons({ mailOutline, checkmarkCircleOutline, alertCircleOutline });
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
        next: (res) => {
          this.success = true;
          this.emailSent = email;
          console.log('Recuperación exitosa:', res.message);
        },
        error: (err) => {
          this.error = err.error?.message || 'Error al enviar el correo. Intenta nuevamente.';
          console.error('Error en recuperación:', err);
        },
      });
  }
}
