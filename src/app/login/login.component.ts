import { Component } from '@angular/core';
import { RestApiService } from '../services/rest-api.service';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  codigo_usuario: string = ''; 
  contrasenia_usuario: string = ''; 
  errorMensaje: string = ''; // Variable para almacenar el mensaje de error
  isLoading: boolean = false;

  constructor(
    private restApiService: RestApiService, 
    private router: Router) {}

    
  login(): void {
    // Verificar si los campos del formulario están llenos
    if (!this.codigo_usuario || !this.contrasenia_usuario) {
      // Manejar el error o mostrar un mensaje al usuario
      alert('Llene los campos');
    }

    // Realizar la solicitud de inicio de sesión usando el servicio
    this.restApiService.login({ codigo_usuario: this.codigo_usuario, contrasenia_usuario: this.contrasenia_usuario })
    .pipe(
      finalize(() => {
        this.isLoading = false;
      })
    )
    .subscribe(
      (response) => {
        this.router.navigate(['/inicio']);
      },
      (error) => {
        // Manejar el error, mostrar un mensaje al usuario, etc.
        this.errorMensaje = 'Usuario o clave incorrecta';
      }
    );  
  }

}