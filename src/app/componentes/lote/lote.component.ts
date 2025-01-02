import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ZXingScannerModule } from '@zxing/ngx-scanner';

@Component({
  selector: 'app-lote',
  imports: [CommonModule, ZXingScannerModule],
 // templateUrl: './lote.component.html',
 template: `
    <zxing-scanner
      (scanSuccess)="onCodeScanned($event)">
    </zxing-scanner>
    <div *ngIf="product">
      <h3>Producto:</h3>
      <p>Nombre: {{ product.producto_id }}</p>
      <p>Precio: {{ product.nombre_prod }}</p>
    </div>
  ` ,


  styleUrl: './lote.component.scss'
})
export class LoteComponent {
  product: any;
  private urlBase = "http://localhost:8080/market-app/productos";
  constructor(private http: HttpClient) {}

  onCodeScanned(productoId: string) {
    console.log('Código escaneado:', productoId);

    this.http.get(`${this.urlBase}/${productoId}`).subscribe(
      (data) => {
        this.product = data;
      },
      (error) => {
        console.error('Error al buscar el producto:', error);
      }
    );
  }


}
