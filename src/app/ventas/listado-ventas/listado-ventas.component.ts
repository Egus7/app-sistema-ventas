import { Component, OnInit, ViewChild } from '@angular/core';
import { RestApiService } from '../../services/rest-api.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';

@Component({
  selector: 'app-listado-ventas',
  templateUrl: './listado-ventas.component.html',
  styleUrls: ['./listado-ventas.component.css']
})
export class ListadoVentasComponent implements OnInit {

  ventas: any = [];
  clientes: any = [];
  productos: any = [];
  detalleVenta: any = [];
  ventasOriginal: any = []; // Copia de ventas original
  fechaInicio: string = ''; // Guardará la fecha de inicio seleccionada
  fechaFin: string = '';    // Guardará la fecha de fin seleccionada
  mostrarFechas: boolean = false; // Propiedad para mostrar/ocultar campos de fechas
  
  totalVentas: number = 0;

  ivaTotal: number = 0;
  sumaSubtotal: number = 0;
  totalSubtotal: number = 0;

  constructor(
    private modalService: NgbModal,
    public restApi: RestApiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.consultarVentas();
    this.consultarClientes();
  }

  consultarVentas() {
    return this.restApi.getVentas().subscribe((data: any) => {
      // Verifica y formatea el valor de venta.total
      data.forEach((venta: any) => {
        if (typeof venta.total !== 'number') {
          venta.total = parseFloat(venta.total);
        }
      });
  
      this.ventas = data;
      this.calcularTotalVentas();

      // Haz una copia de ventas original cuando lo recibes por primera vez
      this.ventasOriginal = [...data];
    });
  }

  verDetalleVentas(venta: any) {
    return this.restApi.getDetalleVentaById(venta.id_venta).subscribe((data: any) =>{
      this.detalleVenta = data;

      this.calcularTotales();
      this.consultarProductos();

    })
  }

  consultarClientes() {
    return this.restApi.getClientes().subscribe((data: any) => {
      this.clientes = data;

      this.mapearClientes();
    });
  }

  consultarProductos() {
    return this.restApi.getProductos().subscribe((data: any) => {
      this.productos = data;
      this.mapearProductos();
    })
  }

  mapearClientes() {
    if(this.ventas && this.clientes) {
      this.ventas.forEach((venta: any) => {
        const cliente = this.clientes.find((c: any) => c.cedula_cliente === venta.cliente_id);

        if (cliente) {
          venta.id_cliente = venta.cliente_id;
          venta.cliente_id = `${cliente.nombres_cliente} ${cliente.apellidos_cliente}`;
        }
      });
    }
  }

  mapearProductos() {
    if (this.detalleVenta && this.productos) {
      this.detalleVenta.forEach((detalle: any) => {
        const producto = this.productos.find((p: any) => p.id_producto === detalle.producto_id);

        if (producto) {
          detalle.id_producto = detalle.producto_id;
          detalle.producto_id = producto.nombre_producto;
        }
      });
    }
  }

  // Función para calcular los totales
  calcularTotales() {
    // Calcula el sumaSubtotal, ivaTotal y totalSubtotal a partir de los detalles de compra
    this.sumaSubtotal = this.detalleVenta.reduce((total:any, detalle:any) => total + (detalle.precio_unitario * detalle.cantidad), 0);
    this.ivaTotal = this.detalleVenta.reduce((total:any, detalle:any) => total + (detalle.iva ? detalle.precio_unitario * detalle.cantidad * 0.12 : 0), 0);
    this.totalSubtotal = this.sumaSubtotal + this.ivaTotal;
  }
  
  calcularTotalVentas() {
    this.totalVentas = this.ventas.reduce((total:number, venta:any) => total + venta.total, 0);
  }

  filtrarPorFechas() {
    // Si ambas fechas están seleccionadas
    if (this.fechaInicio && this.fechaFin) {
      // Convierte las fechas seleccionadas a objetos Date
      const fechaInicioObj = new Date(this.fechaInicio);
      const fechaFinObj = new Date(this.fechaFin);
  
      // Asegúrate de que la fecha de inicio sea menor o igual que la fecha de fin
      if (fechaInicioObj > fechaFinObj) {
        // Si la fecha de inicio es mayor que la fecha de fin, restablece las fechas
        this.fechaInicio = this.fechaFin;
        // También podrías mostrar un mensaje de error aquí si lo deseas
        alert('La fecha inicio debe ser menor o igual a la fecha de fin ')
      }
      
      // Filtra las ventas original
      this.ventas = this.ventasOriginal.filter((detalle: any) => {
        const fechaDetalle = new Date(detalle.fecha_venta);
        return fechaDetalle >= fechaInicioObj && fechaDetalle <= fechaFinObj;
      });

      // Calcula el total de las ventas filtradas
      this.calcularTotalVentas();

    } else {
      // Si no se han seleccionado ambas fechas, muestra todo el inventario original
      this.ventas = [...this.ventasOriginal];

      // Calcula el total de todas las ventas
      this.calcularTotalVentas();
    }
  }

  mostrarCamposDeFecha() {
    this.mostrarFechas = !this.mostrarFechas;
  }

  limpiarBusqueda() {
    // Restablece las fechas a un estado inicial
    this.fechaInicio = '';
    this.fechaFin = '';
    // Restablece las ventas al estado original
    this.ventas = [...this.ventasOriginal];

    // Calcula el total de todas las ventas
    this.calcularTotalVentas();
  }

}
