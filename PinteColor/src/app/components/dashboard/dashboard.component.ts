import { environment } from 'src/environments/environment';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ICliente } from 'src/app/interfaces/cliente.interface';
import { IUser } from 'src/app/interfaces/usuarios/user.interface';
import { ClienteService } from 'src/app/services/cliente.service';
import { ProveedorService } from 'src/app/services/proveedor.service';
import { UserService } from 'src/app/services/user.service';
import { ArticuloService } from 'src/app/services/articulo.service';
import { Usuario } from 'src/app/model/Usuarios/usuario.model';
import { AlertasComponent } from '../alertas/alertas.component';
import { SettingsService } from 'src/app/services/settings.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  listaUsuarios: IUser[] = [];
  listaClientes: ICliente[] = [];
  totalItems: number = 10;
  page: number = 1;
  itemsPage: number = 5;
  ProveedoresAllow: boolean = false;
  objetoUsuarioLogueado: IUser = new Usuario();

  cantidadUsuarios: number = 0;
  cantidadArticulos: number = 0;
  cantidadClientes: number = 0;
  cantidadProveedores: number = 0;

  constructor(
    private router: Router,
    private serviceUsuario: UserService,
    private serviceCliente: ClienteService,
    private serviceProveedores: ProveedorService,
    private alertasComponent: AlertasComponent,
    private serviceArticulos: ArticuloService,
    private settingsService: SettingsService
  ) {}

  ngOnInit(): void {
    this.listarUsuarios();
    this.listarClientes();
    this.listarProveedores();
    this.listarArticulos();
    this.obtenerUsuarioActual();
    this.obtenerVentanasUsuarios();
  }

  obtenerUsuarioActual() {
    this.serviceUsuario.getPerfilUsuario().subscribe(
      (result) => {
        this.objetoUsuarioLogueado = new Usuario(result);
      },
      (error) => {
        this.alertasComponent.showOcurrioErrorStrategy(error);
      }
    );
  }

  obtenerVentanasUsuarios() {
    this.settingsService.getPermisosDeUsuario().subscribe(
      (result) => {
        for (var i = 0; i < result.permissions.length; i++) {
          if (
            result.permissions[i].resource == 'SUPPLIERS' &&
            result.permissions[i].grant == true
          ) {
            this.ProveedoresAllow = true;
          }
        }
      },
      (error) => {
        this.alertasComponent.showOcurrioErrorStrategy(error);
      }
    );
  }

  listarUsuarios() {
    this.serviceUsuario
      .getUsersPaginado(this.itemsPage, this.page, '', '', '')
      .subscribe((respuestausuarios) => {
        this.cantidadUsuarios = respuestausuarios.meta.totalItems;
      });
  }

  listarClientes() {
    this.serviceCliente
      .getClientesPaginado(this.itemsPage, this.page, '', '', '', '')
      .subscribe((respuestaclientes) => {
        this.cantidadClientes = respuestaclientes.meta.totalItems;
      });
  }

  listarProveedores() {
    this.serviceProveedores
      .getProveedoresPaginado(this.itemsPage, this.page, '', '', '')
      .subscribe((respuestaproveedores) => {
        this.cantidadProveedores = respuestaproveedores.meta.totalItems;
      });
  }

  listarArticulos() {
    this.serviceArticulos
      .getArticulosPaginado(this.itemsPage, this.page)
      .subscribe((respuestaarticulos) => {
        this.cantidadArticulos = respuestaarticulos.meta.totalItems;
      });
  }
}
