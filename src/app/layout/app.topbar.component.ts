import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { LayoutService } from "./service/app.layout.service";
import { AutenticacionService } from '../services/autenticacion.service';
import { Router } from '@angular/router';
import { FiltroService } from '../services/filtro.service';
import { BarcodeFormat } from '@zxing/library';
@Component({
    selector: 'app-topbar',
    templateUrl: './app.topbar.component.html',
    standalone:false,
    providers: [ConfirmationService, MessageService]
})
export class AppTopBarComponent {

  @Output() codeScanned = new EventEmitter<string>();
    items!: MenuItem[];
    scannerVisible: boolean = false;
    filterProductId: string = '';
    @Output() filterProductIdChange = new EventEmitter<string>();
    @ViewChild('menubutton') menuButton!: ElementRef;

    @ViewChild('topbarmenubutton') topbarMenuButton!: ElementRef;

    @ViewChild('topbarmenu') menu!: ElementRef;

    allowedFormats = [
      BarcodeFormat.CODE_128,
      BarcodeFormat.CODE_39,
      BarcodeFormat.EAN_13,
      BarcodeFormat.EAN_8
    ];

    constructor(public layoutService: LayoutService,
      private authService: AutenticacionService,
      private router: Router,
      private confirmationService: ConfirmationService,
      private filtroService: FiltroService,


      private messageService: MessageService) { }

      confirmLogout(): void {
        this.confirmationService.confirm({
          message: '¿Está seguro de que desea cerrar sesión?',
          header: 'Confirmar Cierre de Sesión',
          icon: 'pi pi-exclamation-triangle',
          accept: () => {
             this.logout();
             this.messageService.add({
              severity: 'success',
              summary: 'Logout',
              detail: 'Sesión cerrada con éxito'
             });
            }
          });
        }

    logout(): void {
      this.authService.logout();
       this.router.navigate(['/']);
      }



      onCodeScanned(barcode: string) {
        console.log('Código escaneado:', barcode);
        this.codeScanned.emit(barcode);
      }

      onFilterProductIdChange1(value: string) {
        this.filterProductIdChange.emit(value);
      }

      onFilterProductIdChange(value: string) {
        this.filtroService.emitirFiltroProductId(value);
      }

      onScanFailure(event: any) {
        console.error('Error al escanear el código de barras:', event);
      }
}
