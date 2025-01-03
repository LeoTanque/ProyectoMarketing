import { AperturaCajaService } from './../../services/apertura-caja.service';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { StyleClassModule } from 'primeng/styleclass';
import { PanelMenuModule } from 'primeng/panelmenu';
import { ChartModule } from 'primeng/chart';
import { MenuModule } from 'primeng/menu';
import { TableModule } from 'primeng/table';
import { ProductService } from '../../services/product.service';
import { LayoutService } from '../../layout/service/app.layout.service';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { AperturaCaja } from '../../clases/apertura-caja';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
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
    ToastModule],
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
    chartData: any;

    chartOptions: any;

    subscription!: Subscription;

    usuario: any = {};
    credenciales: any = {};

  constructor(public layoutService: LayoutService,
     private aperturaCajaService:AperturaCajaService,
     private messageService: MessageService,
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


    /* aperturarCaja0(): void {
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
            this.obtenerAperturasCaja();
           })
           .catch((error) => {
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
  }*/


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



}

