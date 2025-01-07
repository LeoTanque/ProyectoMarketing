import { AperturaCajaService } from './../../services/apertura-caja.service';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { StyleClassModule } from 'primeng/styleclass';
import { PanelMenuModule } from 'primeng/panelmenu';
import { ChartModule } from 'primeng/chart';
import { MenuModule } from 'primeng/menu';
import { Table, TableModule } from 'primeng/table';
import { ProductService } from '../../services/product.service';
import { LayoutService } from '../../layout/service/app.layout.service';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { AperturaCaja } from '../../clases/apertura-caja';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { Comprobante } from '../../clases/comprobante';
import { ComprobanteService } from '../../services/comprobante.service';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { ToolbarModule } from 'primeng/toolbar';
import { InputTextModule } from 'primeng/inputtext';
import { DetalleComprobante } from '../../clases/detalle-comprobante';
import { SelectModule } from 'primeng/select';
import { BarcodeFormat } from '@zxing/library';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { ProductoService } from '../../services/producto.service';
import { DialogModule } from 'primeng/dialog';
import { Producto } from '../../clases/producto';

interface Column {
  field: string;
  header: string;
  customExportHeader?: string;
}


@Component({
  selector: 'app-dashboard',
  imports: [
    CommonModule,
    FormsModule,
    MenuModule,
    TableModule,
    StyleClassModule,
    PanelMenuModule,
    ButtonModule,
    ConfirmDialog,
    ToastModule,DialogModule,
    IconFieldModule,SelectModule,ZXingScannerModule,
    InputIconModule, ToolbarModule, InputTextModule],
    providers: [MessageService, ConfirmationService],

  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
    items!: MenuItem[];

    products!: any[];

    aperturasCaja: AperturaCaja[] = [];
    botonLabel: string = 'Aperturar';
    aperturasRelacionadas: AperturaCaja[] = [];
    hayAperturasRelacionadas: boolean = false;
    selectedCaja: AperturaCaja | null = null;
    selectedCajas: AperturaCaja[] = [];


    chartOptions: any;

    subscription!: Subscription;

    usuario: any = {};
    credenciales: any = {};

    comprobantes:Comprobante[]=[];
    detallesComprobante:DetalleComprobante[]=[];
    selectedComprobantes!: DetalleComprobante[] | null;
    comprobantesRelacionadas: Comprobante[] = [];
    hayComprobantesRelacionadas: boolean = false;
    comprobanteSeleccionado: any = {
      comprobante_id: '',
      tipo_comp: '',
      fecha_comp: new Date(),
      estado_comp: '',
      total_comp: 0,
      cliente: {
        cliente_id:''},
      usuario: {
        usuario_id:''
      }
    };
    detallesFiltrados:DetalleComprobante[] = [];

    allowedFormats = [
      BarcodeFormat.CODE_128,
      BarcodeFormat.CODE_39,
      BarcodeFormat.EAN_13,
      BarcodeFormat.EAN_8,
      //BarcodeFormat.QR_CODE,
      //BarcodeFormat.DATA_MATRIX,
      //BarcodeFormat.ITF,
      //BarcodeFormat.CODABAR,
      //BarcodeFormat.UPC_A,
      //BarcodeFormat.UPC_E,
      //BarcodeFormat.PDF_417,
      //BarcodeFormat.AZTEC
    ];


    scannerVisible: boolean = false;
    scannerVis:boolean = false;
    cartModalVisible: boolean = false;
    productModalVisible: boolean = false;
    editModalVisible:boolean = false;
    scannedProducts: any[] = [];
    detalleComprobante: any = {
      detalle_comprobante_id: '',
      cantidad: 1,
      subtotal: 0,
      tipo_pago: '',
      comprobante: this.comprobanteSeleccionado,
      producto: {
        producto_id:''
      }
    };

    tiposPago: { name: string, value: string }[] = [ { name: 'Efectivo', value: 'EFECTIVO' }, { name: 'Tarjeta', value: 'TARJETA' } ];
    //comprobanteSeleccionado!: any
    cols!: Column[];
  submitted: boolean = false;
  filteredProducts: Producto[] = [];

    constructor(public layoutService: LayoutService,
     private aperturaCajaService:AperturaCajaService,
     private comprobanteService:ComprobanteService,
     private messageService: MessageService,
     private productoService: ProductoService,
     private confirmationService: ConfirmationService) {

}


  ngOnInit() {
    const usuarioStr = localStorage.getItem('usuario');
     if (usuarioStr && typeof usuarioStr === 'string') {
       try {
        this.usuario = JSON.parse(usuarioStr);

        this.obtenerAperturasCaja();
        } catch (e) {
         console.error('Error al parsear los datos del usuario:', e);
         }
         }
         const credencialesStr = localStorage.getItem('credenciales');
         if (credencialesStr) {
           try {
            this.credenciales = JSON.parse(credencialesStr);
           } catch (e) {
             console.error('Error al parsear las credenciales:', e);
            }
          }

          this.obtenerComprobantes();

          this.obtenerDetallesComprobante();
          this.obtenerProductos();
}

obtenerAperturasCaja(): void {
   this.aperturaCajaService.obtenerAperturas().subscribe(
    (data: AperturaCaja[]) => {
      this.aperturasCaja = data;
      console.log('Aperturas de Caja obtenidas:', this.aperturasCaja);
   this.comprobarAperturasRelacionadas();
   },
    (error) => {
       console.error('Error obteniendo aperturas de caja:', error);
      })


    }

    comprobarAperturasRelacionadas(): void {
       if (this.usuario) {
         this.aperturasRelacionadas = this.aperturasCaja.filter(
          apertura => apertura.usuario.usuario_id === this.usuario?.usuario_id);
          this.hayAperturasRelacionadas = this.aperturasRelacionadas.length > 0;
          console.log('Aperturas de Caja relacionadas al usuario logueado:', this.aperturasRelacionadas);
        }
      }

      selectCaja(apertura: AperturaCaja): void {
         this.selectedCaja = apertura;
         console.log('Apertura de Caja seleccionada:', this.selectedCaja);
        }

        onSelectCaja(): void {
           if (this.selectedCajas && this.selectedCajas.length > 0) {
             const estadoActual = this.selectedCajas[0].estado;
              this.botonLabel = estadoActual === 'ABIERTO' ? 'Cerrar caja' : 'Aperturar';
            } else {
              this.botonLabel = 'Aperturar';
            }
          }




   aperturarCaja(): void {
     if (this.selectedCajas && this.selectedCajas.length > 0) {
      const caja = this.selectedCajas[0];
       const fechaActual = new Date().toISOString();
       const estadoNuevo = caja.estado === 'ABIERTO' ? 'CERRADO' : 'ABIERTO';
       const datosActualizacion = {
      caja_id: caja.caja_id,
      monto_inicial: caja.monto_inicial,
      monto_final: caja.monto_final,
      monto_venta: caja.monto_venta,
      fecha_apertura: estadoNuevo === 'ABIERTO' ? fechaActual : caja.fecha_apertura,
      fecha_cierre: estadoNuevo === 'CERRADO' ? fechaActual : caja.fecha_cierre, estado: estadoNuevo,
      comentarios: caja.comentarios,
      usuario: {
         usuario_id: caja.usuario.usuario_id
           }
             };
     console.log('ID de la apertura seleccionada:', caja.caja_id);
     console.log('Datos enviados para la actualización:', datosActualizacion);
     caja.estado = estadoNuevo; this.aperturaCajaService.actualizarEstadoCaja(caja.caja_id, datosActualizacion).toPromise()
    .then((resultado) => {
       console.log('Estado de caja actualizado:', resultado);
       this.messageService.add({
         severity: 'success',
          summary: 'Successful',
          detail: 'Estado de caja actualizado',
           life: 3000
          });
           this.botonLabel = estadoNuevo === 'ABIERTO' ? 'Cerrar caja' : 'Aperturar';
           this.obtenerAperturasCaja();
           }) .catch((error) => {
            console.error('Error actualizando estado de caja:', error);
             this.messageService.add({
               severity: 'error',
               summary: 'Error',
                detail: 'Error actualizando estado de caja',
                 life: 3000
                 });
                });
              } else {
                 this.messageService.add({
                 severity: 'warn',
                 summary: 'Warning',
                  detail: 'No hay ninguna caja seleccionada',
                   life: 3000
                  });
          }
   }



            confirmAperturarCaja(): void {
               if (this.selectedCajas && this.selectedCajas.length > 0) {
                this.confirmationService.confirm({
                   message: '¿Está seguro de que desea cambiar el estado de la caja?',
                   header: 'Confirmar Acción',
                   icon: 'pi pi-exclamation-triangle',
                   accept: () => {
                     this.aperturarCaja();
                      },
                      reject: () => {
                         this.messageService.add({
                           severity: 'info',
                           summary: 'Acción Cancelada',
                           detail: 'No ha abierto la caja. Puede abrirla más tarde si desea.',
                           life: 3000
                          });
                        }
                      });
                     } else {
                       this.messageService.add({
                        severity: 'warn',
                        summary: 'Warning',
                        detail: 'No hay ninguna caja seleccionada',
                        life: 3000
                      });
                    }
                  }


    obtenerComprobantes() {
      this.comprobanteService.obtenerComprobantes().subscribe(
      (data: any[]) => {
      this.comprobantes = data;

      console.log('Comprobantes obtenidos:', this.comprobantes);
      this.comprobantesRelacionados();
      },
      (error) => {
      console.error('Error obteniendo comprobantes:', error);
      }
       );
    }

    comprobantesRelacionados(): void {
      if (this.usuario) {
        this.comprobantesRelacionadas = this.comprobantes.filter(
         comprobante => comprobante.usuario.usuario_id === this.usuario?.usuario_id);
         this.hayComprobantesRelacionadas = this.comprobantesRelacionadas.length > 0;
         console.log('Comprobantes relacionados al usuario logueado:', this.comprobantesRelacionadas);
       }
     }

     seleccionarComprobante(comprobante: Comprobante) {
      this.comprobanteSeleccionado = comprobante;
      console.log('Comprobante seleccionado:', this.comprobanteSeleccionado);
    }



    onSelectChange(event: any) {
      const comprobanteSeleccionado = this.comprobantesRelacionadas.find(comprobante => comprobante.comprobante_id === event.value);
      if (comprobanteSeleccionado) {
        this.comprobanteSeleccionado = comprobanteSeleccionado;

        this.filtrarDetallesComprobante(comprobanteSeleccionado.comprobante_id);
        console.log('Comprobante seleccionado:', this.comprobanteSeleccionado);
      }
    }

    obtenerDetallesComprobante() {
      this.comprobanteService.obtenerdetallesComprobante().subscribe(
      (data: any[]) => {
      this.detallesComprobante = data;
      console.log('detalles de Comprobantes obtenidos:', this.detallesComprobante);

      },
      (error) => {
      console.error('Error obteniendo detalles de comprobantes:', error);
      }
       );
    }

    filtrarDetallesComprobante(comprobanteId: string) {
      this.detallesFiltrados = this.detallesComprobante.filter(detalle => detalle.comprobante.comprobante_id === comprobanteId);
      console.log('Detalles del comprobante seleccionado:', this.detallesFiltrados);
    }

    toggleScanner() {
      this.scannerVisible = !this.scannerVisible;
    }

     toggleScanner1() {
      this.scannerVis = !this.scannerVis;
    }


    onCodeScanned1(barcode: string) {
      console.log('Código escaneado:', barcode);
      this.productoService.obtenerProductoPorId(barcode).subscribe(
        producto => {
          console.log('Producto escaneado:', producto);
          this.scannedProducts.push(producto);
        }, error => {
          console.error('Error al obtener el producto:', error);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'El producto no está registrado' });
        } );
      }


      onCodeScanned(barcode: string) {
        console.log('Código escaneado:', barcode);
        this.productoService.obtenerProductoPorId(barcode).subscribe(
          producto => {
            console.log('Producto escaneado:', producto);
            this.detalleComprobante.producto = producto;
            this.scannerVis = false;
          }, error => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'El producto no está registrado' });
          } );
        }

        obtenerProductos(){
          this.productoService.obtenerProductos().subscribe(
            (datos => {

              this.filteredProducts = datos;
              console.log('productos', datos)
              console.log('filtered', this.filteredProducts)
            })
          );
        }

      onScanFailure(event: any) {
        console.error('Error al escanear el código de barras:', event);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo detectar el código de barras. Por favor, inténtelo de nuevo.'
        });
      }

      toggleCartModal() {
        this.cartModalVisible = !this.cartModalVisible;
      }




      editarDetalleComprobante(detalle: DetalleComprobante) {
        this.detalleComprobante = { ...detalle };
        this.toggleEditModal();
      }

      incrementarCantidad() {
        this.detalleComprobante.cantidad++;
      }
      decrementarCantidad() {
        if (this.detalleComprobante.cantidad > 1) {
          this.detalleComprobante.cantidad--;
        }
      }




      guardarDetalleComprobante() {
        this.submitted = true;
        if (this.detalleComprobante.cantidad &&
            this.detalleComprobante.subtotal &&
            this.detalleComprobante.tipo_pago &&
            this.detalleComprobante.comprobante.comprobante_id &&
            this.detalleComprobante.producto.producto_id) {

          const detalleComprobante: any = {
            detalle_comprobante_id: this.detalleComprobante.detalle_comprobante_id,
            cantidad: this.detalleComprobante.cantidad,
            subtotal: this.detalleComprobante.subtotal,
            tipo_pago: this.detalleComprobante.tipo_pago,
            comprobante: {
              comprobante_id: this.comprobanteSeleccionado.comprobante_id
            },
            producto: {
              producto_id: this.detalleComprobante.producto.producto_id
            }
          };

          console.log('Formulario enviado:', detalleComprobante);
          this.comprobanteService.crearDetalleComprobante(detalleComprobante).subscribe(
            respuesta => {
              console.log('Detalle de comprobante guardado', respuesta);
              this.messageService.add({
                severity: 'success',
                summary: 'Éxito',
                detail: 'Detalle de comprobante guardado correctamente.'
              });
              this.detallesComprobante.push(respuesta);
              this.filtrarDetallesComprobante(this.comprobanteSeleccionado.comprobante_id);
              this.toggleProductModal();
            },
            error => {
              console.error('Error guardando el detalle de comprobante', error);
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Hubo un error guardando el detalle de comprobante.'
              });
            }
          );
        } else {
          this.messageService.add({
            severity: 'warn',
            summary: 'Advertencia',
            detail: 'Debe llenar todos los campos obligatorios.'
          });
        }
      }



        toggleProductModal() {
          this.productModalVisible = !this.productModalVisible;
        }

        toggleEditModal(){
          this.editModalVisible = !this.editModalVisible
        }

       onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
       }

  isFormValid() {
    return this.detalleComprobante.cantidad &&
    this.detalleComprobante.subtotal &&
    this.detalleComprobante.tipo_pago &&
    this.detalleComprobante.comprobante.comprobante_id &&
    this.detalleComprobante.producto.producto_id;
  }



  actualizarDetalleComprobante1() {
    this.submitted = true;
    if (this.detalleComprobante.cantidad &&
        this.detalleComprobante.subtotal &&
        this.detalleComprobante.tipo_pago &&
        this.detalleComprobante.comprobante.comprobante_id &&
        this.detalleComprobante.producto.producto_id) {

      const detalleComprobante: any = {
        detalle_comprobante_id: this.detalleComprobante.detalle_comprobante_id,
        cantidad: this.detalleComprobante.cantidad,
        subtotal: this.detalleComprobante.subtotal,
        tipo_pago: this.detalleComprobante.tipo_pago,
        comprobante: {
          comprobante_id: this.comprobanteSeleccionado.comprobante_id,
          tipo_comp: this.comprobanteSeleccionado.tipo_comp,
          fecha_comp: this.comprobanteSeleccionado.fecha_comp,
          estado_comp: this.comprobanteSeleccionado.estado_comp,
          total_comp: this.comprobanteSeleccionado.total_comp,
          cliente: this.comprobanteSeleccionado.cliente,
          usuario: this.comprobanteSeleccionado.usuario
        },
        producto: {
          producto_id: this.detalleComprobante.producto.producto_id,
          nombre_prod: this.detalleComprobante.producto.nombre_prod,
          marca_prod: this.detalleComprobante.producto.marca_prod,
          presentacion_prod: this.detalleComprobante.producto.presentacion_prod,
          disponibilidad_prod: this.detalleComprobante.producto.disponibilidad_prod,
          imagen_prod: this.detalleComprobante.producto.imagen_prod,
          categoria: this.detalleComprobante.producto.categoria,
          proveedor: this.detalleComprobante.producto.proveedor
        }
      };

      console.log('Formulario enviado:', detalleComprobante);
      this.comprobanteService.actualizarDetalleComprobante(this.detalleComprobante.detalle_comprobante_id, detalleComprobante).subscribe(
        respuesta => {
          console.log('Detalle de comprobante actualizado', respuesta);
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Detalle de comprobante actualizado correctamente.'
          });
          const index = this.detallesComprobante.findIndex(detalle => detalle.detalle_comprobante_id === this.detalleComprobante.detalle_comprobante_id);
          if (index !== -1) {
            this.detallesComprobante[index] = respuesta;
            this.filtrarDetallesComprobante(this.comprobanteSeleccionado.comprobante_id);
          }
          this.toggleEditModal();
        },
        error => {
          console.error('Error actualizando el detalle del comprobante', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Hubo un error actualizando el detalle del comprobante.'
          });
        }
      );
    } else {
      this.messageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'Debe llenar todos los campos obligatorios.'
      });
    }
  }

  actualizarDetalleComprobante() {
    this.submitted = true;
    if (this.detalleComprobante.cantidad &&
        this.detalleComprobante.subtotal &&
        this.detalleComprobante.tipo_pago &&
        this.detalleComprobante.comprobante.comprobante_id &&
        this.detalleComprobante.producto.producto_id) {

      const detalleComprobante: any = {
        detalle_comprobante_id: this.detalleComprobante.detalle_comprobante_id,
        cantidad: this.detalleComprobante.cantidad,
        subtotal: this.detalleComprobante.subtotal,
        tipo_pago: this.detalleComprobante.tipo_pago,
        comprobante: {
          comprobante_id: this.comprobanteSeleccionado.comprobante_id,
          tipo_comp: this.comprobanteSeleccionado.tipo_comp,
          fecha_comp: this.comprobanteSeleccionado.fecha_comp,
          estado_comp: this.comprobanteSeleccionado.estado_comp,
          total_comp: this.comprobanteSeleccionado.total_comp,
          cliente: this.comprobanteSeleccionado.cliente,
          usuario: this.comprobanteSeleccionado.usuario
        },
        producto: {
          producto_id: this.detalleComprobante.producto.producto_id,
          nombre_prod: this.detalleComprobante.producto.nombre_prod,
          marca_prod: this.detalleComprobante.producto.marca_prod,
          presentacion_prod: this.detalleComprobante.producto.presentacion_prod,
          disponibilidad_prod: this.detalleComprobante.producto.disponibilidad_prod,
          imagen_prod: this.detalleComprobante.producto.imagen_prod,
          categoria: this.detalleComprobante.producto.categoria,
          proveedor: this.detalleComprobante.producto.proveedor
        }
      };

      this.confirmationService.confirm({
        message: '¿Está seguro de que desea actualizar este detalle del comprobante?',
        header: 'Confirmación de Actualización',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          console.log('Formulario enviado:', detalleComprobante);
          this.comprobanteService.actualizarDetalleComprobante(this.detalleComprobante.detalle_comprobante_id, detalleComprobante).subscribe(
            respuesta => {
              console.log('Detalle de comprobante actualizado', respuesta);
              this.messageService.add({
                severity: 'success',
                summary: 'Éxito',
                detail: 'Detalle de comprobante actualizado correctamente.'
              });
              const index = this.detallesComprobante.findIndex(detalle => detalle.detalle_comprobante_id === this.detalleComprobante.detalle_comprobante_id);
              if (index !== -1) {
                this.detallesComprobante[index] = respuesta;
                this.filtrarDetallesComprobante(this.comprobanteSeleccionado.comprobante_id);
              }
              this.toggleEditModal();
            },
            error => {
              console.error('Error actualizando el detalle del comprobante', error);
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Hubo un error actualizando el detalle del comprobante.'
              });
            }
          );
        },
        reject: () => {
          this.messageService.add({
            severity: 'info',
            summary: 'Cancelado',
            detail: 'La actualización del detalle del comprobante ha sido cancelada.'
          });
        }
      });
    } else {
      this.messageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'Debe llenar todos los campos obligatorios.'
      });
    }
  }


      eliminarDetalleComprobante(id: string) {
        this.confirmationService.confirm({
          message: '¿Está seguro de que desea eliminar este detalle del comprobante?',
          header: 'Confirmación de Eliminación',
          icon: 'pi pi-exclamation-triangle',
          accept: () => {
            this.comprobanteService.eliminarDetalleComprobante(id).subscribe(() => {
              this.detallesComprobante = this.detallesComprobante.filter(detalle => detalle.detalle_comprobante_id !== id);
              this.filtrarDetallesComprobante(this.comprobanteSeleccionado.comprobante_id);
              this.messageService.add({
                severity: 'success',
                summary: 'Éxito',
                detail: 'Detalle de comprobante eliminado correctamente.'
              });
            },
            (error) => {
              console.error('Error eliminando el detalle del comprobante:', error);
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Error eliminando el detalle del comprobante.'
              });
            });
          },
          reject: () => {
            this.messageService.add({
              severity: 'info',
              summary: 'Cancelado',
              detail: 'La eliminación del detalle del comprobante ha sido cancelada.'
            });
          }
        });
      }


}

