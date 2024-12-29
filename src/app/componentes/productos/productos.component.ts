import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Producto } from '../../clases/producto';
import { ProductoService } from '../../services/producto.service';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { DetalleProducto } from '../../clases/detalle-producto';
import { TableModule } from 'primeng/table';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
import { SelectModule } from 'primeng/select';
import { Categoria } from '../../clases/categoria';
import { Proveedor } from '../../clases/proveedor';
import { RadioButtonModule } from 'primeng/radiobutton';
@Component({
  selector: 'app-productos',
  imports: [CommonModule, DialogModule, ButtonModule, TableModule, FormsModule, InputTextModule, CheckboxModule, SelectModule,RadioButtonModule ],
  templateUrl: './productos.component.html',
  styleUrl: './productos.component.scss'
})
export default class ProductosComponent implements OnInit{


  productoss!:Producto[];
  products!: DetalleProducto[];
  visible: boolean = false;
  selectedDetalles: DetalleProducto[] = [];
  categorias!: Categoria[];
  proveedores!: Proveedor[];
  addProductDialogVisible: boolean = false;
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


  constructor(private servicio:ProductoService){}
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
  }

  saveProduct() {
    this.servicio.agregarProducto(this.newProduct).subscribe(
       respuesta => {
         console.log('Producto guardado', respuesta);
         this.obtenerProductos();
         this.addProductDialogVisible = false;
        },
        error => {
          console.error('Error al guardar el producto', error);
        } );
      }


}
