import { Component, ElementRef, ViewChild } from '@angular/core';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { LayoutService } from "./service/app.layout.service";
import { AutenticacionService } from '../services/autenticacion.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-topbar',
    templateUrl: './app.topbar.component.html',
    standalone:false,
    providers: [ConfirmationService, MessageService]
})
export class AppTopBarComponent {

    items!: MenuItem[];

    @ViewChild('menubutton') menuButton!: ElementRef;

    @ViewChild('topbarmenubutton') topbarMenuButton!: ElementRef;

    @ViewChild('topbarmenu') menu!: ElementRef;

    constructor(public layoutService: LayoutService,
      private authService: AutenticacionService,
      private router: Router,
      private confirmationService: ConfirmationService,
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
}
