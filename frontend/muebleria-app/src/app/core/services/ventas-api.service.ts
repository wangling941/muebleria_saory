// src/app/core/services/ventas-api.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../../shared/interfaces/api-response.interface';

export interface VentaItemRequest {
  productId: number;
  cantidad: number;
}

export interface CreateVentaRequest {
  customerId: number;
  items: VentaItemRequest[];
  paymentMethod: 'CASH' | 'CARD' | 'TRANSFER';
  discount: number;
}

export interface VentaItemResponse {
  id: number;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  product: {
    id: number;
    name: string;
    price: number;
    stock: number;
  };
}

export interface VentaResponse {
  id: number;
  code: string;
  subtotal: number;
  igv: number;
  total: number;
  discount: number;
  paymentMethod: string;
  createdAt: string;
  customer: {
    id: number;
    name: string;
    dni: string;
    phone?: string;
    address?: string;
  };
  seller: {
    id: number;
    fullName: string;
    username: string;
  };
  items: VentaItemResponse[];
}

@Injectable({ providedIn: 'root' })
export class VentasApiService {
  private baseUrl = `${environment.apiUrl}/ventas`;

  constructor(private http: HttpClient) {}

  listar(): Observable<VentaResponse[]> {
    return this.http.get<ApiResponse<VentaResponse[]>>(this.baseUrl).pipe(map((res) => res.data));
  }

  obtener(id: number): Observable<VentaResponse> {
    return this.http
      .get<ApiResponse<VentaResponse>>(`${this.baseUrl}/${id}`)
      .pipe(map((res) => res.data));
  }

  crear(payload: CreateVentaRequest): Observable<VentaResponse> {
    return this.http
      .post<ApiResponse<VentaResponse>>(this.baseUrl, payload)
      .pipe(map((res) => res.data));
  }
}
