// src/app/core/services/productos-api.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../../shared/interfaces/api-response.interface';

export interface Producto {
  id: number;
  name: string;
  description?: string;
  price: number;
  stock: number;
  imageUrl?: string;
  isActive: boolean;
  categoryId?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductoRequest {
  name: string;
  description?: string;
  price: number;
  stock: number;
  imageUrl?: string;
  isActive?: boolean;
  categoryId?: number;
}

export interface UpdateProductoRequest {
  name?: string;
  description?: string;
  price?: number;
  stock?: number;
  imageUrl?: string;
  isActive?: boolean;
  categoryId?: number;
}

@Injectable({ providedIn: 'root' })
export class ProductosApiService {
  private baseUrl = `${environment.apiUrl}/productos`;

  constructor(private http: HttpClient) {}

  /**
   * Listar productos con filtros opcionales
   */
  listar(search?: string, estado?: 'active' | 'inactive'): Observable<Producto[]> {
    let params = new HttpParams();
    if (search) params = params.set('search', search);
    if (estado) params = params.set('estado', estado);
    return this.http
      .get<ApiResponse<Producto[]>>(this.baseUrl, { params })
      .pipe(map((res) => res.data));
  }

  /**
   * Obtener un producto por ID
   */
  obtener(id: number): Observable<Producto> {
    return this.http
      .get<ApiResponse<Producto>>(`${this.baseUrl}/${id}`)
      .pipe(map((res) => res.data));
  }

  /**
   * Crear un nuevo producto
   */
  crear(payload: CreateProductoRequest): Observable<Producto> {
    return this.http
      .post<ApiResponse<Producto>>(this.baseUrl, payload)
      .pipe(map((res) => res.data));
  }

  /**
   * Actualizar un producto existente
   */
  actualizar(id: number, payload: UpdateProductoRequest): Observable<Producto> {
    return this.http
      .put<ApiResponse<Producto>>(`${this.baseUrl}/${id}`, payload)
      .pipe(map((res) => res.data));
  }

  /**
   * Cambiar estado de un producto (activar/desactivar)
   */
  cambiarEstado(id: number, isActive: boolean): Observable<Producto> {
    return this.http
      .patch<ApiResponse<Producto>>(`${this.baseUrl}/${id}/status`, { isActive })
      .pipe(map((res) => res.data));
  }

  /**
   * Eliminar un producto (físicamente)
   */
  eliminar(id: number): Observable<void> {
    return this.http
      .delete<ApiResponse<void>>(`${this.baseUrl}/${id}`)
      .pipe(map((res) => res.data));
  }
}
