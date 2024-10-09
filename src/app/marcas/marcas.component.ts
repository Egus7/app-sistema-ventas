import { Component, OnInit, ViewChild } from '@angular/core'; 
import { RestApiService } from '../services/rest-api.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-marcas',
  templateUrl: './marcas.component.html',
  styleUrls: ['./marcas.component.css']
})
export class MarcasComponent implements OnInit {
  nuevaMarca: any = {};
  edicionMarca: any = {};
  @ViewChild('modalEdicion') modalEdicion: any;
  marcas: any = [];

  constructor( 
    private modalService: NgbModal,
    public restApi: RestApiService
  ) {}

  ngOnInit(): void {
    this.consultarMarcas()
  }

  /** Obtener el listado de marcas: */
  consultarMarcas(){
    return this.restApi.getMarcas().subscribe((data:any) =>{
      this.marcas = data;
    })
  }

  abrirModalCreate() {
   
  }

  addMarca() {
    if (this.nuevaMarca && this.nuevaMarca.nombre_marca) {
      // El formulario es válido, puedes realizar la solicitud POST
      this.restApi.createMarca(this.nuevaMarca).subscribe((data:any) =>{
        // Limpiar el formulario después de crear la marca
        this.nuevaMarca = {};
        // Actualizar la lista de marcas
        this.consultarMarcas();
      });
    } else {
      alert('Complete el campo');
    }
  }

  abrirModalEdicion(marca: any) {
    // Llamar a la función para obtener la categoria por su ID
    this.restApi.getMarcaById(marca.id_marca).subscribe((data: any) =>{

      if (data) {
        this.edicionMarca.id_marca = marca.id_marca;
        this.edicionMarca.nombre_marca = marca.nombre_marca;
      } else {
        alert('Marca no encontrada');
      }
    });
  }

  actualizarMarca() {
    if (window.confirm('Esta seguro que quiere actualizar el dato?')) {

      if (this.edicionMarca && this.edicionMarca.nombre_marca) {

        this.restApi.updateMarca(this.edicionMarca.id_marca, this.edicionMarca)
          .subscribe((data: any) =>{
          if (data) {
            // Realizar alguna acción después de la actualización, como cerrar el modal
            alert('Marca actualizada con éxito');
            // Actualizar la lista de marcas si es necesario
            this.consultarMarcas();
            
            this.modalEdicion.dismissAll(); 

          } else {
            alert('Error al actualizar')
          }
        });
      } else {
        alert('Complete el campo')
      }
    }
  }

  eliminarMarca(id:any) {
    if (window.confirm('Esta seguro que desea eliminar el dato?')) {
      this.restApi.deleteMarca(id).subscribe(data => {
        this.consultarMarcas();
      })
    }
  }

}
