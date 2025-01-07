import { Comprobante } from "./comprobante";
import { Producto } from "./producto";

export interface DetalleComprobante {
  detalle_comprobante_id: string;
  cantidad: number;
  subtotal: number;
  tipo_pago: string;
  comprobante: Comprobante;
  producto: Producto;
}
