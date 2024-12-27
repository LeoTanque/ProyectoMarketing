import { Usuario } from "./usuario";
export interface AperturaCaja {
  caja_id: string;
  monto_inicial: number;
  monto_final: number;
  monto_venta: number;
  fecha_apertura: Date;
  fecha_cierre: Date;
  estado: string;
  comentarios: string;
  usuario: Usuario;



}
