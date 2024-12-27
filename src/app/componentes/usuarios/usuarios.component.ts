import { Usuario } from './../../clases/usuario';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { UsuarioService } from '../../services/usuario.service';
import { TableModule } from 'primeng/table';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Dialog } from 'primeng/dialog';
import { Ripple } from 'primeng/ripple';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { FileUpload } from 'primeng/fileupload';
import { SelectModule } from 'primeng/select';
import { Tag } from 'primeng/tag';
import { RadioButton } from 'primeng/radiobutton';
import { Rating } from 'primeng/rating';
import { FormsModule } from '@angular/forms';
import { InputNumber } from 'primeng/inputnumber';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { Table } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';


interface Column {
  field: string;
  header: string;
  customExportHeader?: string;
}

interface ExportColumn {
  title: string;
  dataKey: string;
}



@Component({
  selector: 'app-usuarios',
  imports: [TableModule, Dialog, Ripple, SelectModule, ToastModule, ToolbarModule,
    ConfirmDialog, InputTextModule, TextareaModule, CommonModule, FileUpload, DropdownModule,
    Tag, RadioButton, Rating, InputTextModule, FormsModule, InputNumber, IconFieldModule, InputIconModule, ButtonModule],
    providers: [MessageService, ConfirmationService, UsuarioService, ],
  templateUrl: './usuarios.component.html',
  styles: [
    `:host ::ng-deep .p-dialog .product-image {
        width: 150px;
        margin: 0 auto 2rem auto;
        display: block;
    }`
]
})
export class UsuariosComponent implements OnInit{
  productDialog: boolean = false;

  products!: Usuario[];
  usuarios: Usuario[] = [];


  usuario!:any

  selectedProducts!: Usuario[] | null;

  submitted: boolean = false;

  statuses!: any[];

 @ViewChild('dt') dt!: Table;

  cols!: Column[];

  exportColumns!: ExportColumn[];



  nuevoUsuario: Usuario = {
    usuario_id: '',
    nombre_us: '',
    apellido1_us: '',
    apellido2_us: '',
    telefono_us: '',
    genero_us: '',
    imagen_us: ''
  };

  constructor(private usuarioService: UsuarioService,  private messageService: MessageService,
    private confirmationService: ConfirmationService, private cd: ChangeDetectorRef

  ) { }




  ngOnInit(): void {
   this.obtenerUsuarios();
  }

  exportCSV() {
    this.dt.exportCSV();
}

  obtenerUsuarios(): void {
    this.usuarioService.obtenerUsuarios().subscribe( (data: Usuario[]) => {
     this.usuarios = data;
     console.log('Usuarios obtenidos:', this.usuarios);
     this.cd.markForCheck();
    },
     (error) => {
       console.error('Error obteniendo usuarios:', error);
     }
   );
  }





  obtenerUsuarioPorId(usuarioId: string): void {
   this.usuarioService.obtenerUsuarioPorId(usuarioId).subscribe(
      (data: Usuario) => {
       console.log(`Usuario obtenido (${usuarioId}):`, data);
      },
       (error) => {
         console.error(`Error obteniendo usuario (${usuarioId}):`, error);
        }
       );
     }

     crearUsuario(): void {
       this.usuarioService.crearUsuario(this.nuevoUsuario).subscribe(
          (data: Usuario) => {
           console.log('Usuario creado:', data);
            this.usuarios.push(data);
            this.nuevoUsuario = {
              usuario_id: '',
               nombre_us: '',
                apellido1_us: '',
                apellido2_us: '',
                telefono_us: '',
                 genero_us: '',
                  imagen_us: ''
                 };
                },
                (error) => {
                  console.error('Error creando usuario:', error);
                  }
                 );

 }


 actualizarUsuario(usuarioId: string, usuarioActualizado: Usuario): void {
    this.usuarioService.actualizarUsuario(usuarioId, usuarioActualizado).subscribe(
      (data: Usuario) => {
        console.log('Usuario actualizado:', data);
        this.obtenerUsuarios();
       },
       (error) => {
          console.error(`Error actualizando usuario (${usuarioId}):`, error);
         }
       );
     }


     saveUsuario(): void {
       this.submitted = true;
        if (this.nuevoUsuario.nombre_us?.trim()) {
           if (this.nuevoUsuario.usuario_id) {
              this.usuarioService.actualizarUsuario(this.nuevoUsuario.usuario_id, this.nuevoUsuario).subscribe(
                (data: Usuario) => {
                  console.log('Usuario actualizado:', data);
                   this.obtenerUsuarios();
                    this.messageService.add({
                      severity: 'success',
                      summary: 'Successful',
                      detail: 'Usuario Actualizado',
                      life: 3000 });
                    }, (error) => {
                      console.error(`Error actualizando usuario (${this.nuevoUsuario.usuario_id}):`, error);
                       this.messageService.add({
                         severity: 'error',
                         summary: 'Error',
                          detail: `Error actualizando usuario (${this.nuevoUsuario.usuario_id})`, life: 3000 });
                        }
                      );
                     } else {
                       this.usuarioService.crearUsuario(this.nuevoUsuario).subscribe(
                        (data: Usuario) => {
                         console.log('Usuario creado:', data);
                         this.usuarios.push(data);
                          this.messageService.add({
                            severity: 'success',
                            summary: 'Successful',
                            detail: 'Usuario Creado',
                            life: 3000
                          }
                        );
                         this.nuevoUsuario = {
                           usuario_id: '',
                           nombre_us: '',
                           apellido1_us: '',
                           apellido2_us: '',
                           telefono_us: '',
                           genero_us: '',
                            imagen_us: ''
                           };
                          },
                           (error) => {
                            console.error('Error creando usuario:', error);
                            this.messageService.add({
                              severity: 'error',
                              summary: 'Error',
                              detail: 'Error creando usuario',
                              life: 3000
                            }
                          );
                        }

                      );
                    }
                  }
                 }





     eliminarUsuario(usuarioId: string): void {
       this.usuarioService.eliminarUsuario(usuarioId).subscribe(
          () => {
           console.log(`Usuario eliminado (${usuarioId})`);
            this.usuarios = this.usuarios.filter(
             u => u.usuario_id !== usuarioId);
           },
           (error) => {
              console.error(`Error eliminando usuario (${usuarioId}):`, error);
              }
             );
            }

            editProduct(usuario: Usuario) {
              this.usuario = { ...usuario };
              this.productDialog = true;
          }

            hideDialog() {
              this.productDialog = false;
              this.submitted = false;
          }
          openNew() {
            this.usuario = {};
            this.submitted = false;
            this.productDialog = true;
        }

        findIndexById(usuario_id: string) {
          let index = -1;
          for (let i = 0; i < this.usuarios.length; i++) {
              if (this.usuarios[i].usuario_id === usuario_id) {
                  index = i;
                  break;
              }
          }

          return index;
      }

        deleteSelectedProducts() {
          this.confirmationService.confirm({
              message: 'Are you sure you want to delete the selected products?',
              header: 'Confirm',
              icon: 'pi pi-exclamation-triangle',
              accept: () => {
                  this.usuarios = this.usuarios.filter((val) => !this.selectedProducts?.includes(val));
                  this.selectedProducts = null;
                  this.messageService.add({
                      severity: 'success',
                      summary: 'Successful',
                      detail: 'Usuarios Eliminados',
                      life: 3000
                  });
              }
          });
      }

}
