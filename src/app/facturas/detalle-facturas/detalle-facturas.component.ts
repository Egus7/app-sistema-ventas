import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RestApiService } from '../../services/rest-api.service';  // Ajusta la ruta según tu estructura

@Component({
  selector: 'app-detalle-facturas',
  templateUrl: './detalle-facturas.component.html',
  styleUrls: ['./detalle-facturas.component.css']
})
export class DetalleFacturasComponent implements OnInit {

  @Input() numeroFactura: string | null = null;
  factura: any = {};

  constructor(  
    private route: ActivatedRoute, 
    private restApi: RestApiService

  ) { }
    
  ngOnInit(): void {
    // Obtén el número de factura de los parámetros de la URL
    this.numeroFactura = this.route.snapshot.queryParams['numeroFactura'];
    this.consultarDetallesFactura();
  }
  

  consultarDetallesFactura() {
    this.restApi.getDetalleFacturaCabById(this.numeroFactura).subscribe((data: any) =>{
      this.factura = data; 
    });
  }
}
