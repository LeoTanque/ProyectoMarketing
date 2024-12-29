import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Credenciales } from '../clases/credenciales';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class AutenticacionService {
  private apiUrl = 'http://localhost:8080/market-app/credencial-usuario/login';

  constructor(private http: HttpClient) { }



   login1(credenciales: Credenciales): Observable<any> {
     const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
     return this.http.post<any>(this.apiUrl, credenciales, { headers });
     }


     login(credenciales: Credenciales): Observable<any> {
       const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        return this.http.post<any>(this.apiUrl, credenciales, { headers }) .pipe(
          catchError((error: HttpErrorResponse) => {
            let errorMessage = '';
             if (error.status === 404) {
              errorMessage = 'Usuario no registrado';
            } else if (error.status === 401) {
              errorMessage = 'Contraseña incorrecta';
             } else {
              errorMessage = 'Error en el servidor';
            }
            return throwError(errorMessage);
          })
        );
       }

  estaLogueado(): boolean {
   const usuario = localStorage.getItem('usuario');
   return usuario !== null;
   }

   logout(): void {
    localStorage.removeItem('usuario');
    localStorage.removeItem('credenciales');
   }


}
