import { Component, OnInit } from '@angular/core';
import { RestApiService } from './services/rest-api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app-sistema-ventas';
  mostrarBarraNavegacion = false;
  codigoUsuario: string | null = null;

  constructor(
    private restApiService: RestApiService,
    private router: Router) {}

    ngOnInit(): void {

      this.restApiService.isLoggedIn().subscribe((isLoggedIn: boolean) => {
        this.mostrarBarraNavegacion = isLoggedIn;
        // Obtener el código de usuario solo si hay una sesión activa
        this.codigoUsuario = this.restApiService.getCodigoUsuario();  
      });
    }
    

  cerrarSesion(): void {
    // Llamar al método de cerrar sesión del servicio
    this.restApiService.logout();
    // Redirigir al componente de inicio de sesión o a la página de inicio
    this.router.navigate(['/login']);
  }

}
