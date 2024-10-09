import { Component, OnInit, ViewChild } from '@angular/core'; 
import { RestApiService } from '../services/rest-api.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ventas',
  templateUrl: './ventas.component.html',
  styleUrls: ['./ventas.component.css']
})
export class VentasComponent implements OnInit {
  
  listProductos: any = [];
  carritoVenta: any[] = [];

  constructor(
    private modalService: NgbModal,
    public restApi: RestApiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.consultarProductos();

    localStorage.removeItem('carritoVenta');
  }

  consultarProductos(){
    return this.restApi.getProductos().subscribe((data: any) => {
      this.listProductos = data;
    })
  }

  agregarAlCarrito(id_producto: any, nombre_producto: any, precio_unitario: any, iva: any) {
    const cantidadInput = document.querySelector(`#cantidad-${id_producto}`);

    if (cantidadInput) {
      const cantidad = parseInt((cantidadInput as HTMLInputElement).value);


      if (isNaN(cantidad) || cantidad <= 0) {
        alert('La cantidad debe ser un número mayor a 0');
        return;
      }

      const stockDis = this.obtenerStockDelProducto(id_producto);
 
      if (cantidad > stockDis) {
        alert('La cantidad supera el stock disponible');
        return;
      }

      let productoExistente = this.carritoVenta.find(producto => producto.producto_id === id_producto);

      if (productoExistente) {

        // Calculas la cantidad total si se agregará el producto
        const cantidadTotal = productoExistente.cantidad + cantidad; 

        if (cantidadTotal > stockDis) {
          alert('La cantidad supera el stock disponible');
          return;
      }
        //Si el producto ya existe aumentamos su cantidad
        productoExistente.cantidad += cantidad;

      } else {
        let producto = {
          producto_id: id_producto,
          nombre: nombre_producto,
          precio: precio_unitario,
          iva: iva,
          cantidad: cantidad
        };

        this.carritoVenta.push(producto);
      }
      // actualizamos el carrito en el almacenamiento local
      localStorage.setItem('carritoVenta', JSON.stringify(this.carritoVenta));

    } else {
    
    }
  } 

  obtenerStockDelProducto(id_producto: any): number {
    let producto = this.listProductos.find((producto:any) => producto.id_producto === id_producto);
    return producto.stock_producto;
  }


  eliminarDelCarrito(id_producto: any) {
    this.carritoVenta = this.carritoVenta.filter(producto => producto.producto_id !== id_producto);

    // actualizamos el carrito en el almacenamiento local
    localStorage.setItem('carritoVenta', JSON.stringify(this.carritoVenta));
  }

  calcularTotalCarrito() {
    return this.carritoVenta.reduce((total, item) => total + (item.precio * item.cantidad), 0);
  }  
 
  registrarVenta() {
    let carritoStr = localStorage.getItem('carritoVenta');
    if (carritoStr === null) {
      // El elemento 'carrito' no existe en el almacenamiento local, o es nulo
      alert('El carrito está vacío. No puede continuar con la venta.');
      return;
    }
  
    let carrito = JSON.parse(carritoStr);
  
    if (carrito.length === 0) {
      alert('El carrito está vacío. No puede continuar con la venta.');
      return;
    }
  
    // Después de registrar la venta, redirige al usuario a la página de confirmación
    this.router.navigate(['/confirmar-venta']);
  }
}
