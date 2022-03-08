import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IUser } from 'src/app/interfaces/usuarios/user.interface';
import { Usuario } from 'src/app/model/Usuarios/usuario.model';
import { SettingsService } from 'src/app/services/settings.service';
import { UserService } from 'src/app/services/user.service';
import { AlertasComponent } from '../alertas/alertas.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  constructor(
    private router: Router,
    private serviceUser: UserService,
    private alertasComponent: AlertasComponent,
    private settingsService: SettingsService
  ) {}
  objetoUsuarioLogueado: IUser = new Usuario();

  //PERMISOS
  MarcasAllow: boolean = false;
  ClientesAllow: boolean = false;
  ArticulosAllow: boolean = false;
  LineasAllow: boolean = false;
  VentasAllow: boolean = false;
  RubrosAllow: boolean = false;
  EmpresaAllow: boolean = false;
  StockAllow: boolean = false;
  StoresAllow: boolean = false;
  ProveedoresAllow: boolean = false;
  UsuariosAllow: boolean = false;
  ProductosAllow: boolean = true;
  ListaPrecioAllow: boolean = false;

  ComprobantesInternos: boolean;

  ngOnInit(): void {
    this.checkLocalStorage();
    this.obtenerUsuarioActual();
    this.obtenerVentanasUsuarios();
  }

  checkLocalStorage() {
    if (localStorage.getItem('userToken') == null) {
      this.router.navigate(['/login']);
    }
  }

  logoutUser() {
    localStorage.removeItem('userToken');
  }

  obtenerUsuarioActual() {
    this.serviceUser.getPerfilUsuario().subscribe(
      (result) => {
        this.objetoUsuarioLogueado = new Usuario(result);
      },
      (error) => {
        this.alertasComponent.showOcurrioErrorStrategy(error);
      }
    );
  }

  pathComprobantes() {
    this.settingsService.pathComprobantes().subscribe((respuesta) => {
      this.ComprobantesInternos = Boolean(respuesta);
    });
    window.location.reload();
  }

  obtenerVentanasUsuarios() {
    this.settingsService.getPermisosDeUsuario().subscribe(
      (result) => {
        for (var i = 0; i < result.permissions.length; i++) {
          if (
            result.permissions[i].resource == 'CUSTOMERS' &&
            result.permissions[i].grant == true
          ) {
            this.ClientesAllow = true;
          }
          if (
            result.permissions[i].resource == 'PRICELIST' &&
            result.permissions[i].grant == true
          ) {
            this.ListaPrecioAllow = true;
          }
          if (
            result.permissions[i].resource == 'SALES' &&
            result.permissions[i].grant == true
          ) {
            this.VentasAllow = true;
          }
          if (
            result.permissions[i].resource == 'SETTINGS' &&
            result.permissions[i].grant == true
          ) {
            this.EmpresaAllow = true;
          }
          if (
            result.permissions[i].resource == 'STOCK' &&
            result.permissions[i].grant == true
          ) {
            this.StockAllow = true;
          }
          if (
            result.permissions[i].resource == 'STORES' &&
            result.permissions[i].grant == true
          ) {
            this.StoresAllow = true;
          }
          if (
            result.permissions[i].resource == 'SUPPLIERS' &&
            result.permissions[i].grant == true
          ) {
            this.ProveedoresAllow = true;
          }
          if (
            result.permissions[i].resource == 'USERS' &&
            result.permissions[i].grant == true
          ) {
            this.UsuariosAllow = true;
          }
          if (
            result.permissions[i].resource == 'BRANDS' &&
            result.permissions[i].grant == true
          ) {
            this.MarcasAllow = true;
          }
          if (
            result.permissions[i].resource == 'GOODS' &&
            result.permissions[i].grant == true
          ) {
            this.ArticulosAllow = true;
          }
          if (
            result.permissions[i].resource == 'LINES' &&
            result.permissions[i].grant == true
          ) {
            this.LineasAllow = true;
          }
          if (
            result.permissions[i].resource == 'SECTORS' &&
            result.permissions[i].grant == true
          ) {
            this.RubrosAllow = true;
          }
        }
      },
      (error) => {
        this.alertasComponent.showOcurrioErrorStrategy(error);
      }
    );
  }
}
