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
import { InputGroup } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { Usuario } from '../../clases/usuario';
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
  selector: 'app-users',
  imports: [TableModule, Dialog, Ripple, SelectModule, ToastModule, ToolbarModule,
      ConfirmDialog, InputTextModule, TextareaModule, CommonModule, FileUpload, DropdownModule,
      Tag, RadioButton, Rating, InputTextModule, FormsModule, InputNumber, IconFieldModule, InputIconModule,
       ButtonModule,InputGroup,InputGroupAddonModule ],

      providers: [MessageService, ConfirmationService, UsuarioService],
  templateUrl: './users.component.html',
   styles: [
    `:host ::ng-deep .p-dialog .product-image {
        width: 150px;
        margin: 0 auto 2rem auto;
        display: block;
    }`
]
})
export class UsersComponent implements OnInit {

  usuarioDialog: boolean = false;
  editarDialog: boolean =false;
  usuarios!: Usuario[];
  usuario: Usuario = {} as Usuario;
  selectedUsuarios!: Usuario[] | null;
  submitted: boolean = false;
  statuses!: any[];
  @ViewChild('dt') dt!: Table;
  cols!: Column[];
  exportColumns!: ExportColumn[];



  constructor(
    private usuarioService: UsuarioService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private cd: ChangeDetectorRef
) {}



ngOnInit(): void {
this.obtenerUsuarios();
}

exportCSV() {
  this.dt.exportCSV();
}

obtenerUsuarios() {
  this.usuarioService.obtenerUsuarios().subscribe(
     (data: any[]) => {
      this.usuarios = data;
       console.log('Usuarios obtenidos:', this.usuarios);
       this.cd.markForCheck();
      },
      (error) => {
         console.error('Error obteniendo usuarios:', error);
        }
      );
    }

  openNew() {
    this.usuario = {} as Usuario;
    this.submitted = false;
    this.usuarioDialog = true;
  }

  editUsuario(usuario: any) {
    this.usuario = { ...usuario };
     this.editarDialog = true;
    }

    deleteSelectedUsuarios() {
      this.confirmationService.confirm({
         message: '¿Está seguro de que desea eliminar los usuarios seleccionados?',
         header: 'Confirmar',
         icon: 'pi pi-exclamation-triangle',
         accept:
         () => {
          this.selectedUsuarios?.forEach(selectedUsuario => {
             this.usuarioService.eliminarUsuario(selectedUsuario.usuario_id).subscribe(
               () => {
                 this.usuarios = this.usuarios.filter(
                  usuario => usuario.usuario_id !== selectedUsuario.usuario_id);
                   console.log('Usuario eliminado:', selectedUsuario);
                   },
                   error => console.error('Error eliminando usuario:', error) );
                   }
                  );
                  this.selectedUsuarios = null;
                  this.messageService.add({
                    severity: 'success',
                     summary: 'Successful',
                      detail: 'Usuarios eliminados',
                       life: 3000
                      }
                    );
                  }
                }
              );
            }


            hideDialog() {
              this.usuarioDialog = false;
              this.editarDialog = false;
              this.submitted = false;
            }

            deleteUsuario(usuario: Usuario): void {
              this.confirmationService.confirm({
                message: `¿Está seguro de que desea eliminar a ${usuario.nombre_us} ${usuario.apellido1_us}?`,
                header: 'Confirmar',
                icon: 'pi pi-exclamation-triangle',
                accept: () => {
                  this.usuarioService.eliminarUsuario(usuario.usuario_id).subscribe(
                    () => {
                      console.log(`Usuario eliminado: ${usuario.nombre_us} ${usuario.apellido1_us}`);
                      this.usuarios = this.usuarios.filter(val => val.usuario_id !== usuario.usuario_id);
                      this.messageService.add({
                        severity: 'success',
                        summary: 'Successful',
                        detail: 'Usuario eliminado',
                        life: 3000
                      });
                    },
                    error => {
                      console.error(`Error eliminando usuario (${usuario.usuario_id}):`, error);
                      this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: `Error eliminando usuario (${usuario.nombre_us} ${usuario.apellido1_us})`,
                        life: 3000
                      });
                    }
                  );
                }
              });
            }



  findIndexById(usuario_id: string): number {
     return this.usuarios.findIndex(
      usuario => usuario.usuario_id === usuario_id);
     }

     actualizarUsuario() {
      this.submitted = true;
       if (this.usuario.nombre_us?.trim()) {
        if (this.usuario.usuario_id) {
           this.usuarioService.actualizarUsuario(this.usuario.usuario_id, this.usuario).subscribe(
             (data: Usuario) => {
              console.log('Usuario actualizado:', data);
              this.usuarios[this.findIndexById(this.usuario.usuario_id)] = data;
               this.messageService.add({
                severity: 'success',
                summary: 'Successful',
                 detail: 'Usuario actualizado',
                 life: 3000 });
                 this.hideDialog(); },
                 (error) => {
                  console.error(`Error actualizando usuario (${this.usuario.usuario_id}):`, error);
                   this.messageService.add({
                    severity: 'error',
                     summary: 'Error',
                      detail: `Error actualizando usuario (${this.usuario.usuario_id})`,
                      life: 3000
                    });
                   }
                  );
                }
              }



}

onGlobalFilter(table: Table, event: Event) {
  table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
}



crearUsuario(): void {
  this.usuarioService.crearUsuario(this.usuario).subscribe(
     (data: Usuario) => {
      console.log('Usuario creado:', data);
       this.usuarios.push(data);
       this.usuario = {
         usuario_id: '',
          nombre_us: '',
           apellido1_us: '',
           apellido2_us: '',
           telefono_us: '',
            genero_us: '',
             imagen_us: ''
            };
            this.messageService.add({
              severity: 'success',
              summary: 'Successful',
               detail: 'Usuario creado',
                life: 3000
              });
               this.usuario = {} as Usuario;
               this.hideDialog();

           },
           (error) => {
             console.error('Error creando usuario:', error);
             this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Error creando usuario',
               life: 3000
              });
             }
            );

}
}
