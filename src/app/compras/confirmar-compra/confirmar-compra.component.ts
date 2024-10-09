import { Component, OnInit, ViewChild } from '@angular/core'; 
import { RestApiService } from '../../services/rest-api.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { DateTime } from 'luxon';

@Component({
  selector: 'app-confirmar-compra',
  templateUrl: './confirmar-compra.component.html',
  styleUrls: ['./confirmar-compra.component.css']
})
export class ConfirmarCompraComponent implements OnInit {

  nuevaCompra:any = {};

  proveedores: any = [];
  detallesCompra: any[] = []; // Inicializa como un arreglo vacío

  totalCompra: number = 0;
  ivaTotal: number = 0;
  sumaSubtotal: number = 0;

  constructor(
    private modalService: NgbModal,
    public restApi: RestApiService,
    private router: Router
  ) {
    // Recupera los productos del carrito desde localStorage
    const carritoStr = localStorage.getItem('carrito');
    if (carritoStr) {
      const carrito = JSON.parse(carritoStr);

      // Crea los detalles de compra a partir de los productos del carrito
      this.detallesCompra = carrito.map((producto:any) => {
        return {
          producto_id: producto.producto_id,
          nombre: producto.nombre,
          cantidad: producto.cantidad,
          precio_unitario: producto.precio,
          iva: producto.iva,
          subtotal: producto.precio * producto.cantidad
        };
      });
      // Calcula el total de la compra a partir de los detalles
      this.sumaSubtotal = this.detallesCompra.reduce((total, detalle) => total + detalle.subtotal, 0);
      this.ivaTotal = this.detallesCompra.reduce((total, detalle) => total + (detalle.iva ? detalle.subtotal * 0.12 : 0), 0);
      this.totalCompra = this.sumaSubtotal + this.ivaTotal;
    }

    // Obtiene la fecha y hora actual utilizando Luxon y formatea en el formato adecuado para el input datetime-local
    this.nuevaCompra.fecha_compra = DateTime.now().toFormat("yyyy-MM-dd'T'HH:mm");
  }

  ngOnInit(): void {
    // Aquí puedes realizar cualquier otra lógica necesaria.
    this.consultarProveedores();
  }

  consultarProveedores() {
    return this.restApi.getProveedores().subscribe((data: any) => {
      this.proveedores = data;
    })
  }

  addCompra(){
    if(this.nuevaCompra && this.nuevaCompra.fecha_compra && this.nuevaCompra.proveedor_id) {

      const compra = {
        fecha_compra: this.nuevaCompra.fecha_compra,
        proveedor_id: this.nuevaCompra.proveedor_id,
        total: this.totalCompra, // Debe ser el total calculado en tu componente.
        detalles: this.detallesCompra
      };
      // El formulario es válido, puedes realizar la solicitud POST
      this.restApi.createCompra(compra).subscribe((data:any) =>{
        // Limpiar el formulario después de crear la compra
        this.nuevaCompra = {};
        // Actualizar la lista de compras
        this.restApi.getProductos();
        alert('Compra registrada');
        // Redirigir a la página de inicio
        this.router.navigate(['../inicio']);

      });
    } else {
      alert('Complete los campos');
    }

  }

}
