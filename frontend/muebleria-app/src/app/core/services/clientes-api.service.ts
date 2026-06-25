import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../../shared/interfaces/api-response.interface';

export interface Cliente {
  id: number;
  name: string;
  dni: string;
  phone?: string;
  address?: string;
}

@Injectable({ providedIn: 'root' })
export class ClientesApiService {
  private baseUrl = `${environment.apiUrl}/clientes`;

  constructor(private http: HttpClient) {}

  listar(): Observable<Cliente[]> {
    return this.http.get<ApiResponse<Cliente[]>>(this.baseUrl).pipe(map((res) => res.data));
  }

  crear(payload: {
    name: string;
    dni: string;
    phone?: string;
    address?: string;
  }): Observable<Cliente> {
    return this.http.post<ApiResponse<Cliente>>(this.baseUrl, payload).pipe(map((res) => res.data));
  }
}
