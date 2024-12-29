import { Producto } from "./producto";

export interface DetalleProducto {
  detalle_producto_id: string;
  fecha_ingreso_prod: Date;
  fecha_vencimiento_prod: Date;
  peso_prod: number;
  precio_prod: number;
  stock:number;
  producto: Producto;
}
