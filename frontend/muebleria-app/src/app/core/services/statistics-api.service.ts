// src/app/core/services/statistics-api.service.ts
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import {
  ReportesApiService,
  ResumenReporte,
  VentaPorDia,
  TopProducto,
} from './reportes-api.service';
import { ProductosApiService, Producto } from './productos-api.service';
import { ClientesApiService, Cliente } from './clientes-api.service';
import { InventarioApiService } from './inventario-api.service';

export interface StatisticsData {
  totalRevenue: number;
  totalStock: number;
  activeClients: number;
  monthlySales: number;
  starProduct: {
    id: number;
    name: string;
    stock: number;
    sales: number;
    imageUrl: string | null;
  } | null;
  ventasPorDia: VentaPorDia[];
  topProductos: TopProducto[];
  resumen: ResumenReporte;
}

@Injectable({ providedIn: 'root' })
export class StatisticsApiService {
  private reportesApi = inject(ReportesApiService);
  private productosApi = inject(ProductosApiService);
  private clientesApi = inject(ClientesApiService);
  private inventarioApi = inject(InventarioApiService);

  async getStatistics(from?: string, to?: string): Promise<StatisticsData> {
    // Por defecto, tomamos el mes actual
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    const fromStr = from || firstDay.toISOString().split('T')[0];
    const toStr = to || lastDay.toISOString().split('T')[0];

    // Llamadas paralelas
    const [resumen, ventasPorDia, productos, clientes] = await Promise.all([
      firstValueFrom(this.reportesApi.obtenerResumen(fromStr, toStr)),
      firstValueFrom(this.reportesApi.obtenerVentasPorDia(fromStr, toStr)),
      firstValueFrom(this.productosApi.listar()),
      firstValueFrom(this.clientesApi.listar()),
    ]);

    // Calcular stock total
    const totalStock = productos.reduce((acc, p) => acc + p.stock, 0);

    // Ventas del mes (número de órdenes)
    const monthlySales = resumen.totalOrdenes;

    // Producto estrella (el más vendido)
    let starProduct = null;
    if (resumen.topProductos && resumen.topProductos.length > 0) {
      const top = resumen.topProductos[0];
      const product = productos.find((p) => p.id === top.productId);
      if (product) {
        starProduct = {
          id: product.id,
          name: product.name,
          stock: product.stock,
          sales: top.cantidadVendida,
          imageUrl: product.imageUrl || null,
        };
      }
    }

    return {
      totalRevenue: resumen.ventasTotales,
      totalStock,
      activeClients: clientes.length,
      monthlySales,
      starProduct,
      ventasPorDia,
      topProductos: resumen.topProductos,
      resumen,
    };
  }
}
