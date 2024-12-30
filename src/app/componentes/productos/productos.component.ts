import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Producto } from '../../clases/producto';
import { ProductoService } from '../../services/producto.service';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { DetalleProducto } from '../../clases/detalle-producto';
import { TableModule } from 'primeng/table';
import { FormBuilder, FormGroup, FormsModule, NgForm, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
import { SelectModule } from 'primeng/select';
import { Categoria } from '../../clases/categoria';
import { Proveedor } from '../../clases/proveedor';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
@Component({
  selector: 'app-productos',
  imports: [CommonModule, DialogModule, ButtonModule, TableModule, FormsModule, InputTextModule, CheckboxModule,
     SelectModule,RadioButtonModule, ReactiveFormsModule, ToastModule, ConfirmDialogModule, ToastModule ],
     providers: [MessageService],
  templateUrl: './productos.component.html',
  styleUrl: './productos.component.scss'
})
export default class ProductosComponent implements OnInit{

 // productForm!: FormGroup;
  productoss!:Producto[];
  products!: DetalleProducto[];
  visible: boolean = false;
  selectedDetalles: DetalleProducto[] = [];
  categorias!: Categoria[];
  proveedores!: Proveedor[];
  addProductDialogVisible: boolean = false;
  submitted: boolean = false;
  addDetalleDialogVisible: boolean = false;
  newProduct: any = {
    producto_id: '',
    nombre_prod: '',
    marca_prod: '',
    presentacion_prod: '',
    disponibilidad_prod: true,
    imagen_prod: '',
    categoria: {
      categoria_id: '',

    },
    proveedor: {
      proveedor_id: '',

    }
  }

  newDetalleProducto: any = {
    detalle_producto_id: '',
    producto: { producto_id: '', },
    stock: 0,
    precio_prod: 0,
    fecha_ingreso_prod: '',
    fecha_vencimiento_prod: '',
    peso_prod: 0
  };


  constructor(private fb: FormBuilder,private servicio:ProductoService,
    private messageService: MessageService, private confirmationService: ConfirmationService){

  }


  ngOnInit(): void {




    this.obtenerProductos();
    this.obtenerProducts();
    this.obtenerCategorias();
    this.obtenerProveedores();
  }



   obtenerProductos(){
    this.servicio.obtenerProductos().subscribe(
      (datos => {
        this.productoss = datos;
        console.log('productos', datos)
      })
    );
  }

   obtenerProducts(){
    this.servicio.obtenerProductosLista().subscribe(
      (datos => {
        this.products = datos;
        console.log('detalles de productos', datos)
      })
    );
  }

  obtenerCategorias() {
     this.servicio.obtenerCategorias().subscribe(
       datos => {
         this.categorias = datos;
         console.log('categorias', datos);
        } );
      }


      obtenerProveedores() {
         this.servicio.obtenerProveedores().subscribe(
           datos => {
             this.proveedores = datos;
             console.log('proveedores', datos);
            } );
          }

  showDialog(producto_id: string) {
     this.selectedDetalles = this.products.filter(
      detalle => detalle.producto.producto_id === producto_id);
       this.visible = true;
       if (this.selectedDetalles.length === 0) {
         console.log('No hay lotes para este producto.');
         } else {
          console.log('Detalles del producto:', this.selectedDetalles);
         } }


trackByFn(index: number, item: DetalleProducto): string {
  return item.detalle_producto_id;
 }

 openAddProductDialog() {
   this.addProductDialogVisible = true;
   this.submitted = false;
  }

  saveProduct1() {
    this.servicio.agregarProducto(this.newProduct).subscribe(
       respuesta => {
         console.log('Producto guardado', respuesta);
         this.obtenerProductos();
         this.addProductDialogVisible = false;
         this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Producto guardado correctamente.'
         });
        },
        error => {
          console.error('Error al guardar el producto', error);
          console.error('Error al guardar el producto', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Hubo un error al guardar el producto.'
          });
        } );
      }


      saveProduct() {
        this.submitted = true;
        if (this.newProduct.producto_id &&
          this.newProduct.nombre_prod &&
          this.newProduct.marca_prod &&
          this.newProduct.presentacion_prod &&
          this.newProduct.categoria.categoria_id &&
          this.newProduct.proveedor.proveedor_id) {
             this.servicio.agregarProducto(this.newProduct).subscribe(
               respuesta => {
                 console.log('Producto guardado', respuesta);
                 this.messageService.add({
                  severity: 'success',
                  summary: 'Éxito',
                  detail: 'Producto guardado correctamente.'
                });
                this.obtenerProductos();
                this.addProductDialogVisible = false;
              }, error => {
                 console.error('Error al guardar el producto', error);
                 this.messageService.add({
                  severity: 'error',
                  summary: 'Error',
                  detail: 'Hubo un error al guardar el producto.'
                });
              } );
            } else {
              this.messageService.add({
                severity: 'warn',
                summary: 'Advertencia',
                detail: 'Debe llenar todos los campos obligatorios.'
              });
            }
          }

      hideDialog() {
       this.addProductDialogVisible= false
       this.submitted = false;
       this.addDetalleDialogVisible = false
      }

      eliminarProducto(producto_id: string) {
        this.confirmationService.confirm({
          message: `¿Está seguro de que desea eliminar el producto con ID ${producto_id}?`,
          header: 'Confirmar',
          icon: 'pi pi-exclamation-triangle',
          accept: () => {
            this.servicio.eliminarProducto(producto_id).subscribe(
              () => {
                console.log(`Producto eliminado: ${producto_id}`);
                this.productoss = this.productoss.filter(val => val.producto_id !== producto_id);
                this.messageService.add({
                  severity: 'success',
                  summary: 'Éxito',
                  detail: 'Producto eliminado correctamente.'
                });
              }, error => {
                console.error(`Error eliminando producto (${producto_id}):`, error);
                this.messageService.add({
                  severity: 'error',
                  summary: 'Error',
                  detail: `Error eliminando producto (${producto_id})`
                });
              } );
            }
          });
        }


    saveDetalleProducto() {
      this.submitted = true;
      if (this.newDetalleProducto.detalle_producto_id &&
        this.newDetalleProducto.stock &&
        this.newDetalleProducto.precio_prod &&
        this.newDetalleProducto.fecha_ingreso_prod &&
        this.newDetalleProducto.fecha_vencimiento_prod &&
        this.newDetalleProducto.peso_prod
      ) {
          this.newDetalleProducto.fecha_ingreso_prod = this.formatDateToISO(this.newDetalleProducto.fecha_ingreso_prod);
          this.newDetalleProducto.fecha_vencimiento_prod = this.formatDateToISO(this.newDetalleProducto.fecha_vencimiento_prod);
          console.log('Formulario enviado:', this.newDetalleProducto);
          this.servicio.agregarDetalleProducto(this.newDetalleProducto).subscribe( respuesta => {
            console.log('Detalle de producto guardado', respuesta);
            this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Detalle de producto guardado correctamente.' });
             this.obtenerProducts();
             this.addDetalleDialogVisible = false;
            }, error => {
              console.error('Error al guardar el detalle de producto', error);
              this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Hubo un error al guardar el detalle de producto.' });
            } );
          } else {
             this.messageService.add({ severity: 'warn', summary: 'Advertencia', detail: 'Debe llenar todos los campos obligatorios.'

             });

            }

          }



    formatDateToISO(date: string): string { const d = new Date(date); return d.toISOString().split('.')[0] + 'Z'; }

  actualizarDetalleProducto() {
    this.servicio.actualizarDetalleProducto(this.newDetalleProducto).subscribe(
       respuesta => {
        console.log('Detalle de producto actualizado', respuesta);
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Detalle de producto actualizado correctamente.'
        });
        this.obtenerProducts();
      }, error => {
        console.error('Error al actualizar el detalle de producto', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Hubo un error al actualizar el detalle de producto.'
        });
      } );
 }

 eliminarDetalleProducto(detalle_producto_id: string) {
  this.confirmationService.confirm({
    message: `¿Está seguro de que desea eliminar el detalle de producto con ID ${detalle_producto_id}?`,
    header: 'Confirmar', icon: 'pi pi-exclamation-triangle',
    accept: () => {
      this.servicio.eliminarDetalleProducto(detalle_producto_id).subscribe(
         () => {
          console.log(`Detalle de producto eliminado: ${detalle_producto_id}`);
          this.selectedDetalles = this.selectedDetalles.filter(val => val.detalle_producto_id !== detalle_producto_id);
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Detalle de producto eliminado correctamente.'
          });
        }, error => {
          console.error(`Error eliminando detalle de producto (${detalle_producto_id}):`, error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: `Error eliminando detalle de producto (${detalle_producto_id})`
          });
        } );
      }
    });
  }


 obtenerDetalleProductoPorId(detalle_producto_id: string) {
  this.servicio.obtenerDetalleProductoPorId(detalle_producto_id).subscribe(
    detalle => {
      this.newDetalleProducto = detalle;
       console.log('Detalle de producto obtenido', detalle);
      }, error => {
        console.error('Error al obtener el detalle de producto', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Hubo un error al obtener el detalle de producto.'
        });
      } );
    }

    openAddDetalleDialog(producto_id: string) {
      this.newDetalleProducto = {
        detalle_producto_id: '',
        producto: { producto_id: producto_id, },
        stock: 0,
        precio_prod: 0,
        fecha_ingreso_prod: '',
        fecha_vencimiento_prod: '',
        peso_prod: 0
      };
      this.addDetalleDialogVisible = true;
    }
}
