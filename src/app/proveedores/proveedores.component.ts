import { Component, OnInit, ViewChild } from '@angular/core'; 
import { RestApiService } from '../services/rest-api.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-proveedores',
  templateUrl: './proveedores.component.html',
  styleUrls: ['./proveedores.component.css']
})
export class ProveedoresComponent implements OnInit {
  nuevoProveedor: any = {};
  edicionProveedor: any = {};
  @ViewChild('modalEdicion') modalEdicion: any;
  proveedores: any = [];

  constructor(
    private modalService: NgbModal,
    public restApi: RestApiService
  ) {}

  ngOnInit(): void {
    this.consultarProveedores();
  }

  // Obtener la lista de proveedores:
  consultarProveedores() {
    return this.restApi.getProveedores().subscribe((data: any) => {
      this.proveedores = data;
    })
  }

  abrirModalCreate() {

  }

  validarTelefono(telefono: string): boolean {
    const telefonoRegex = /^09\d{8}$/; // Expresión regular para validar el teléfono
    return telefonoRegex.test(telefono);
  }

  validarEmail(email: string): boolean {
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/; // Expresión regular para validar el correo electrónico
    return emailRegex.test(email);
  }

  addProveedor() {
 
    if(this.nuevoProveedor && this.nuevoProveedor.ruc_proveedor && this.nuevoProveedor.nombre_proveedor 
        && this.nuevoProveedor.direccion_proveedor && this.nuevoProveedor.telefono_proveedor
        && this.nuevoProveedor.email_proveedor) {
      if(this.nuevoProveedor.ruc_proveedor.replace(/\s/g, '').length === 13 
          && this.nuevoProveedor.telefono_proveedor.replace(/\s/g, '').length === 10 ){
        if(this.validarTelefono(this.nuevoProveedor.telefono_proveedor)) {
          if(this.validarEmail(this.nuevoProveedor.email_proveedor)) {
             // El formulario es válido, puedes realizar la solicitud POST
            this.restApi.createProveedor(this.nuevoProveedor).subscribe((data: any) =>{
              // Limpiar el formulario después de crear el proveedor
              this.nuevoProveedor = {}
              // Actualizar la lista de proveedores
              this.consultarProveedores();
              }); 
          } else {
            alert('Correo electrónico no válido...');
          }
        } else {
          alert('El número de teléfono tiene que empezar con 09...')
        }
      } else {  
        alert('el RUC debe tener 13 dígitos, y teléfono debe tener 10 dígitos')
      }            
    } else {
      alert('Complete los campos');
    }
  }

  abrirModalEdicion(proveedor: any) {
    // Llamar a la función para obtener el proveedor por su ID
    this.restApi.getProveedorById(proveedor.id_proveedor).subscribe((data: any) =>{

      if (data) {
        this.edicionProveedor.id_proveedor = proveedor.id_proveedor;
        this.edicionProveedor.ruc_proveedor = proveedor.ruc_proveedor;
        this.edicionProveedor.nombre_proveedor = proveedor.nombre_proveedor;
        this.edicionProveedor.direccion_proveedor = proveedor.direccion_proveedor;
        this.edicionProveedor.telefono_proveedor = proveedor.telefono_proveedor;
        this.edicionProveedor.email_proveedor = proveedor.email_proveedor;
      } else {
        alert('Proveedor no encontrado');
      }
    });
  }

  actualizarProveedor() {
    if (window.confirm('Esta seguro que quiere actualizar el dato?')) {

      if(this.edicionProveedor && this.edicionProveedor.ruc_proveedor && this.edicionProveedor.nombre_proveedor
        && this.edicionProveedor.direccion_proveedor && this.edicionProveedor.telefono_proveedor 
            && this.edicionProveedor.email_proveedor) {
        if(this.edicionProveedor.ruc_proveedor.replace(/\s/g, '').length === 13 
            && this.edicionProveedor.telefono_proveedor.replace(/\s/g, '').length === 10 ) {
          if(this.validarTelefono(this.edicionProveedor.telefono_proveedor)) {
            if(this.validarEmail(this.edicionProveedor.email_proveedor)) {
              this.restApi.updateProveedor(this.edicionProveedor.id_proveedor, this.edicionProveedor)
              .subscribe((data: any) =>{
                if (data) {
                  // Realizar alguna acción después de la actualización, como cerrar el modal
                  alert('Proveedor actualizado con éxito');
                  // Actualizar la lista de proveedores si es necesario
                  this.consultarProveedores();
                  
                  this.modalEdicion.dismissAll(); 

                } else {
                  alert('Error al actualizar')
                }
              });
            } else {
              alert('Correo electrónico no válido...');
            }      
          } else {
            alert('El número de teléfono tiene que empezar con 09...')
          }
        } else {
          alert('El teléfono debe tener 10 dígitos')
        }
      } else {
      alert('Complete todos los campos')  
      }
    }
  }

  eliminarProveedor(id:any) {
    if (window.confirm('Esta seguro que desea eliminar el dato?')) {
      this.restApi.deleteProveedor(id).subscribe(data => {
        this.consultarProveedores();
      })
    }
  }

}
