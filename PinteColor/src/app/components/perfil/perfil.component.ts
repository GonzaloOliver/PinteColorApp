import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ICambioPasswordPerfil } from 'src/app/interfaces/usuarios/cambiopasswordabm.interface';
import { IRoles } from 'src/app/interfaces/usuarios/roles.interface';
import { IUser } from 'src/app/interfaces/usuarios/user.interface';
import { CambioPasswordPerfil } from 'src/app/model/Usuarios/cambiopasswordperfil';
import { Usuario } from 'src/app/model/Usuarios/usuario.model';
import { SettingsService } from 'src/app/services/settings.service';
import { UserService } from 'src/app/services/user.service';
import { AlertasComponent } from '../alertas/alertas.component';
import { AlertasIconos } from '../alertas/alertas_iconos.enum';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css'],
})
export class PerfilComponent implements OnInit {
  objetoUsuarioLogueado: IUser = new Usuario();
  listaRoles: IRoles[] = [];
  objetoChangePassword: ICambioPasswordPerfil = new CambioPasswordPerfil();

  constructor(
    private serviceUser: UserService,
    private alertasComponent: AlertasComponent,
    private settingsService: SettingsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.obtenerUsuarioActual();
    this.listarRoles();
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

  buscarNombreRol(valueRol: String) {
    return this.listaRoles.find((rol) => rol.value == valueRol)?.name;
  }

  listarRoles() {
    this.settingsService.getRoles().subscribe(
      (respuesta) => {
        this.listaRoles = respuesta;
      },
      (error) => {
        this.alertasComponent.showOcurrioErrorStrategy(error);
      }
    );
  }

  modificarPassword() {
    this.serviceUser
      .changePasswordPerfil(
        this.objetoUsuarioLogueado,
        this.objetoChangePassword
      )
      .subscribe(
        () => {
          this.showModalSuccessSave();
          localStorage.removeItem('userToken');
          this.router.navigate(['/login']);
        },
        (error) => {
          this.alertasComponent.showOcurrioErrorStrategy(error);
          this.objetoChangePassword.borrarCampos();
        }
      );
  }

  showModalSuccessSave() {
    this.alertasComponent.showModalInformacion(AlertasIconos.Guardar);
  }
  showModalCancelar() {
    this.alertasComponent.showModalInformacion(AlertasIconos.Cancelar);
  }
  showModalEliminar() {
    this.alertasComponent.showModalInformacion(AlertasIconos.Eliminar);
  }
}
