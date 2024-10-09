import { Component, OnInit, ViewChild } from '@angular/core'; 
import { RestApiService } from '../services/rest-api.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css']
})
export class ClientesComponent implements OnInit {

  nuevoCliente: any = {};
  edicionCliente: any = {};
  @ViewChild('modalEdicion') modalEdicion: any;
  clientes: any = [];

  constructor(
    private modalService: NgbModal,
    public restApi: RestApiService
  ) {}

  ngOnInit(): void {
    this.consultarClientes();
  }

  // Obtener la lista de clientes:
  consultarClientes() {
    return this.restApi.getClientes().subscribe((data: any) => {
      this.clientes = data;
    })
  }

  abrirModalCreate() {

  }

  validarTelefono(telefono: string): boolean {
    const telefonoRegex = /^09\d{8}$/; // Expresión regular para validar el teléfono
    return telefonoRegex.test(telefono);
  }

  addCliente() {
 
    if(this.nuevoCliente && this.nuevoCliente.cedula_cliente && this.nuevoCliente.nombres_cliente 
        && this.nuevoCliente.apellidos_cliente && this.nuevoCliente.direccion && this.nuevoCliente.telefono) {
      if(this.nuevoCliente.cedula_cliente.replace(/\s/g, '').length === 10 
          && this.nuevoCliente.telefono.replace(/\s/g, '').length === 10 ){
        if(this.validarTelefono(this.nuevoCliente.telefono)) {
          // El formulario es válido, puedes realizar la solicitud POST
          this.restApi.createCliente(this.nuevoCliente).subscribe((data: any) =>{
          // Limpiar el formulario después de crear el cliente
          this.nuevoCliente = {}
          // Actualizar la lista de clientes
          this.consultarClientes();
          }); 
        } else {
          alert('El número de teléfono tiene que empezar con 09...')
        }
      } else {  
        alert('La cédula y teléfono deben tener 10 dígitos')
      }            
    } else {
      alert('Complete los campos');
    }
  }

  abrirModalEdicion(cliente: any) {
    // Llamar a la función para obtener el cliente por su ID
    this.restApi.getCategoriaById(cliente.cedula_cliente).subscribe((data: any) =>{

      if (data) {
        this.edicionCliente.cedula_cliente = cliente.cedula_cliente;
        this.edicionCliente.nombres_cliente = cliente.nombres_cliente;
        this.edicionCliente.apellidos_cliente = cliente.apellidos_cliente;
        this.edicionCliente.direccion = cliente.direccion;
        this.edicionCliente.telefono = cliente.telefono;
      } else {
        alert('Cliente no encontrado');
      }
    });
  }

  actualizarCliente() {
    if (window.confirm('Esta seguro que quiere actualizar el dato?')) {

      if(this.edicionCliente && this.edicionCliente.cedula_cliente && this.edicionCliente.nombres_cliente 
        && this.edicionCliente.apellidos_cliente && this.edicionCliente.direccion && this.edicionCliente.telefono) {
        if(this.edicionCliente.cedula_cliente.replace(/\s/g, '').length === 10 
            && this.edicionCliente.telefono.replace(/\s/g, '').length === 10 ) {
          if(this.validarTelefono(this.edicionCliente.telefono)) {
        
            this.restApi.updateCliente(this.edicionCliente.cedula_cliente, this.edicionCliente)
              .subscribe((data: any) =>{
              if (data) {
                // Realizar alguna acción después de la actualización, como cerrar el modal
                alert('Cliente actualizado con éxito');
                // Actualizar la lista de clientes si es necesario
                this.consultarClientes();
                
                this.modalEdicion.dismissAll(); 

              } else {
                alert('Error al actualizar')
              }
            });
          } else {
            alert('El número de teléfono tiene que empezar con 09...')
          }
        } else {
          alert('La cédula y teléfono deben tener 10 dígitos')
        }
      } else {
      alert('Complete todos los campos')  
      }
    }
  }

  eliminarCliente(id:any) {
    if (window.confirm('Esta seguro que desea eliminar el dato?')) {
      this.restApi.deleteCliente(id).subscribe(data => {
        this.consultarClientes();
      })
    }
  }

}
