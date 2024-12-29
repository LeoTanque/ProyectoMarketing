import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { CardModule } from 'primeng/card';
import { PanelModule } from 'primeng/panel';
import { Router } from '@angular/router';
import { AutenticacionService } from '../../services/autenticacion.service';
import { Credenciales } from '../../clases/credenciales';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ButtonModule,ToastModule ,PanelModule,InputTextModule, PasswordModule,CardModule, ConfirmDialog],
  providers:[MessageService, ConfirmationService],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export default class LoginComponent {

  loginForm!: FormGroup;
  mensaje: string = '';

  constructor(private fb: FormBuilder, private authService: AutenticacionService, private router:Router,  private messageService: MessageService,
    private confirmationService: ConfirmationService,) {
    this.loginForm = this.fb.group({
      usuario_cred: ['', Validators.required],
      contrasena_cred: ['', Validators.required]
    });
  }

  login1(): void {
    if (this.loginForm.valid) {
       const credenciales = new Credenciales(this.loginForm.value.usuario_cred,this.loginForm.value.contrasena_cred);
       console.log('Datos del formulario:', credenciales);
       this.authService.login(credenciales).subscribe(
         response => {
          this.mensaje = response;

            console.log('Respuesta del servidor:', response);
            this.messageService.add({
              severity: 'success',
               summary: 'Successful',
                detail: 'Usuarios logueado con exito',
                 life: 3000
                }
              );
              this.router.navigate(['dashboard']);
            //localStorage.setItem('usuario', response);
            localStorage.setItem('usuario', JSON.stringify(response.usuario));
            localStorage.setItem('credenciales', JSON.stringify(response.credenciales));

            localStorage.setItem('Nombre del Usuario', JSON.stringify(response.usuario.nombre_us))
            localStorage.setItem('User', JSON.stringify(response.credenciales.usuario_cred))

            console.log('Datos del Usuario:', response.usuario);
            console.log('Nombre del Usuario:', response.usuario.nombre_us);
            console.log('Credenciales del Usuario:', response.credenciales.usuario_cred);

          }, error => {
            this.mensaje = error;
             console.error('Error del servidor:', error);
             this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Error en el servidor',
              life: 3000
            });
            }
          );
        } else {
          this.mensaje = 'Por favor, complete todos los campos requeridos.';
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Por favor, complete todos los campos requeridos.',
            life: 3000
          });
         }
        }


        login(): void {
           if (this.loginForm.valid) {
             const credenciales = new Credenciales(this.loginForm.value.usuario_cred, this.loginForm.value.contrasena_cred);
              this.authService.login(credenciales).subscribe(
                 response => {
                  this.messageService.add({
                    severity: 'success',
                     summary: 'Successful',
                     detail: 'Usuario logueado con éxito',
                     life: 3000
                    });
                     this.router.navigate(['dashboard']);
                     localStorage.setItem('usuario', JSON.stringify(response.usuario));
                     localStorage.setItem('credenciales', JSON.stringify(response.credenciales));
                    }, error => {
                       this.mensaje = error; this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                         detail: error,
                         life: 3000
                        });
                       } );
                       } else {
                         this.messageService.add({
                          severity: 'error',
                          summary: 'Error',
                          detail: 'Por favor, complete todos los campos requeridos.',
                          life: 3000
                        });
                      }
                    }



}
