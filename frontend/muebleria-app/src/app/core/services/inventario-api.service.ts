// src/app/core/services/inventario-api.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../../shared/interfaces/api-response.interface';

export interface ResumenInventario {
  totalProductos: number;
  productosSinStock: number;
  productosStockBajo: number;
  valorizacionTotal: number;
}

@Injectable({ providedIn: 'root' })
export class InventarioApiService {
  private baseUrl = `${environment.apiUrl}/inventario`;

  constructor(private http: HttpClient) {}

  obtenerResumen(): Observable<ResumenInventario> {
    return this.http
      .get<ApiResponse<ResumenInventario>>(`${this.baseUrl}/resumen`)
      .pipe(map((res) => res.data));
  }
}
