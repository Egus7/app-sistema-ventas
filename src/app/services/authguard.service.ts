import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { RestApiService } from './rest-api.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthguardService implements CanActivate {
  constructor(private authService: RestApiService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | UrlTree {
    // Verifica si la ruta solicitada existe
    const isRouteExist = this.router.config.some(
      (route) => route.path === next.routeConfig?.path
    );
  
    if (this.authService.isLoggedOn()) {
      // El usuario ha iniciado sesión
  
      // Si la ruta no existe, redirige a la página de inicio
      if (!isRouteExist) {
        return this.router.createUrlTree(['/inicio']);
      }
      
      if(state.url === '/registro-usuario') {
        return this.router.createUrlTree(['/inicio']);
      }
  
      if(state.url === '/login') {
        return this.router.createUrlTree(['/inicio']);
      }

      // Si la ruta existe, permite el acceso a la ruta actual
      return true;
    } else {
      // El usuario no ha iniciado sesión
  
      // Permite el acceso a las rutas de inicio de sesión y registro de usuario
      if (state.url === '/login' || state.url === '/registro-usuario') {
        return true;
      }
  
      // Redirige a la página de inicio de sesión
      return this.router.createUrlTree(['/login']);
    }
  }
  
}

