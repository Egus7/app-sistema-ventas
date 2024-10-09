import { NgModule } from '@angular/core';
import { RestApiService } from './rest-api.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

@NgModule({
  providers: [
    RestApiService,
    // Registra el interceptor aquí
    {
      provide: HTTP_INTERCEPTORS,
      useClass: RestApiService, // Asegúrate de tener el nombre correcto del servicio
      multi: true,
    },
  ],
})

export class InterceptoresService {}
