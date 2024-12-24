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

    constructor(public layoutService: LayoutService) { }

    ngOnInit() {
        this.model = [
            /*{
                label: 'Home',
                items: [
                    { label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/'] }
                ]
            },*/
            {
               // label: 'UI Components',
                items: [
                    { label: 'Inicio', icon: 'pi pi-home', routerLink: ['/uikit/formlayout'] },
                    { label: 'Reportes', icon: 'pi pi-fw pi-check-square', routerLink: ['/uikit/input'] },
                    { label: 'Usuarios', icon: 'pi pi-users', routerLink: ['/uikit/floatlabel'] },
                    { label: 'Productos', icon: 'pi pi-fw pi-exclamation-circle', routerLink: ['/uikit/invalidstate'] },
                    { label: 'Proveedores', icon: 'pi pi-barcode', routerLink: ['/uikit/button'] },
                    { label: 'Comprobante', icon: 'pi pi-receipt', routerLink: ['/uikit/table'] },


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
