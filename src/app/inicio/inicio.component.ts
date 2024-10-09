import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { RestApiService } from '../services/rest-api.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})

export class InicioComponent implements OnInit {
  nuevoProducto: any = {
    stock_producto: 0,
    iva: false
  };
  edicionProducto: any = {};
  @ViewChild('modalEdicion') modalEdicion: any;
  productos: any = [];
  categorias: any = [];
  marcas: any = [];

  constructor( 
    private modalService: NgbModal,
    public restApi: RestApiService
  ) {}

  ngOnInit(): void {
    this.consultarProductos()
    this.consultarMarcas()
    this.consultarCategorias()
  }

  // Obtener la lista de productos:
  consultarProductos() {
    return this.restApi.getProductos().subscribe((data: any) => {
      this.productos = data;
      this.mapearCategoriasAMarcas();
    })
  } 

  // Obtener la lista de categorias:
  consultarCategorias() {
    return this.restApi.getCategorias().subscribe((data: any) => {
      this.categorias = data;
      this.mapearCategoriasAMarcas();

    })
  }

  // Obtener la lista de marcas:
  consultarMarcas() {
    return this.restApi.getMarcas().subscribe((data: any) => {
      this.marcas = data;
      this.mapearCategoriasAMarcas();
    })
  }


  mostrarIcono(iva: boolean): string {
    return iva ? '<span class="text-success"><b>✔</b></span>' : 
              '<span class="text-danger"><b>✘</b></span>';
  }

  
  abrirModalCreate() {
   
  }

  addProducto() {

    if (this.nuevoProducto && this.nuevoProducto.nombre_producto && this.nuevoProducto.descripcion_producto 
            && this.nuevoProducto.precio_unitario && this.nuevoProducto.precio_venta
            && this.nuevoProducto.presentacion_producto && this.nuevoProducto.categoria_id 
            && this.nuevoProducto.marca_id ) {
            // El formulario es válido, puedes realizar la solicitud POST
            this.restApi.createProducto(this.nuevoProducto).subscribe((data: any) => {
            // Limpiar el formulario después de crear el producto
            this.nuevoProducto = {
              stock_producto: 0,
              iva: false,
            };
            // Actualizar la lista de productos
            this.consultarProductos();
            this.consultarCategorias()
            this.consultarMarcas()
        });    
    } else {
      alert('Complete todos los campos');
    }
  }

  abrirModalEdicion(producto: any) {

    // Llamar a la función para obtener el producto por su ID
    this.restApi.getProductoById(producto.id_producto).subscribe((data: any) => {
      if (data) {
        // Llenar los campos del formulario del modal con los datos del producto
        this.edicionProducto.id_producto = producto.id_producto;
        this.edicionProducto.nombre_producto = producto.nombre_producto;
        this.edicionProducto.marca_id = producto.id_marca; // Usar id_marca para editarz
        this.edicionProducto.descripcion_producto = producto.descripcion_producto;
        this.edicionProducto.precio_unitario = producto.precio_unitario;
        this.edicionProducto.precio_venta = producto.precio_venta;
        this.edicionProducto.iva = producto.iva;
        this.edicionProducto.presentacion_producto = producto.presentacion_producto;
        this.edicionProducto.categoria_id = producto.id_cat;
        
      } else {
        alert('Producto no encontrado');
      }
    });
  } 
  
  actualizarProducto() {
    if (window.confirm('Esta seguro que quiere actualizar el dato?')) {

      if (this.edicionProducto && this.edicionProducto.nombre_producto && this.edicionProducto.descripcion_producto 
        && this.edicionProducto.precio_unitario && this.edicionProducto.precio_venta
        && this.edicionProducto.presentacion_producto && this.edicionProducto.categoria_id 
        && this.edicionProducto.marca_id ) {

        this.restApi.updateProducto(this.edicionProducto.id_producto, this.edicionProducto)
          .subscribe((data: any) => {
            if(data) {
              // Realizar alguna acción después de la actualización, como cerrar el modal
              alert('Producto actualizado con éxito');
              this.modalService.dismissAll(); // Cierra el modal de edición
              // Actualizar la lista de productos si es necesario
              this.consultarProductos();
              this.consultarMarcas();
              this.consultarCategorias();
            } else {
              alert("Error al actualizar");
            }
          });
      } else {
        alert('Complete todos los campos')

      }
    }
  }
  
  eliminarProducto(id:any) {
    if (window.confirm('Esta seguro que desea eliminar el dato?')) {
      this.restApi.deleteProducto(id).subscribe(data => {
        this.consultarProductos()
        this.consultarMarcas()
        this.consultarCategorias()
      })
    }
  }

   // Función para mapear nombres de categoría y marca a productos
   mapearCategoriasAMarcas() {
    if (this.productos && this.categorias && this.marcas) {
      this.productos.forEach((producto: any) => {
        const categoria = this.categorias.find((c: any) => c.id_cat === producto.categoria_id);
        const marca = this.marcas.find((m: any) => m.id_marca === producto.marca_id);
  
        if (categoria) {
          producto.id_cat = producto.categoria_id;

          producto.categoria_id = categoria.nombre_cat;
        }
  
        if (marca) {
          // Guarda el id_marca original en un nuevo campo
          producto.id_marca = producto.marca_id;
          // Muestra el nombre_marca en el campo de la tabla
          producto.marca_id = marca.nombre_marca;
        }
      });
    }
  }
  
  

} 
