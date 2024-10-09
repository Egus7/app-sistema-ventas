import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegistroUsuarioComponent } from './registro-usuario/registro-usuario.component';
import { InicioComponent } from './inicio/inicio.component';
import { CategoriasComponent } from './categorias/categorias.component';7
import { MarcasComponent } from './marcas/marcas.component';
import { ClientesComponent } from './clientes/clientes.component';
import { ProveedoresComponent } from './proveedores/proveedores.component';
import { ComprasComponent } from './compras/compras.component';
import { ConfirmarCompraComponent } from './compras/confirmar-compra/confirmar-compra.component';
import { ListadoComprasComponent } from './compras/listado-compras/listado-compras.component';
import { InventarioComponent } from './inventario/inventario.component';
import { VentasComponent } from './ventas/ventas.component';
import { ConfirmarVentaComponent } from './ventas/confirmar-venta/confirmar-venta.component';
import { ListadoVentasComponent } from './ventas/listado-ventas/listado-ventas.component';
import { FacturasComponent } from './facturas/facturas.component';
import { DetalleFacturasComponent } from './facturas/detalle-facturas/detalle-facturas.component';
import { AuthguardService } from './services/authguard.service';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent, canActivate: [AuthguardService] },
  { path: 'registro-usuario', component: RegistroUsuarioComponent, canActivate: [AuthguardService] },
  { path: 'inicio', component: InicioComponent, canActivate: [AuthguardService] },
  { path: 'inicio/categoria', component: CategoriasComponent, canActivate: [AuthguardService] },
  { path: 'inicio/marca', component: MarcasComponent, canActivate: [AuthguardService] },
  { path: 'cliente', component: ClientesComponent, canActivate: [AuthguardService] },
  { path: 'proveedor', component: ProveedoresComponent, canActivate: [AuthguardService] },
  { path: 'compra', component: ComprasComponent, canActivate: [AuthguardService] },
  { path: 'confirmar-compra', component: ConfirmarCompraComponent, canActivate: [AuthguardService] },
  { path: 'listado-compras', component: ListadoComprasComponent, canActivate: [AuthguardService] },
  { path: 'inventario', component: InventarioComponent, canActivate: [AuthguardService] },
  { path: 'venta', component: VentasComponent, canActivate: [AuthguardService] },
  { path: 'confirmar-venta', component: ConfirmarVentaComponent, canActivate: [AuthguardService] },
  { path: 'listado-ventas', component: ListadoVentasComponent, canActivate: [AuthguardService] },
  { path: 'factura', component: FacturasComponent, canActivate: [AuthguardService] },
  { path: 'detalle-factura', component: DetalleFacturasComponent, canActivate: [AuthguardService] },
  { path:"**", redirectTo: '/login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
