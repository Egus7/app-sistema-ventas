import { Component, OnInit, ViewChild } from '@angular/core'; 
import { RestApiService } from '../../services/rest-api.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { DateTime } from 'luxon';

@Component({
  selector: 'app-confirmar-venta',
  templateUrl: './confirmar-venta.component.html',
  styleUrls: ['./confirmar-venta.component.css']
})
export class ConfirmarVentaComponent implements OnInit {

  nuevaVenta:any = {};
  nuevaFactura: any = {};

  clientes: any = [];
  productos: any = [];
  detallesVenta: any[] = []; // Inicializa como un arreglo vacío

  totalVenta: number = 0;
  ivaTotal: number = 0;
  sumaSubtotal: number = 0;

  constructor(
    private modalService: NgbModal,
    public restApi: RestApiService,
    private router: Router
  ) {
    // Recupera los productos del carrito desde localStorage
    const carritoStr = localStorage.getItem('carritoVenta');
    if (carritoStr) {
      const carrito = JSON.parse(carritoStr);

      // Crea los detalles de venta a partir de los productos del carrito
      this.detallesVenta = carrito.map((producto:any) => {
        return {
          producto_id: producto.producto_id,
          nombre: producto.nombre,
          cantidad: producto.cantidad,
          precio_unitario: producto.precio,
          iva: producto.iva,
          subtotal: producto.precio * producto.cantidad
        };
      });
      // Calcula el total de la venta a partir de los detalles
      this.sumaSubtotal = this.detallesVenta.reduce((total, detalle) => total + detalle.subtotal, 0);
      this.ivaTotal = this.detallesVenta.reduce((total, detalle) => total + (detalle.iva ? detalle.subtotal * 0.12 : 0), 0);
      this.totalVenta = this.sumaSubtotal + this.ivaTotal;
    }

    // Obtiene la fecha y hora actual utilizando Luxon y formatea en el formato adecuado para el input datetime-local
    this.nuevaVenta.fecha_venta = DateTime.now().toFormat("yyyy-MM-dd'T'HH:mm");
  }

  ngOnInit(): void {
    // Aquí puedes realizar cualquier otra lógica necesaria.
    this.consultarClientes();
    this.consultarProductos();
  }

  consultarClientes() {
    return this.restApi.getClientes().subscribe((data: any) => {
      this.clientes = data;
    })
  }

  consultarProductos() {
    return this.restApi.getProductos().subscribe((data: any) => {
      this.productos = data;
    })
  }

  // Método para confirmar la venta
  confirmarVenta() {

    if(this.nuevaVenta && this.nuevaVenta.fecha_venta && this.nuevaVenta.cliente_id 
          && this.nuevaVenta.forma_pago) {

      const opcion = confirm('¿Desea emitir la venta con factura?');

      if (opcion) {
        // Si el usuario confirma, llama a la función para emitir la venta con factura
        this.emitirVentaConFactura();
        // tambien se agrega la venta
        this.addVenta();

        // Redirigir a la página de factura
        this.router.navigate(['../factura']);
      } else {
        // Si el usuario no confirma, continúa con la lógica de agregar la venta sin factura
        this.addVenta();
        // Redirigir a la página de inicio
        this.router.navigate(['../inicio']);
        // Actualizar la lista de productos
        this.consultarProductos();
      }
  } else {
    alert('Complete todos los campos');
  }
}

  // Método para emitir la venta con factura
  emitirVentaConFactura() {
    // Aquí puedes agregar la lógica para crear la factura
    // Puedes usar variables locales para almacenar los detalles de la factura
    const facturaDetalles = this.detallesVenta.map(detalle => ({
      producto_id: detalle.producto_id,
      cantidad: detalle.cantidad,
      precio_unitario: detalle.precio_unitario,
      iva: detalle.iva,
      subtotal: detalle.subtotal
    }));

    // Puedes calcular los totales de la factura
    const facturaSubtotal = this.sumaSubtotal;
    const facturaIva = this.ivaTotal;
    const facturaTotal = this.totalVenta;

    // Registra la factura 
    const factura = {
      fecha_emision: this.nuevaVenta.fecha_venta, // Utiliza la fecha de la venta o la fecha deseada
      cliente_id: this.nuevaVenta.cliente_id,
      forma_pago: this.nuevaVenta.forma_pago,
      total: facturaTotal,
      detalles: facturaDetalles
    };

    // El formulario es válido, puedes realizar la solicitud POST
    this.restApi.createFactura(factura).subscribe((data: any) => {
      // Limpiar el formulario después de crear la venta
      this.nuevaVenta = {};
      // Actualizar la lista de ventas
      this.restApi.getProductos();
      alert('Factura registrada');

    });
  }

  addVenta() {
    if (this.nuevaVenta && this.nuevaVenta.fecha_venta
      && this.nuevaVenta.cliente_id && this.nuevaVenta.forma_pago) {

      const venta = {
        fecha_venta: this.nuevaVenta.fecha_venta,
        cliente_id: this.nuevaVenta.cliente_id,
        forma_pago: this.nuevaVenta.forma_pago,
        total: this.totalVenta, // Debe ser el total calculado en tu componente.
        detalles: this.detallesVenta
      };
      // El formulario es válido, puedes realizar la solicitud POST
      this.restApi.createVenta(venta).subscribe((data: any) => {
        // Limpiar el formulario después de crear la venta
        this.nuevaVenta = {};
        alert('Venta registrada');
        // Actualizar la lista de productos
        this.consultarProductos();
      });
    } else {
      alert('Complete los campos');
    }
  }

}
