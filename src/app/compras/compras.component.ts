import { Component, OnInit, ViewChild } from '@angular/core'; 
import { RestApiService } from '../services/rest-api.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';

@Component({
  selector: 'app-compras',
  templateUrl: './compras.component.html',
  styleUrls: ['./compras.component.css']
})

export class ComprasComponent implements OnInit {

  listProductos: any = [];
  carrito: any[] = [];

  constructor(
    private modalService: NgbModal,
    public restApi: RestApiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.consultarProductos();

    localStorage.removeItem('carrito');
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

      let productoExistente = this.carrito.find(producto => producto.producto_id === id_producto);

      if (productoExistente) {
        productoExistente.cantidad += cantidad;
      } else {
        let producto = {
          producto_id: id_producto,
          nombre: nombre_producto,
          precio: precio_unitario,
          iva: iva,
          cantidad: cantidad
        };
        this.carrito.push(producto);
      }
      // actualizamos el carrito en el almacenamiento local
      localStorage.setItem('carrito', JSON.stringify(this.carrito));
      

    } else {

    }
  }

  eliminarDelCarrito(id_producto: any) {
    this.carrito = this.carrito.filter(producto => producto.producto_id !== id_producto);

    // actualizamos el carrito en el almacenamiento local
    localStorage.setItem('carrito', JSON.stringify(this.carrito));
  }
  
  calcularTotalCarrito() {
    return this.carrito.reduce((total, item) => total + (item.precio * item.cantidad), 0);
  }  
 
  registrarCompra() {
    let carritoStr = localStorage.getItem('carrito');
    if (carritoStr === null) {
      // El elemento 'carrito' no existe en el almacenamiento local, o es nulo
      alert('El carrito está vacío. No puede continuar con la compra.');
      return;
    }
  
    let carrito = JSON.parse(carritoStr);
  
    if (carrito.length === 0) {
      alert('El carrito está vacío. No puede continuar con la compra.');
      return;
    }
  
    // Después de registrar la compra, redirige al usuario a la página de confirmación
    this.router.navigate(['/confirmar-compra']);
  }

}
