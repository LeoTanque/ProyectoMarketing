import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AperturaCaja } from '../clases/apertura-caja';

@Injectable({
  providedIn: 'root'
})
export class AperturaCajaService {

  private baseUrl = 'http://localhost:8080/market-app/apertura-caja';

  constructor(private http: HttpClient) { }

  obtenerAperturasPorUsuario(usuarioId: string): Observable<AperturaCaja[]> {
    return this.http.get<AperturaCaja[]>(`${this.baseUrl}/usuario/${usuarioId}`);
   }

   obtenerAperturas(): Observable<AperturaCaja[]> {
    return this.http.get<AperturaCaja[]>(`${this.baseUrl}`);
   }

   actualizarEstadoCaja1(cajaId: string, nuevoEstado: string): Observable<AperturaCaja> {
    return this.http.put<AperturaCaja>(`${this.baseUrl}/${cajaId}`, { estado: nuevoEstado });
   }

   actualizarEstadoCaja(cajaId: string, datosActualizacion: any): Observable<AperturaCaja> {
    return this.http.put<AperturaCaja>(`${this.baseUrl}/${cajaId}`, datosActualizacion);
   }



}
