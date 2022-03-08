import { CuentaCorrienteComponent } from './components/cuenta-corriente/cuenta-corriente.component';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { ArticulosComponent } from './components/articulos/articulos.component';
import { HomeComponent } from './components/home/home.component';
import { ProveedoresComponent } from './components/proveedores/proveedores.component';
import { LoginComponent } from './components/login/login.component';
import { EmpresaComponent } from './components/empresa/empresa.component';
import { ColorPickerModule } from 'ngx-color-picker';
import { HttpClientModule } from '@angular/common/http';
import { UsuarioComponent } from './components/usuario/usuario.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import {
  FormsModule,
  NgSelectOption,
  ReactiveFormsModule,
} from '@angular/forms';
import { LoginService } from './services/login.service';
import { SettingsService } from './services/settings.service';
import { UserService } from './services/user.service';
import { MarcaComponent } from './components/marca/marca.component';
import { RubroComponent } from './components/rubro/rubro.component';
import { LineaComponent } from './components/linea/linea.component';
import { ClientesComponent } from './components/clientes/clientes.component';
import { AlertasComponent } from './components/alertas/alertas.component';
import { VentasComponent } from './components/ventas/ventas.component';
import { ConsultaVentasComponent } from './components/consulta-ventas/consulta-ventas.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { Page404Component } from './components/page404/page404.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { DataTablesModule } from 'angular-datatables';
import { PerfilComponent } from './components/perfil/perfil.component';
import { SucursalComponent } from './components/sucursal/sucursal.component';
import { StockComponent } from './components/stock/stock.component';
import { NgxMaskModule } from 'ngx-mask';
import { SucursalService } from './services/sucursal.service';
import { ListaPrecioComponent } from './components/lista-precio/lista-precio.component';
import { ReporteListaPreciosComponent } from './components/reportes/reporte-lista-precios/reporte-lista-precios.component';
import { ReporteListaStockComponent } from './components/reportes/reporte-lista-stock/reporte-lista-stock.component';
import { StockHistoryComponent } from './components/stock-history/stock-history.component';
import { VentaImpresionComponent } from './components/reportes/venta-impresion/venta-impresion.component';
import { DetalleCuentaCorrienteComponent } from './components/detalle-cuenta-corriente/detalle-cuenta-corriente.component';

@NgModule({
  declarations: [
    AppComponent,
    ArticulosComponent,
    HomeComponent,
    ProveedoresComponent,
    LoginComponent,
    UsuarioComponent,
    EmpresaComponent,
    SucursalComponent,
    CuentaCorrienteComponent,
    DashboardComponent,
    MarcaComponent,
    RubroComponent,
    LineaComponent,
    ClientesComponent,
    AlertasComponent,
    VentasComponent,
    ConsultaVentasComponent,
    Page404Component,
    PerfilComponent,
    StockComponent,
    ReporteListaPreciosComponent,
    ListaPrecioComponent,
    ReporteListaPreciosComponent,
    ReporteListaStockComponent,
    StockHistoryComponent,
    VentaImpresionComponent,
    DetalleCuentaCorrienteComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ColorPickerModule,
    HttpClientModule,

    FormsModule,
    NgSelectModule,
    NgxPaginationModule,
    DataTablesModule,
    ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: 'never' }),
    NgxMaskModule.forRoot(),
  ],
  providers: [
    SettingsService,
    LoginService,
    UserService,
    AlertasComponent,
    SucursalService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
