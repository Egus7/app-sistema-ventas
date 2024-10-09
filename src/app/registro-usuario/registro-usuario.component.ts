import { Component } from '@angular/core';
import { RestApiService } from '../services/rest-api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registro-usuario',
  templateUrl: './registro-usuario.component.html',
  styleUrls: ['./registro-usuario.component.css']
})
export class RegistroUsuarioComponent {

  nuevoUsuario:any = {
    estado_usuario: true
  };

  constructor(
    private restApiService: RestApiService, 
    private router: Router) {}


  register(): void {
    // Verificar si los campos del formulario están llenos
    if (!this.nuevoUsuario.nombres_usuario || !this.nuevoUsuario.apellidos_usuario || 
          !this.nuevoUsuario.codigo_usuario || !this.nuevoUsuario.contrasenia_usuario) {
      // Manejar el error o mostrar un mensaje al usuario
      alert('Llene todos los campos');
      return;
    }

    // Realizar la solicitud de registro usando el servicio
    this.restApiService.register(this.nuevoUsuario).subscribe((data:any) => {
      this.nuevoUsuario = {};
      this.router.navigate(['/login']);
    });
  }

}
