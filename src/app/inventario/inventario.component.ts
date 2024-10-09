import { Component, OnInit, ViewChild } from '@angular/core';
import { RestApiService } from '../services/rest-api.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { format } from 'date-fns';

@Component({
  selector: 'app-inventario',
  templateUrl: './inventario.component.html',
  styleUrls: ['./inventario.component.css']
})
export class InventarioComponent implements OnInit {

  detalleInventario: any = {};
  @ViewChild('modalDetalle') modalDetalle: any;

  inventario: any = [];
  productos: any = [];
  productoBuscado: string = ''; // Campo de búsqueda del producto
  inventarioOriginal: any = []; // Copia del inventario original
  fechaInicio: string = ''; // Guardará la fecha de inicio seleccionada
  fechaFin: string = '';    // Guardará la fecha de fin seleccionada
  mostrarFechas: boolean = false; // Propiedad para mostrar/ocultar campos de fechas
  mostrarProductos: boolean = false;

  constructor(
    private modalService: NgbModal,
    public restApi: RestApiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.consultarInventario();
    this.consultarProductos();
  }

  consultarInventario(){
    return this.restApi.getInventario().subscribe((data: any) => {
      this.inventario = data;
      // Haz una copia del inventario original cuando lo recibes por primera vez
      this.inventarioOriginal = [...data];
    })
  }

  abrirModalDetalle(kardex: any) {
    // Llamar a la función para obtener el kardex por su ID
    this.restApi.getInventarioById(kardex.id_inventario).subscribe((data: any) =>{

      if (data) {
        this.detalleInventario.id_inventario = kardex.id_inventario;
        this.detalleInventario.fecha_inventario = format(new Date(kardex.fecha_inventario), "dd-MM-yyyy HH:mm");
        this.detalleInventario.producto_id = kardex.producto_id;
        this.detalleInventario.cantidad = kardex.cantidad;
        this.detalleInventario.operacion = kardex.operacion;
      } else {
        alert('Kardex no encontrado');
      }
    });
  }

  consultarProductos(){
    return this.restApi.getProductos().subscribe((data: any) => {
      this.productos = data;

      this.mapearProductos();
    })
  }

  mapearProductos() {
    if (this.inventario && this.productos) {
      this.inventario.forEach((detalle: any) => {
        const producto = this.productos.find((p: any) => p.id_producto === detalle.producto_id);

        if (producto) {
          detalle.id_producto = detalle.producto_id;
          detalle.producto_id = producto.nombre_producto;
        }
      });
    }
  }

  filtrarPorProducto() {
    // Si se ha seleccionado un producto para el filtro
    if (this.productoBuscado) {
      // Filtra el inventario original
      this.inventario = this.inventarioOriginal.filter((detalle: any) => detalle.id_producto === this.productoBuscado);
    } else {
      // Si no se ha seleccionado un producto, muestra todo el inventario original
      this.inventario = [...this.inventarioOriginal];
    }
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
      
      // Filtra el inventario original
      this.inventario = this.inventarioOriginal.filter((detalle: any) => {
        const fechaDetalle = new Date(detalle.fecha_inventario);
        return fechaDetalle >= fechaInicioObj && fechaDetalle <= fechaFinObj;
      });
    } else {
      // Si no se han seleccionado ambas fechas, muestra todo el inventario original
      this.inventario = [...this.inventarioOriginal];
    }
  }

  mostrarCamposDeFecha() {
    this.mostrarFechas = !this.mostrarFechas;
  }

  mostrarSelectProductos() {
    this.mostrarProductos = !this.mostrarProductos;
  }

  limpiarBusqueda() {
    // Restablece las fechas a un estado inicial
    this.fechaInicio = '';
    this.fechaFin = '';
    // Restablece el inventario al estado original
    this.inventario = [...this.inventarioOriginal];
  }
  
}
