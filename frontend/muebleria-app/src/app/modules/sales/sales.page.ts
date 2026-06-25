// src/app/modules/sales/sales.page.ts
import {
  Component,
  inject,
  OnInit,
  signal,
  ViewChild,
  ChangeDetectorRef,
  AfterViewInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButton,
  IonIcon,
  IonItem,
  IonLabel,
  IonInput,
  IonSelect,
  IonSelectOption,
  IonRadio,
  IonRadioGroup,
  IonSpinner,
  ToastController,
  AlertController,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  closeOutline,
  cashOutline,
  cardOutline,
  businessOutline,
  personOutline,
  addOutline,
  listOutline,
} from 'ionicons/icons';
import { firstValueFrom } from 'rxjs';
import { ClientesApiService, Cliente } from '../../core/services/clientes-api.service';
import { ProductosApiService, Producto } from '../../core/services/productos-api.service';
import {
  VentasApiService,
  CreateVentaRequest,
  VentaResponse,
} from '../../core/services/ventas-api.service';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

type PaymentMethod = 'CASH' | 'CARD' | 'TRANSFER';

interface SaleItem {
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  stock: number;
}

@Component({
  selector: 'app-sales',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonModal,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButton,
    IonIcon,
    IonItem,
    IonLabel,
    IonInput,
    IonSelect,
    IonSelectOption,
    IonRadio,
    IonRadioGroup,
    IonSpinner,
  ],
  templateUrl: './sales.page.html',
  styleUrls: ['./sales.page.scss'],
})
export class SalesPage implements OnInit, AfterViewInit {
  @ViewChild('paymentModal') paymentModal!: IonModal;

  // ========== DATOS ==========
  clients = signal<Cliente[]>([]);
  products = signal<Producto[]>([]);
  filteredProducts = signal<Producto[]>([]);

  // ========== FORMULARIO ==========
  // Usamos ngModel directamente para evitar ExpressionChanged
  selectedClient: number | null = null;
  selectedProduct: number | null = null;
  quantity = 1;
  unitPrice = 0;
  saleItems: SaleItem[] = [];
  paymentMethod: PaymentMethod = 'CASH';
  discount = 0;

  subtotal = 0;
  igv = 0;
  total = 0;

  isLoading = signal(false);
  isSaving = signal(false);

  // ========== MODAL DE PAGO ==========
  paymentMethods: { value: PaymentMethod; label: string; icon: string }[] = [
    { value: 'CASH', label: 'Efectivo', icon: 'cash-outline' },
    { value: 'CARD', label: 'Tarjeta', icon: 'card-outline' },
    { value: 'TRANSFER', label: 'Transferencia', icon: 'business-outline' },
  ];

  cashReceived = 0;
  cashChange = 0;
  cardNumber = '';
  cardHolder = '';
  cardExpiry = '';
  cardCvv = '';
  cardInstallments = 1;
  transferReference = '';
  transferBank = '';

  // ========== INYECCIÓN ==========
  private clientesApi = inject(ClientesApiService);
  private productosApi = inject(ProductosApiService);
  private ventasApi = inject(VentasApiService);
  private toastCtrl = inject(ToastController);
  private alertCtrl = inject(AlertController);
  private cdr = inject(ChangeDetectorRef);

  constructor() {
    addIcons({
      closeOutline,
      cashOutline,
      cardOutline,
      businessOutline,
      personOutline,
      addOutline,
      listOutline,
    });
  }

  ngOnInit() {
    this.cargarDatos();
  }

  ngAfterViewInit() {
    // Forzar detección de cambios después de la vista para evitar ExpressionChanged
    this.cdr.detectChanges();
  }

  // ========== CARGA DE DATOS ==========
  async cargarDatos() {
    this.isLoading.set(true);
    try {
      const [clientes, productos] = await Promise.all([
        firstValueFrom(this.clientesApi.listar()),
        firstValueFrom(this.productosApi.listar()),
      ]);
      this.clients.set(clientes);
      this.products.set(productos);
      this.filteredProducts.set(productos.filter((p) => p.isActive && p.stock > 0));
    } catch (error) {
      this.mostrarError('Error al cargar datos');
    } finally {
      this.isLoading.set(false);
      this.cdr.detectChanges();
    }
  }

  // ========== SELECCIONES ==========
  // Usamos ngModel, por lo que no necesitamos este método, pero lo dejamos para lógica extra
  onClientChange(event: any) {
    // El valor ya está en this.selectedClient gracias a ngModel
    // Podemos hacer algo más si es necesario
  }

  selectProduct(productId: number | null) {
    this.selectedProduct = productId;
    const product = this.products().find((p) => p.id === productId);
    if (product) {
      this.unitPrice = product.price;
    }
  }

  // ========== AGREGAR / ELIMINAR ÍTEM ==========
  addItem() {
    if (!this.selectedProduct || this.quantity < 1) {
      this.mostrarError('Selecciona un producto y cantidad válida');
      return;
    }
    const product = this.products().find((p) => p.id === this.selectedProduct);
    if (!product) return;
    if (product.stock < this.quantity) {
      this.mostrarError(`Stock insuficiente. Disponible: ${product.stock}`);
      return;
    }

    const lineTotal = this.quantity * this.unitPrice;
    const existing = this.saleItems.find((item) => item.productId === product.id);
    if (existing) {
      const newQty = existing.quantity + this.quantity;
      if (product.stock < newQty) {
        this.mostrarError(`Stock insuficiente. Disponible: ${product.stock}`);
        return;
      }
      existing.quantity = newQty;
      existing.lineTotal = existing.quantity * existing.unitPrice;
    } else {
      this.saleItems.push({
        productId: product.id,
        productName: product.name,
        quantity: this.quantity,
        unitPrice: this.unitPrice,
        lineTotal,
        stock: product.stock,
      });
    }

    this.selectedProduct = null;
    this.quantity = 1;
    this.unitPrice = 0;
    this.calcularTotales();
  }

  removeItem(index: number) {
    this.saleItems.splice(index, 1);
    this.calcularTotales();
  }

  // ========== CÁLCULOS ==========
  calcularTotales() {
    this.subtotal = this.saleItems.reduce((sum, item) => sum + item.lineTotal, 0);
    this.igv = this.subtotal * 0.18;
    this.total = this.subtotal + this.igv - this.discount;
    this.subtotal = Math.round(this.subtotal * 100) / 100;
    this.igv = Math.round(this.igv * 100) / 100;
    this.total = Math.round(this.total * 100) / 100;
    if (this.total < 0) this.total = 0;
  }

  getClientName(clientId: number): string {
    const client = this.clients().find((c) => c.id === clientId);
    return client ? client.name : 'Cliente no seleccionado';
  }

  // ========== MODAL DE PAGO ==========
  async openPaymentModal() {
    if (this.saleItems.length === 0) {
      this.mostrarError('Agrega al menos un producto');
      return;
    }
    if (!this.selectedClient) {
      this.mostrarError('Selecciona un cliente');
      return;
    }
    this.cashReceived = this.total;
    this.cashChange = 0;
    this.cardNumber = '';
    this.cardHolder = '';
    this.cardExpiry = '';
    this.cardCvv = '';
    this.cardInstallments = 1;
    this.transferReference = '';
    this.transferBank = '';
    this.paymentModal.present();
  }

  closePaymentModal() {
    this.paymentModal.dismiss();
  }

  // ========== CONFIRMAR PAGO ==========
  async confirmPayment() {
    // Validar según método
    if (this.paymentMethod === 'CASH') {
      if (this.cashReceived < this.total) {
        this.mostrarError('El monto recibido es menor al total');
        return;
      }
      this.cashChange = this.cashReceived - this.total;
    } else if (this.paymentMethod === 'CARD') {
      if (!this.cardNumber || !this.cardHolder || !this.cardExpiry || !this.cardCvv) {
        this.mostrarError('Completa todos los datos de la tarjeta');
        return;
      }
      if (this.cardNumber.replace(/\s/g, '').length < 16) {
        this.mostrarError('Número de tarjeta inválido');
        return;
      }
      if (this.cardCvv.length < 3) {
        this.mostrarError('CVV inválido');
        return;
      }
    } else if (this.paymentMethod === 'TRANSFER') {
      if (!this.transferReference || !this.transferBank) {
        this.mostrarError('Completa la referencia y el banco');
        return;
      }
    }

    // Registrar venta
    await this.registrarVenta();
  }

  // ========== REGISTRAR VENTA ==========
  private async registrarVenta() {
    this.isSaving.set(true);
    try {
      const payload: CreateVentaRequest = {
        customerId: this.selectedClient!,
        items: this.saleItems.map((item) => ({
          productId: item.productId,
          cantidad: item.quantity,
        })),
        paymentMethod: this.paymentMethod,
        discount: this.discount,
      };

      const venta = await firstValueFrom(this.ventasApi.crear(payload));
      this.mostrarExito('Venta registrada exitosamente');
      this.closePaymentModal();

      // Limpiar
      this.saleItems = [];
      this.selectedClient = null;
      this.discount = 0;
      this.calcularTotales();

      // Generar PDF
      this.generarPDF(venta);
    } catch (error: any) {
      console.error('Error al registrar venta:', error);
      this.mostrarError(error?.error?.message || 'Error al registrar venta');
    } finally {
      this.isSaving.set(false);
    }
  }

  // ========== GENERAR PDF ==========
  private generarPDF(venta: VentaResponse) {
    const doc = new jsPDF('p', 'mm', 'a4');
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 15;

    // Encabezado
    doc.setFillColor(6, 64, 31);
    doc.rect(0, 0, pageWidth, 35, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.text('MUEBLERÍA IGEN', pageWidth / 2, 22, { align: 'center' });
    doc.setFontSize(10);
    doc.text('RUC: 20601234567 - Av. Principal 123, Lima', pageWidth / 2, 30, { align: 'center' });
    doc.setTextColor(0, 0, 0);

    doc.setFontSize(18);
    doc.text('COMPROBANTE DE VENTA', pageWidth / 2, 50, { align: 'center' });

    // Datos
    doc.setFontSize(10);
    let y = 60;
    doc.text(`Código: ${venta.code}`, margin, y);
    doc.text(`Fecha: ${new Date(venta.createdAt).toLocaleString()}`, pageWidth - margin - 40, y, {
      align: 'right',
    });
    y += 8;
    doc.text(`Cliente: ${venta.customer.name} - DNI: ${venta.customer.dni}`, margin, y);
    y += 8;
    doc.text(`Vendedor: ${venta.seller.fullName}`, margin, y);
    y += 10;

    // Tabla
    const tableData = venta.items.map((item) => [
      item.product.name,
      item.quantity.toString(),
      `S/ ${item.unitPrice.toFixed(2)}`,
      `S/ ${item.lineTotal.toFixed(2)}`,
    ]);

    autoTable(doc, {
      startY: y,
      head: [['Producto', 'Cant.', 'Precio Unit.', 'Total']],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [10, 92, 46], textColor: 255, fontSize: 10 },
      bodyStyles: { fontSize: 9 },
      columnStyles: {
        0: { cellWidth: 80 },
        1: { cellWidth: 25, halign: 'center' },
        2: { cellWidth: 35, halign: 'right' },
        3: { cellWidth: 35, halign: 'right' },
      },
      margin: { left: margin, right: margin },
    });

    // Totales
    const finalY = (doc as any).lastAutoTable.finalY + 10;
    doc.setFontSize(11);
    doc.text(`Subtotal: S/ ${venta.subtotal.toFixed(2)}`, pageWidth - margin - 50, finalY, {
      align: 'right',
    });
    doc.text(`IGV (18%): S/ ${venta.igv.toFixed(2)}`, pageWidth - margin - 50, finalY + 8, {
      align: 'right',
    });
    if (venta.discount > 0) {
      doc.text(`Descuento: S/ ${venta.discount.toFixed(2)}`, pageWidth - margin - 50, finalY + 16, {
        align: 'right',
      });
    }
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(`TOTAL: S/ ${venta.total.toFixed(2)}`, pageWidth - margin - 50, finalY + 28, {
      align: 'right',
    });
    doc.setFont('helvetica', 'normal');

    // Método de pago
    const metodo = { CASH: 'Efectivo', CARD: 'Tarjeta', TRANSFER: 'Transferencia' };
    doc.setFontSize(10);
    doc.text(
      `Método de pago: ${metodo[venta.paymentMethod as keyof typeof metodo]}`,
      margin,
      finalY + 28,
    );

    // Pie
    const pageHeight = doc.internal.pageSize.getHeight();
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text(
      'Gracias por su compra. Este documento es una representación digital de la venta.',
      pageWidth / 2,
      pageHeight - 10,
      { align: 'center' },
    );

    doc.save(`venta-${venta.code}.pdf`);
  }

  // ========== CREAR CLIENTE RÁPIDO ==========
  async openClientModal() {
    const alert = await this.alertCtrl.create({
      header: 'Nuevo Cliente',
      inputs: [
        { name: 'name', type: 'text', placeholder: 'Nombre completo' },
        { name: 'dni', type: 'text', placeholder: 'DNI' },
        { name: 'phone', type: 'text', placeholder: 'Teléfono (opcional)' },
        { name: 'address', type: 'text', placeholder: 'Dirección (opcional)' },
      ],
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Crear',
          handler: async (data) => {
            if (!data.name || !data.dni) {
              this.mostrarError('Nombre y DNI son requeridos');
              return false;
            }
            try {
              const nuevo = await firstValueFrom(
                this.clientesApi.crear({
                  name: data.name.trim(),
                  dni: data.dni.trim(),
                  phone: data.phone?.trim() || '',
                  address: data.address?.trim() || '',
                }),
              );
              this.clients.set([...this.clients(), nuevo]);
              this.selectedClient = nuevo.id;
              this.mostrarExito('Cliente creado y seleccionado');
              this.cdr.detectChanges();
            } catch (error: any) {
              this.mostrarError(error?.error?.message || 'Error al crear cliente');
              return false;
            }
            return true;
          },
        },
      ],
    });
    await alert.present();
  }

  // ========== HISTORIAL ==========
  async verHistorial() {
    try {
      const ventas = await firstValueFrom(this.ventasApi.listar());
      if (ventas.length === 0) {
        this.mostrarError('No hay ventas registradas');
        return;
      }
      // Mostrar un resumen en un alert
      let mensaje = 'Últimas ventas:\n\n';
      ventas.slice(0, 10).forEach((v) => {
        mensaje += `${v.code} - ${v.customer.name} - S/ ${v.total.toFixed(2)} (${new Date(v.createdAt).toLocaleDateString()})\n`;
      });
      const alert = await this.alertCtrl.create({
        header: 'Historial de Ventas',
        message: mensaje,
        buttons: ['OK'],
      });
      await alert.present();
    } catch (error) {
      this.mostrarError('Error al cargar el historial');
    }
  }

  // ========== UTILIDADES ==========
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

  trackById(index: number, item: any) {
    return item.id;
  }
}
