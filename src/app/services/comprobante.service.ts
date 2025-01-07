import { DetalleComprobante } from './../clases/detalle-comprobante';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Comprobante } from '../clases/comprobante';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ComprobanteService {
  private baseUrl = 'http://localhost:8080/market-app/comprobantes';
private url = 'http://localhost:8080/market-app/detalle-comprobante'
  constructor(private http: HttpClient) { }

    obtenerComprobantes(): Observable<Comprobante[]> {
      return this.http.get<Comprobante[]>(`${this.baseUrl}`);
    }


    obtenerComprobantePorId(id: string): Observable<Comprobante> {
      return this.http.get<Comprobante>(`${this.baseUrl}/${id}`);
    }

    crearComprobante(comprobante: Comprobante): Observable<Comprobante> {
      return this.http.post<Comprobante>(this.baseUrl, comprobante);
    }

    actualizarComprobante(id: string, comprobante: Comprobante): Observable<Comprobante> {
      return this.http.put<Comprobante>(`${this.baseUrl}/${id}`, comprobante);
    }

    eliminarComprobante(id: string): Observable<void> {
      return this.http.delete<void>(`${this.baseUrl}/${id}`);
    }


    obtenerdetallesComprobante():Observable<DetalleComprobante[]> {
      return this.http.get<DetalleComprobante[]>(`${this.url}`);
    }

    obtenerDetalleComprobantePorId(id: string): Observable<DetalleComprobante> {
      return this.http.get<DetalleComprobante>(`${this.url}/${id}`);
    }

    crearDetalleComprobante(detalleComprobante: DetalleComprobante): Observable<DetalleComprobante> {
      return this.http.post<DetalleComprobante>(this.url, detalleComprobante);
    }

    actualizarDetalleComprobante(id: string, detalleComprobante: DetalleComprobante): Observable<DetalleComprobante> {
      return this.http.put<DetalleComprobante>(`${this.url}/${id}`, detalleComprobante);
    }

    eliminarDetalleComprobante(id: string): Observable<void> {
      return this.http.delete<void>(`${this.url}/${id}`);
    }


}
