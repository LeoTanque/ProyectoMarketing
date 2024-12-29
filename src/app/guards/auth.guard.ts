import { CanActivate, CanActivateFn, Router } from '@angular/router';
import { AutenticacionService } from '../services/autenticacion.service';
import { Injectable } from '@angular/core';

@Injectable({
   providedIn: 'root'
  })
export class AuthGuard implements CanActivate {

  constructor(private authService: AutenticacionService, private router: Router) {}

  canActivate(): boolean {
     if (this.authService.estaLogueado()) {
       return true;
      } else {
        this.router.navigate(['/']);
         return false;
        }
      }
     }
