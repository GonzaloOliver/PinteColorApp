import { CuentaCorrienteComponent } from './components/cuenta-corriente/cuenta-corriente.component';
import { StockHistoryComponent } from './components/stock-history/stock-history.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ArticulosComponent } from './components/articulos/articulos.component';
import { ProveedoresComponent } from './components/proveedores/proveedores.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { ClientesComponent } from './components/clientes/clientes.component';
import { EmpresaComponent } from './components/empresa/empresa.component';
import { UsuarioComponent } from './components/usuario/usuario.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { MarcaComponent } from './components/marca/marca.component';
import { RubroComponent } from './components/rubro/rubro.component';
import { LineaComponent } from './components/linea/linea.component';
import { VentasComponent } from './components/ventas/ventas.component';
import { ConsultaVentasComponent } from './components/consulta-ventas/consulta-ventas.component';
import { Page404Component } from './components/page404/page404.component';
import { PerfilComponent } from './components/perfil/perfil.component';
import { SucursalComponent } from './components/sucursal/sucursal.component';
import { ReporteListaPreciosComponent } from './components/reportes/reporte-lista-precios/reporte-lista-precios.component';
import { StockComponent } from './components/stock/stock.component';
import { ListaPrecioComponent } from './components/lista-precio/lista-precio.component';
import { ReporteListaStockComponent } from './components/reportes/reporte-lista-stock/reporte-lista-stock.component';
import { VentaImpresionComponent } from './components/reportes/venta-impresion/venta-impresion.component';
import { DetalleCuentaCorrienteComponent } from './components/detalle-cuenta-corriente/detalle-cuenta-corriente.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'home', redirectTo: '/home/dashboard', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: 'home',
    component: HomeComponent,
    children: [
      { path: 'articulos', component: ArticulosComponent },
      { path: 'clientes', component: ClientesComponent },
      { path: 'cuenta-corriente', component: CuentaCorrienteComponent },
      {
        path: 'detalle-cuenta-corriente/:id',
        component: DetalleCuentaCorrienteComponent,
      },
      { path: 'empresa', component: EmpresaComponent },
      { path: 'usuarios', component: UsuarioComponent },
      { path: 'marca', component: MarcaComponent },
      { path: 'rubro', component: RubroComponent },
      { path: 'linea', component: LineaComponent },
      { path: 'ventas', component: VentasComponent },
      { path: 'movStock', component: StockHistoryComponent },
      { path: 'stock', component: StockComponent },
      {
        path: 'consulta-ventas',
        component: ConsultaVentasComponent,
      },
      { path: 'proveedores', component: ProveedoresComponent },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'proveedores', component: ProveedoresComponent },
      { path: 'perfil', component: PerfilComponent },
      { path: 'sucursal', component: SucursalComponent },
      { path: 'listas-de-precios', component: ListaPrecioComponent },
      { path: 'reporte-lista-precio', component: ReporteListaPreciosComponent },
      { path: 'reporte-lista-stock', component: ReporteListaStockComponent },
      { path: 'impresion-comprobante/:id', component: VentaImpresionComponent },
      { path: 'error404', component: Page404Component },
    ],
  },
  { path: '**', redirectTo: 'home/error404' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
