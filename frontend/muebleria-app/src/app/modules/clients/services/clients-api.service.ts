import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../../shared/interfaces/api-response.interface';
import { Client } from '../interfaces/client.interface';

@Injectable({ providedIn: 'root' })
export class ClientsApiService {
  private baseUrl = `${environment.apiUrl}/clientes`;

  constructor(private http: HttpClient) {}

  list(search: string = ''): Observable<ApiResponse<Client[]>> {
    const params = search ? `?search=${encodeURIComponent(search)}` : '';
    return this.http.get<ApiResponse<Client[]>>(`${this.baseUrl}${params}`);
  }

  create(data: Partial<Client>): Observable<ApiResponse<Client>> {
    return this.http.post<ApiResponse<Client>>(this.baseUrl, data);
  }

  update(id: number, data: Partial<Client>): Observable<ApiResponse<Client>> {
    return this.http.put<ApiResponse<Client>>(`${this.baseUrl}/${id}`, data);
  }

  delete(id: number): Observable<ApiResponse<Client>> {
    return this.http.delete<ApiResponse<Client>>(`${this.baseUrl}/${id}`);
  }
}
