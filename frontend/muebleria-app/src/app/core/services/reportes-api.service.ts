import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../../shared/interfaces/api-response.interface';

export interface ResumenReporte {
  ventasTotales: number;
  subtotalTotal: number;
  igvTotal: number;
  descuentoTotal: number;
  totalOrdenes: number;
  ticketPromedio: number;
  clientesAtendidos: number;
  topProductos: TopProducto[];
}

export interface TopProducto {
  productId: number;
  nombre: string;
  imagen: string | null;
  cantidadVendida: number;
  totalVendido: number;
}

export interface VentaPorDia {
  date: string;
  total: number;
}

@Injectable({ providedIn: 'root' })
export class ReportesApiService {
  private baseUrl = `${environment.apiUrl}/reportes`;

  constructor(private http: HttpClient) {}

  obtenerResumen(from?: string, to?: string): Observable<ResumenReporte> {
    let params = new HttpParams();
    if (from) params = params.set('from', from);
    if (to) params = params.set('to', to);
    return this.http
      .get<ApiResponse<ResumenReporte>>(`${this.baseUrl}/resumen`, { params })
      .pipe(map((res) => res.data));
  }

  obtenerVentasPorDia(from?: string, to?: string): Observable<VentaPorDia[]> {
    let params = new HttpParams();
    if (from) params = params.set('from', from);
    if (to) params = params.set('to', to);
    return this.http
      .get<ApiResponse<VentaPorDia[]>>(`${this.baseUrl}/ventas-por-dia`, { params })
      .pipe(map((res) => res.data));
  }

  exportarReporte(payload: any): Observable<any> {
    return this.http
      .post<ApiResponse<any>>(`${this.baseUrl}/exportar`, payload)
      .pipe(map((res) => res.data));
  }
}
