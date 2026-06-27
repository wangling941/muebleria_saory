import {
  Component,
  OnInit,
  OnDestroy,
  signal,
  inject,
  ViewChild,
  ElementRef,
  AfterViewInit,
  ChangeDetectorRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonIcon,
  IonSpinner,
  IonButton,
  ToastController,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  cashOutline,
  cubeOutline,
  peopleOutline,
  calendarOutline,
  starOutline,
  trendingUpOutline,
  pieChartOutline,
  refreshOutline,
} from 'ionicons/icons';
import { StatisticsApiService, StatisticsData } from '../../core/services/statistics-api.service';
import { TopProducto } from '../../core/services/reportes-api.service';
import { Chart, registerables } from 'chart.js';

// Registrar todos los componentes de Chart.js
Chart.register(...registerables);

@Component({
  selector: 'app-statistics',
  standalone: true,
  imports: [CommonModule, FormsModule, IonContent, IonIcon, IonSpinner, IonButton],
  templateUrl: './statistics.page.html',
  styleUrls: ['./statistics.page.scss'],
})
export class StatisticsPage implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('salesChart') salesChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('revenueChart') revenueChartRef!: ElementRef<HTMLCanvasElement>;

  data = signal<StatisticsData | null>(null);
  isLoading = signal(false);
  private refreshInterval: any;
  private salesChartInstance: Chart | null = null;
  private revenueChartInstance: Chart | null = null;

  private statsApi = inject(StatisticsApiService);
  private toastCtrl = inject(ToastController);
  private cdr = inject(ChangeDetectorRef);

  constructor() {
    addIcons({
      cashOutline,
      cubeOutline,
      peopleOutline,
      calendarOutline,
      starOutline,
      trendingUpOutline,
      pieChartOutline,
      refreshOutline,
    });
  }

  ngOnInit() {
    this.cargarEstadisticas();
    // Actualizar cada 30 segundos
    this.refreshInterval = setInterval(() => {
      this.cargarEstadisticas();
    }, 30000);
  }

  ngOnDestroy() {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }
    // Destruir gráficos para liberar memoria
    if (this.salesChartInstance) {
      this.salesChartInstance.destroy();
      this.salesChartInstance = null;
    }
    if (this.revenueChartInstance) {
      this.revenueChartInstance.destroy();
      this.revenueChartInstance = null;
    }
  }

  ngAfterViewInit() {
    // Los gráficos se renderizan después de cargar datos
  }

  async cargarEstadisticas() {
    this.isLoading.set(true);
    try {
      const stats = await this.statsApi.getStatistics();
      this.data.set(stats);
      this.cdr.detectChanges();
      // Pequeño delay para asegurar que el DOM esté listo
      setTimeout(() => {
        this.renderCharts(stats);
      }, 200);
    } catch (error) {
      console.error(error);
      this.mostrarError('Error al cargar estadísticas');
    } finally {
      this.isLoading.set(false);
    }
  }

  private renderCharts(stats: StatisticsData) {
    this.renderSalesChart(stats);
    this.renderRevenueChart(stats);
  }

  // ========== GRÁFICO DE BARRAS: EVOLUCIÓN DE INGRESOS ==========
  private renderSalesChart(stats: StatisticsData) {
    if (!this.salesChartRef || !stats.ventasPorDia.length) return;

    if (this.salesChartInstance) {
      this.salesChartInstance.destroy();
      this.salesChartInstance = null;
    }

    const labels = stats.ventasPorDia.map((item) => {
      const d = new Date(item.date);
      return d.toLocaleDateString('es', { day: '2-digit', month: 'short' });
    });
    const data = stats.ventasPorDia.map((item) => item.total);

    this.salesChartInstance = new Chart(this.salesChartRef.nativeElement, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Ingresos diarios (S/)',
            data: data,
            backgroundColor: 'rgba(10, 92, 46, 0.6)',
            borderColor: 'rgba(10, 92, 46, 1)',
            borderWidth: 1,
            borderRadius: 4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const value = context.parsed.y;
                return `S/ ${typeof value === 'number' ? value.toFixed(2) : '0.00'}`;
              },
            },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: (value) => `S/ ${value}`,
            },
          },
        },
      },
    });
  }

  // ========== GRÁFICO CIRCULAR: DISTRIBUCIÓN DE VENTAS ==========
  private renderRevenueChart(stats: StatisticsData) {
    if (!this.revenueChartRef || !stats.topProductos.length) return;

    if (this.revenueChartInstance) {
      this.revenueChartInstance.destroy();
      this.revenueChartInstance = null;
    }

    const topProducts = stats.topProductos.slice(0, 5);
    const labels = topProducts.map((p) => p.nombre);
    const data = topProducts.map((p) => p.totalVendido);
    const colors = [
      'rgba(10, 92, 46, 0.8)',
      'rgba(37, 99, 235, 0.8)',
      'rgba(124, 58, 237, 0.8)',
      'rgba(245, 158, 11, 0.8)',
      'rgba(220, 38, 38, 0.8)',
    ];

    this.revenueChartInstance = new Chart(this.revenueChartRef.nativeElement, {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [
          {
            data: data,
            backgroundColor: colors.slice(0, data.length),
            borderColor: '#ffffff',
            borderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              usePointStyle: true,
              pointStyle: 'circle',
              padding: 20,
            },
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
                const value = context.parsed;
                const percentage = ((value / total) * 100).toFixed(1);
                return `S/ ${typeof value === 'number' ? value.toFixed(2) : '0.00'} (${percentage}%)`;
              },
            },
          },
        },
        cutout: '60%',
      },
    });
  }

  // ========== UTILIDAD PARA BARRAS HORIZONTALES EN HTML ==========
  maxVentaProducto(): number {
    const data = this.data();
    if (!data || !data.topProductos || data.topProductos.length === 0) return 1;
    const max = Math.max(...data.topProductos.map((p) => p.totalVendido));
    return max > 0 ? max : 1;
  }

  private async mostrarError(mensaje: string) {
    const toast = await this.toastCtrl.create({
      message: mensaje,
      duration: 3000,
      color: 'danger',
      position: 'top',
    });
    toast.present();
  }
}
