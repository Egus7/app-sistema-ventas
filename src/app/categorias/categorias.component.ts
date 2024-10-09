import { Component, OnInit, ViewChild } from '@angular/core'; 
import { RestApiService } from '../services/rest-api.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-categorias',
  templateUrl: './categorias.component.html',
  styleUrls: ['./categorias.component.css']
})
export class CategoriasComponent implements OnInit {
  nuevaCategoria: any = {};
  edicionCategoria: any = {};
  @ViewChild('modalEdicion') modalEdicion: any;
  categorias: any = [];

  constructor(
    private modalService: NgbModal,
    public restApi: RestApiService
  ) {}

  ngOnInit(): void {
    this.consultarCategorias();
  }

  // Obtener la lista de categorias:
  consultarCategorias() {
    return this.restApi.getCategorias().subscribe((data: any) => {
      this.categorias = data;
    })
  }

  abrirModalCreate() {

  }

  addCategoria() {

    if(this.nuevaCategoria && this.nuevaCategoria.nombre_cat) {
      // El formulario es válido, puedes realizar la solicitud POST
      this.restApi.createCategoria(this.nuevaCategoria).subscribe((data: any) =>{
      // Limpiar el formulario después de crear la categoria
      this.nuevaCategoria = {};
      // Actualizar la lista de categorias
      this.consultarCategorias();
      });
    } else {
      alert('Complete el campo');
    }
  }

  abrirModalEdicion(categoria: any) {
    // Llamar a la función para obtener la categoria por su ID
    this.restApi.getCategoriaById(categoria.id_cat).subscribe((data: any) =>{

      if (data) {
        this.edicionCategoria.id_cat = categoria.id_cat;
        this.edicionCategoria.nombre_cat = categoria.nombre_cat;
      } else {
        alert('Categoría no encontrada');
      }
    });
  }

  actualizarCategoria() {
    if (window.confirm('Esta seguro que quiere actualizar el dato?')) {

      if(this.edicionCategoria && this.edicionCategoria.nombre_cat) {

        this.restApi.updateCategoria(this.edicionCategoria.id_cat, this.edicionCategoria)
          .subscribe((data: any) =>{
          if (data) {
            // Realizar alguna acción después de la actualización, como cerrar el modal
            alert('Categoría actualizada con éxito');
            // Actualizar la lista de categorias si es necesario
            this.consultarCategorias();
            
            this.modalEdicion.dismissAll(); 

          } else {
            alert('Error al actualizar')
          }
        });
      } else {
        alert('Complete el campo');
      }
    }
  }

  eliminarCategoria(id:any) {
    if (window.confirm('Esta seguro que desea eliminar el dato?')) {
      this.restApi.deleteCategoria(id).subscribe(data => {
        this.consultarCategorias();
      })
    }
  }

}
