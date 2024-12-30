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

     actualizarProducto(producto: Producto): Observable<Producto> {
      return this.clienteHttp.put<Producto>(`${this.urlBase}/${producto.producto_id}`, producto);
    }

    eliminarProducto(producto_id: string): Observable<void> {
      return this.clienteHttp.delete<void>(`${this.urlBase}/${producto_id}`);
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

 agregarDetalleProducto(detalle: DetalleProducto): Observable<DetalleProducto> {
   return this.clienteHttp.post<DetalleProducto>(this.url, detalle);
  }

actualizarDetalleProducto(detalle: DetalleProducto): Observable<DetalleProducto> {
  return this.clienteHttp.put<DetalleProducto>(`${this.url}/${detalle.detalle_producto_id}`, detalle);
}

eliminarDetalleProducto(id: string): Observable<void> {
  return this.clienteHttp.delete<void>(`${this.url}/${id}`);

}

obtenerDetalleProductoPorId(detalle_producto_id: string): Observable<DetalleProducto> {
  return this.clienteHttp.get<DetalleProducto>(`${this.url}/${detalle_producto_id}`);
}

}
