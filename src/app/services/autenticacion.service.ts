import { HttpClient, HttpHeaders } from '@angular/common/http';
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

 /* login(credenciales: Credenciales): Observable<string> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(this.apiUrl, credenciales, { headers, responseType: 'text' })
    .pipe( catchError(this.handleError) );
   }

       private handleError(error: any): Observable<never> {
          let errorMessage: string;
          if (error.error instanceof ErrorEvent) {
            errorMessage = `Error: ${error.error.message}`;
           } else {
              errorMessage = `Error Código: ${error.status}\nMensaje: ${error.message}`; }
           console.error(errorMessage);
           return throwError(errorMessage || 'Error al iniciar sesión. Verifique sus credenciales.');
          }*/


          login(credenciales: Credenciales): Observable<any> {
            const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
            return this.http.post<any>(this.apiUrl, credenciales, { headers }); }
}
