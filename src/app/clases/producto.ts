import { Categoria } from "./categoria";
import { Proveedor } from "./proveedor";

export interface Producto {
  producto_id:  string;
  nombre_prod: string;
  marca_prod: string;
  presentacion_prod: string;
  disponibilidad_prod: boolean;
  imagen_prod: string;
  //categoria_id: string;
  //proveedor_id: string;
  categoria: Categoria;
  proveedor: Proveedor;
}
