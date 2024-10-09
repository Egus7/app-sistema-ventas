import { Component, OnInit, ViewChild } from '@angular/core';
import { RestApiService } from '../../services/rest-api.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';

@Component({
  selector: 'app-listado-compras',
  templateUrl: './listado-compras.component.html',
  styleUrls: ['./listado-compras.component.css']
})
export class ListadoComprasComponent implements OnInit {

  compras: any = [];
  proveedores: any = [];
  productos: any = [];
  detalleCompra: any = [];
  comprasOriginal: any = []; // Copia de compras original
  fechaInicio: string = ''; // Guardará la fecha de inicio seleccionada
  fechaFin: string = '';    // Guardará la fecha de fin seleccionada
  mostrarFechas: boolean = false; // Propiedad para mostrar/ocultar campos de fechas
  
  totalCompras: number = 0;

  ivaTotal: number = 0;
  sumaSubtotal: number = 0;
  totalSubtotal: number = 0;

  constructor(
    private modalService: NgbModal,
    public restApi: RestApiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.consultarCompras();
    this.consultarProveedores();
  }

  consultarCompras() {
    return this.restApi.getCompras().subscribe((data: any) => {
      // Verifica y formatea el valor de compra.total
      data.forEach((compra: any) => {
        if (typeof compra.total !== 'number') {
          compra.total = parseFloat(compra.total);
        }
      });
  
      this.compras = data;
      this.calcularTotalCompras();

      // Haz una copia de compras original cuando lo recibes por primera vez
      this.comprasOriginal = [...data];
    });
  }
  
  verDetalleCompras(compra: any) {
    return this.restApi.getDetalleCompraById(compra.id_compra).subscribe((data: any) =>{
      this.detalleCompra = data;

      this.calcularTotales();
      this.consultarProductos();

    })
  }

  consultarProveedores() {
    return this.restApi.getProveedores().subscribe((data: any) => {
      this.proveedores = data;
      this.mapearProveedores();
    });
  }

  consultarProductos() {
    return this.restApi.getProductos().subscribe((data: any) => {
      this.productos = data;
      this.mapearProductos();
    })
  }

  mapearProveedores() {
    if (this.compras && this.proveedores) {
      this.compras.forEach((compra: any) => {
        const proveedor = this.proveedores.find((p: any) => p.id_proveedor === compra.proveedor_id);

        if (proveedor) {
          compra.id_proveedor = compra.proveedor_id;
          compra.proveedor_id = proveedor.nombre_proveedor;
        }
      });
    }
  }

  mapearProductos() {
    if (this.detalleCompra && this.productos) {
      this.detalleCompra.forEach((detalle: any) => {
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
    this.sumaSubtotal = this.detalleCompra.reduce((total:any, detalle:any) => total + (detalle.precio_unitario * detalle.cantidad), 0);
    this.ivaTotal = this.detalleCompra.reduce((total:any, detalle:any) => total + (detalle.iva ? detalle.precio_unitario * detalle.cantidad * 0.12 : 0), 0);
    this.totalSubtotal = this.sumaSubtotal + this.ivaTotal;
  }

  calcularTotalCompras() {
    this.totalCompras = this.compras.reduce((total:number, compra:any) => total + compra.total, 0);
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
      
      // Filtra las compras original
      this.compras = this.comprasOriginal.filter((detalle: any) => {
        const fechaDetalle = new Date(detalle.fecha_compra);
        return fechaDetalle >= fechaInicioObj && fechaDetalle <= fechaFinObj;
      });

      // Calcula el total de las compras filtradas
      this.calcularTotalCompras();

    } else {
      // Si no se han seleccionado ambas fechas, muestra todo el inventario original
      this.compras = [...this.comprasOriginal];

      // Calcula el total de todas las compras
      this.calcularTotalCompras();
    }
  }

  mostrarCamposDeFecha() {
    this.mostrarFechas = !this.mostrarFechas;
  }

  limpiarBusqueda() {
    // Restablece las fechas a un estado inicial
    this.fechaInicio = '';
    this.fechaFin = '';
    // Restablece el inventario al estado original
    this.compras = [...this.comprasOriginal];

    // Calcula el total de todas las compras
    this.calcularTotalCompras();
  }
  
}
