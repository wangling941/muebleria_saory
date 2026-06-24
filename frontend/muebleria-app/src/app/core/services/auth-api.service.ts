import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../../shared/interfaces/api-response.interface';
import { LoginRequest, LoginData, AuthUser } from '../../auth/interfaces/auth.interface';

@Injectable({ providedIn: 'root' })
export class AuthApiService {
  private baseUrl = `${environment.apiUrl}/auth`;

  constructor(private http: HttpClient) {}

  login(payload: LoginRequest): Observable<LoginData> {
    return this.http
      .post<ApiResponse<LoginData>>(`${this.baseUrl}/login`, payload)
      .pipe(map((res) => res.data));
  }

  me(): Observable<AuthUser> {
    return this.http.get<ApiResponse<AuthUser>>(`${this.baseUrl}/me`).pipe(map((res) => res.data));
  }

  recoverPassword(email: string): Observable<{ message: string }> {
    return this.http
      .post<ApiResponse<{ message: string }>>(`${this.baseUrl}/recover`, { email })
      .pipe(map((res) => res.data));
  }

  // 👇 NUEVO
  register(payload: any): Observable<AuthUser> {
    return this.http
      .post<ApiResponse<AuthUser>>(`${this.baseUrl}/register`, payload)
      .pipe(map((res) => res.data));
  }

  // 👇 NUEVO
  resetPassword(token: string, newPassword: string): Observable<{ message: string }> {
    return this.http
      .post<
        ApiResponse<{ message: string }>
      >(`${this.baseUrl}/reset-password`, { token, newPassword })
      .pipe(map((res) => res.data));
  }
}
