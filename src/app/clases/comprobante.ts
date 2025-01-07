import { Cliente } from "./cliente";
import { Usuario } from "./usuario";

export interface Comprobante {
  comprobante_id: string;
  tipo_comp: string;
  fecha_comp: Date;
  estado_comp: string;
  total_comp: number;
  cliente: Cliente;
  usuario: Usuario;
}
