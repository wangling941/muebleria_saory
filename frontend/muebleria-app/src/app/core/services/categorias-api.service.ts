import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../../shared/interfaces/api-response.interface';

export interface Categoria {
  id: number;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

@Injectable({ providedIn: 'root' })
export class CategoriasApiService {
  private baseUrl = `${environment.apiUrl}/categorias`;

  constructor(private http: HttpClient) {}

  listar(): Observable<Categoria[]> {
    return this.http.get<ApiResponse<Categoria[]>>(this.baseUrl).pipe(map((res) => res.data));
  }

  crear(payload: { name: string; description?: string }): Observable<Categoria> {
    return this.http
      .post<ApiResponse<Categoria>>(this.baseUrl, payload)
      .pipe(map((res) => res.data));
  }

  actualizar(id: number, payload: { name?: string; description?: string }): Observable<Categoria> {
    return this.http
      .put<ApiResponse<Categoria>>(`${this.baseUrl}/${id}`, payload)
      .pipe(map((res) => res.data));
  }

  eliminar(id: number): Observable<void> {
    return this.http
      .delete<ApiResponse<void>>(`${this.baseUrl}/${id}`)
      .pipe(map((res) => res.data));
  }
}
