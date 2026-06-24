import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AuthUser, LoginData } from '../../auth/interfaces/auth.interface';

@Injectable({ providedIn: 'root' })
export class AuthSessionService {
  private readonly TOKEN_KEY = 'muebleria_token';
  private readonly USER_KEY = 'muebleria_user';
  private currentUserSubject = new BehaviorSubject<AuthUser | null>(this.getStoredUser());
  currentUser$ = this.currentUserSubject.asObservable();

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  getCurrentUser(): AuthUser | null {
    return this.currentUserSubject.value;
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  saveSession(data: LoginData): void {
    localStorage.setItem(this.TOKEN_KEY, data.accessToken);
    localStorage.setItem(this.USER_KEY, JSON.stringify(data.user));
    this.currentUserSubject.next(data.user);
  }

  updateUser(user: AuthUser): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  clearSession(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.currentUserSubject.next(null);
  }

  private getStoredUser(): AuthUser | null {
    const raw = localStorage.getItem(this.USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }
}
