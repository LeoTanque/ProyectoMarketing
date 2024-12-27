import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Usuario } from '../clases/usuario';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private baseUrl = 'http://localhost:8080/market-app/usuarios';

  constructor(private http: HttpClient) { }

  obtenerUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.baseUrl}`);
  }

  obtenerUsuarioPorId(usuarioId: string): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.baseUrl}/${usuarioId}`);
   }

   crearUsuario(usuario: Usuario): Observable<Usuario> {
      return this.http.post<Usuario>(`${this.baseUrl}`, usuario);
     }

     actualizarUsuario(usuarioId: string, usuario: Usuario): Observable<Usuario> {
       return this.http.put<Usuario>(`${this.baseUrl}/${usuarioId}`, usuario);
     }

     eliminarUsuario(usuarioId: string): Observable<void> {
        return this.http.delete<void>(`${this.baseUrl}/${usuarioId}`);
        }

}
