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
import { MenuItem } from 'primeng/api';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-dashboard',
  imports: [ CommonModule,
    FormsModule,

    MenuModule,
    TableModule,
    StyleClassModule,
    PanelMenuModule,
    ButtonModule,],

  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  items!: MenuItem[];

    products!: any[];

    chartData: any;

    chartOptions: any;

    subscription!: Subscription;


  constructor(private productService: ProductService, public layoutService: LayoutService) {

}


  ngOnInit() {

    this.productService.getProductsSmall().then(data => this.products = data);

    this.items = [
        { label: 'Add New', icon: 'pi pi-fw pi-plus' },
        { label: 'Remove', icon: 'pi pi-fw pi-minus' }
    ];
}

}
