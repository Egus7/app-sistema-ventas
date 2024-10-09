import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { InicioComponent } from './inicio/inicio.component';


import { HttpClientModule } from '@angular/common/http';
import { InterceptoresService } from './services/interceptores.service';
import { CategoriasComponent } from './categorias/categorias.component';
import { MarcasComponent } from './marcas/marcas.component';
import { ClientesComponent } from './clientes/clientes.component';
import { ProveedoresComponent } from './proveedores/proveedores.component';
import { ComprasComponent } from './compras/compras.component';
import { ConfirmarCompraComponent } from './compras/confirmar-compra/confirmar-compra.component';
import { ListadoComprasComponent } from './compras/listado-compras/listado-compras.component';
import { InventarioComponent } from './inventario/inventario.component';
import { VentasComponent } from './ventas/ventas.component';
import { FacturasComponent } from './facturas/facturas.component';
import { ListadoVentasComponent } from './ventas/listado-ventas/listado-ventas.component';
import { ConfirmarVentaComponent } from './ventas/confirmar-venta/confirmar-venta.component';
import { DetalleFacturasComponent } from './facturas/detalle-facturas/detalle-facturas.component';
import { LoginComponent } from './login/login.component';
import { RegistroUsuarioComponent } from './registro-usuario/registro-usuario.component';
import { AuthguardService } from './services/authguard.service';

@NgModule({
  declarations: [
    AppComponent,
    InicioComponent,
    CategoriasComponent,
    MarcasComponent,
    ClientesComponent,
    ProveedoresComponent,
    ComprasComponent,
    ConfirmarCompraComponent,
    ListadoComprasComponent,
    InventarioComponent,
    VentasComponent,
    FacturasComponent,
    ListadoVentasComponent,
    ConfirmarVentaComponent,
    DetalleFacturasComponent,
    LoginComponent,
    RegistroUsuarioComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    InterceptoresService,
  ],
  providers: [AuthguardService],
  bootstrap: [AppComponent]
})
export class AppModule { }
