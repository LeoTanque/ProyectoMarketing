import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Producto } from '../clases/producto';
import { DetalleProducto } from '../clases/detalle-producto';
import { Categoria } from '../clases/categoria';
import { Proveedor } from '../clases/proveedor';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  private urlBase = "http://localhost:8080/market-app/productos";
  private url = "http://localhost:8080/market-app/detalle-producto";
  private urlCategorias = "http://localhost:8080/market-app/categorias";
  private urlProveedores = "http://localhost:8080/market-app/proveedores";
  constructor(private clienteHttp: HttpClient) { }

  obtenerProductos(): Observable<Producto[]>{
    return this.clienteHttp.get<Producto[]>(this.urlBase)
  }

  agregarProducto(producto: Producto): Observable<Producto> {
     return this.clienteHttp.post<Producto>(this.urlBase, producto);
     }

  obtenerProductosLista(): Observable<DetalleProducto[]>{
    return this.clienteHttp.get<DetalleProducto[]>(this.url)
  }

  obtenerCategorias(): Observable<Categoria[]> {
     return this.clienteHttp.get<Categoria[]>(this.urlCategorias);
     }
     obtenerProveedores(): Observable<Proveedor[]> {
       return this.clienteHttp.get<Proveedor[]>(this.urlProveedores);
      }

}
