import { Component, OnInit, ViewChild } from '@angular/core';
import { RestApiService } from '../services/rest-api.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';

@Component({
  selector: 'app-facturas',
  templateUrl: './facturas.component.html',
  styleUrls: ['./facturas.component.css']
})
export class FacturasComponent implements OnInit {

  facturas: any = [];
  clientes: any = [];

  facturasOriginal: any = []; // Copia de facturas original
  fechaInicio: string = ''; // Guardará la fecha de inicio seleccionada
  fechaFin: string = '';    // Guardará la fecha de fin seleccionada
  mostrarFechas: boolean = false; // Propiedad para mostrar/ocultar campos de fechas

  totalFacturas: number = 0;

  constructor(
    private modalService: NgbModal,
    public restApi: RestApiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.consultarFacturas();
    this.consultarClientes();
  }

  consultarFacturas() {
    return this.restApi.getFacturas().subscribe((data: any) => {
      // Verifica y formatea el valor de factura.total
      data.forEach((factura: any) => {
        if (typeof factura.total !== 'number') {
          factura.total = parseFloat(factura.total);
        }
      });
      this.facturas = data;

      this.calcularTotalFacturas();

      // Haz una copia de compras original cuando lo recibes por primera vez
      this.facturasOriginal = [...data];
    });
  }

  calcularTotalFacturas() {
    this.totalFacturas = this.facturas.reduce((total:number, factura:any) => total + factura.total, 0);
  }

  consultarClientes() {
    return this.restApi.getClientes().subscribe((data: any) => {
      this.clientes = data;

      this.mapearClientes();
    });
  }

  mapearClientes() {
    if(this.facturas && this.clientes) {
      this.facturas.forEach((factura: any) => {
        const cliente = this.clientes.find((c: any) => c.cedula_cliente === factura.cliente_id);

        if (cliente) {
          factura.id_cliente = factura.cliente_id;
          factura.cliente_id = `${cliente.nombres_cliente} ${cliente.apellidos_cliente}`;

        }
      });
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
      
      // Filtra las facturas original
      this.facturas = this.facturasOriginal.filter((detalle: any) => {
        const fechaDetalle = new Date(detalle.fecha_emision);
        return fechaDetalle >= fechaInicioObj && fechaDetalle <= fechaFinObj;
      });

      this.calcularTotalFacturas();  

    } else {
      // Si no se han seleccionado ambas fechas, muestra todo el inventario original
      this.facturas = [...this.facturasOriginal];

      this.calcularTotalFacturas();
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
    this.facturas = [...this.facturasOriginal];

    this.calcularTotalFacturas();
  }

  verDetalleFactura(numeroFactura: number) {
    // Navega a la página de detalle de factura con el número de factura como parámetro
    this.router.navigate(['../detalle-factura'], { queryParams: 
        { numeroFactura: numeroFactura.toString() } 
    });
  }

}
