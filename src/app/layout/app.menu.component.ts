import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { LayoutService } from './service/app.layout.service';

@Component({
    selector: 'app-menu',
    templateUrl: './app.menu.component.html',
    standalone:false
})
export class AppMenuComponent implements OnInit {

    model: any[] = [];
    usuario: any = {};
    credenciales: any = {};
    constructor(public layoutService: LayoutService) { }

    ngOnInit() {
      //this.usuario = localStorage.getItem('usuario');
      const usuarioStr = localStorage.getItem('usuario');
      if (usuarioStr && typeof usuarioStr === 'string') {
        try {
         this.usuario = JSON.parse(usuarioStr);
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

        this.model = [

            {

                items: [
                    { label: 'Inicio', icon: 'pi pi-home', routerLink: ['/dashboard'] },
                    { label: 'Reportes', icon: 'pi pi-fw pi-check-square', routerLink: ['/dashboard/reportes'] },
                    { label: 'Usuarios', icon: 'pi pi-users', routerLink: ['/dashboard/usuarios'] },
                    { label: 'Productos', icon: 'pi pi-fw pi-exclamation-circle', routerLink: ['/dashboard/productos'] },
                    { label: 'Proveedores', icon: 'pi pi-barcode', routerLink: ['/dashboard/proveedores'] },
                    { label: 'Comprobante', icon: 'pi pi-receipt', routerLink: ['/dashboard/comprobante'] },
                    { label: 'Lotes', icon: 'pi pi-receipt', routerLink: ['dashboard/lote'] },


                ]
            },
            {
                label: 'Utiles',
                items: [
                    { label: 'Ayuda', icon: 'pi pi-fw pi-eye', routerLink: ['/blocks'], badge: 'NEW' },
                    { label: 'Ajustes', icon: 'pi pi-fw pi-globe', url: [], target: '_blank' },
                ]
            },

        ];
    }
}
