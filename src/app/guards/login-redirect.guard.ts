import { Injectable } from '@angular/core';
import { CanActivate, CanActivateFn, Router } from '@angular/router';
import { AutenticacionService } from '../services/autenticacion.service';

@Injectable({
  providedIn: 'root'
})
export class LoginRedirectGuard implements CanActivate {

  constructor(private authService: AutenticacionService, private router: Router) {}

  canActivate(): boolean {
     if (this.authService.estaLogueado()) {
      this.router.navigate(['/dashboard']);
       return false;
      }
       return true;
      }
    }
