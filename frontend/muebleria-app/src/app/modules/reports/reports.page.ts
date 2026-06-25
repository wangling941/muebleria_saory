import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonButton,
  IonIcon,
  IonItem,
  IonLabel,
  IonDatetime,
  IonSpinner,
  ToastController,
  AlertController,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  downloadOutline,
  calendarOutline,
  cashOutline,
  peopleOutline,
  cartOutline,
  refreshOutline,
  documentOutline,
  calculatorOutline,
  barChartOutline,
} from 'ionicons/icons';
import { firstValueFrom } from 'rxjs';
import {
  ReportesApiService,
  ResumenReporte,
  VentaPorDia,
} from '../../core/services/reportes-api.service';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonButton,
    IonIcon,
    IonItem,
    IonLabel,
    IonDatetime,
    IonSpinner,
  ],
  templateUrl: './reports.page.html',
  styleUrls: ['./reports.page.scss'],
})
export class ReportsPage implements OnInit {
  fechaInicio: string = '';
  fechaFin: string = '';

  resumen = signal<ResumenReporte | null>(null);
  ventasPorDia = signal<VentaPorDia[]>([]);
  isLoading = signal(false);
  isExporting = signal(false);

  private reportesApi = inject(ReportesApiService);
  private toastCtrl = inject(ToastController);
  private alertCtrl = inject(AlertController);

  maxVentaDiaria(): number {
    const ventas = this.ventasPorDia();
    if (!ventas || ventas.length === 0) return 1;
    const max = Math.max(...ventas.map((v) => v.total));
    return max > 0 ? max : 1;
  }

  constructor() {
    addIcons({
      downloadOutline,
      calendarOutline,
      cashOutline,
      peopleOutline,
      cartOutline,
      refreshOutline,
      documentOutline,
      calculatorOutline,
      barChartOutline,
    });
  }

  ngOnInit() {
    const today = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(today.getDate() - 30);
    this.fechaInicio = thirtyDaysAgo.toISOString().split('T')[0];
    this.fechaFin = today.toISOString().split('T')[0];
    this.cargarReportes();
  }

  async cargarReportes() {
    this.isLoading.set(true);
    try {
      const [resumen, ventasPorDia] = await Promise.all([
        firstValueFrom(this.reportesApi.obtenerResumen(this.fechaInicio, this.fechaFin)),
        firstValueFrom(this.reportesApi.obtenerVentasPorDia(this.fechaInicio, this.fechaFin)),
      ]);
      this.resumen.set(resumen);
      this.ventasPorDia.set(ventasPorDia);
    } catch (error) {
      console.error(error);
      this.mostrarError('Error al cargar los reportes');
    } finally {
      this.isLoading.set(false);
    }
  }

  aplicarFiltros() {
    this.cargarReportes();
  }

  limpiarFiltros() {
    const today = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(today.getDate() - 30);
    this.fechaInicio = thirtyDaysAgo.toISOString().split('T')[0];
    this.fechaFin = today.toISOString().split('T')[0];
    this.cargarReportes();
  }

  async exportarPDF() {
    if (!this.resumen()) {
      this.mostrarError('No hay datos para exportar');
      return;
    }

    this.isExporting.set(true);
    const alert = await this.alertCtrl.create({
      header: 'Generando PDF',
      message: 'Por favor espera...',
      buttons: [],
      backdropDismiss: false,
    });
    await alert.present();

    try {
      const doc = new jsPDF('p', 'mm', 'a4');
      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 15;

      const primaryColor: [number, number, number] = [6, 64, 31];
      const secondaryColor: [number, number, number] = [10, 92, 46];

      doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.rect(0, 0, pageWidth, 35, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(22);
      doc.text('MUEBLERÍA IGEN', pageWidth / 2, 22, { align: 'center' });
      doc.setFontSize(10);
      doc.text('RUC: 10765198882 - Av. Rosa de América 246 comas', pageWidth / 2, 30, {
        align: 'center',
      });
      doc.setTextColor(0, 0, 0);

      doc.setFontSize(18);
      doc.text('REPORTE DE VENTAS', pageWidth / 2, 50, { align: 'center' });

      doc.setFontSize(10);
      let y = 60;
      const periodo = `Período: ${this.fechaInicio} al ${this.fechaFin}`;
      doc.text(periodo, margin, y);
      y += 12;

      const data = this.resumen()!;
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('Resumen General', margin, y);
      doc.setFont('helvetica', 'normal');
      y += 8;

      const resumenLines = [
        ['Total Ventas', `S/ ${data.ventasTotales.toFixed(2)}`],
        ['N° de Órdenes', `${data.totalOrdenes}`],
        ['Ticket Promedio', `S/ ${data.ticketPromedio.toFixed(2)}`],
        ['Clientes Atendidos', `${data.clientesAtendidos}`],
        ['Subtotal Total', `S/ ${data.subtotalTotal.toFixed(2)}`],
        ['IGV Total', `S/ ${data.igvTotal.toFixed(2)}`],
        ['Descuentos Totales', `S/ ${data.descuentoTotal.toFixed(2)}`],
      ];

      autoTable(doc, {
        startY: y,
        head: [['Concepto', 'Valor']],
        body: resumenLines,
        theme: 'striped',
        headStyles: { fillColor: secondaryColor, textColor: 255, fontSize: 10 },
        bodyStyles: { fontSize: 9 },
        columnStyles: {
          0: { cellWidth: 70 },
          1: { cellWidth: 50, halign: 'right' },
        },
        margin: { left: margin, right: margin },
      });
      y = (doc as any).lastAutoTable.finalY + 10;

      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('Productos Más Vendidos', margin, y);
      doc.setFont('helvetica', 'normal');
      y += 8;

      if (data.topProductos && data.topProductos.length > 0) {
        const topData = data.topProductos.map((p) => [
          p.nombre,
          p.cantidadVendida.toString(),
          `S/ ${p.totalVendido.toFixed(2)}`,
        ]);
        autoTable(doc, {
          startY: y,
          head: [['Producto', 'Cantidad', 'Total Vendido']],
          body: topData,
          theme: 'grid',
          headStyles: { fillColor: secondaryColor, textColor: 255, fontSize: 10 },
          bodyStyles: { fontSize: 9 },
          columnStyles: {
            0: { cellWidth: 80 },
            1: { cellWidth: 30, halign: 'center' },
            2: { cellWidth: 40, halign: 'right' },
          },
          margin: { left: margin, right: margin },
        });
        y = (doc as any).lastAutoTable.finalY + 10;
      } else {
        doc.text('No hay productos vendidos en este período.', margin, y);
        y += 10;
      }

      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('Ventas por Día', margin, y);
      doc.setFont('helvetica', 'normal');
      y += 8;

      const ventasDia = this.ventasPorDia();
      if (ventasDia && ventasDia.length > 0) {
        const diaData = ventasDia.map((item) => [item.date, `S/ ${item.total.toFixed(2)}`]);
        autoTable(doc, {
          startY: y,
          head: [['Fecha', 'Total']],
          body: diaData,
          theme: 'striped',
          headStyles: { fillColor: secondaryColor, textColor: 255, fontSize: 10 },
          bodyStyles: { fontSize: 9 },
          columnStyles: {
            0: { cellWidth: 50 },
            1: { cellWidth: 50, halign: 'right' },
          },
          margin: { left: margin, right: margin },
        });
        y = (doc as any).lastAutoTable.finalY + 10;
      } else {
        doc.text('No hay datos de ventas diarias.', margin, y);
        y += 10;
      }

      const pageHeight = doc.internal.pageSize.getHeight();
      doc.setFontSize(8);
      doc.setTextColor(150);
      doc.text(
        'Reporte generado automáticamente. Datos sujetos a cambios.',
        pageWidth / 2,
        pageHeight - 10,
        { align: 'center' },
      );

      const filename = `Reporte_Ventas_${new Date().toISOString().split('T')[0]}.pdf`;
      doc.save(filename);

      await alert.dismiss();
      this.mostrarExito('PDF generado exitosamente');
    } catch (error) {
      console.error(error);
      await alert.dismiss();
      this.mostrarError('Error al generar el PDF');
    } finally {
      this.isExporting.set(false);
    }
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

  private async mostrarExito(mensaje: string) {
    const toast = await this.toastCtrl.create({
      message: mensaje,
      duration: 2000,
      color: 'success',
      position: 'top',
    });
    toast.present();
  }
}
