import { Component, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import ProductosComponent from './componentes/productos/productos.component';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'ProyectoMarketing';
  @ViewChild(ProductosComponent, { static: true }) productosComponent!: ProductosComponent;

  onCodeScanned(barcode: string) {
    if (this.productosComponent) {
      this.productosComponent.onCodeScanned(barcode);
    }
  }


  onFilterProductIdChange(value: string) {
    if (this.productosComponent) {
      this.productosComponent.filterProductsById(value);
    }
  }

}
