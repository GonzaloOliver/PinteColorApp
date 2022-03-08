import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SettingsService } from 'src/app/services/settings.service';
import { UserService } from 'src/app/services/user.service';
import { IUser } from 'src/app/interfaces/usuarios/user.interface';
import { AlertasComponent } from 'src/app/components/alertas/alertas.component';
import { AlertasIconos } from '../alertas/alertas_iconos.enum';
import {
  FormsModule,
  FormGroup,
  Validators,
  FormBuilder,
  FormControl,
} from '@angular/forms';
import Swal from 'sweetalert2';
import { IRoles } from 'src/app/interfaces/usuarios/roles.interface';
import { Usuario } from 'src/app/model/Usuarios/usuario.model';
import { CambioPasswordAbm } from 'src/app/model/Usuarios/cambiopasswordabm.model';
import { ICambioPasswordAbm } from 'src/app/interfaces/usuarios/cambiopasswordperfil.interface';
import { AbstractControl } from '@angular/forms';
import { ISucursal } from 'src/app/interfaces/sucursal.interface';
import { SucursalService } from 'src/app/services/sucursal.service';

declare var $: any;
@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css'],
})
export class UsuarioComponent implements OnInit {
  public contactFormulario: FormGroup;
  public contactFormulario1: FormGroup;

  filtroBusquedaNombre: string = '';
  filtroBusquedaApellido: string = '';
  filtroBusquedaUsuario: string = '';

  esObjetoNuevo: boolean = false;
  listaUsuarios: IUser[] = [];
  listaRoles: IRoles[] = [];
  listaSucursal: ISucursal[] = [];
  page: number = 1;
  itemsPage: number = 5;
  totalItems: number = 0;
  cantidadItems: number = 0;
  objetoUsuario: IUser = new Usuario();
  objetoChangePassword: ICambioPasswordAbm = new CambioPasswordAbm();

  constructor(
    private router: Router,
    private serviceUser: UserService,
    private settingsService: SettingsService,
    private alertasComponent: AlertasComponent,
    private serviceSucursal: SucursalService
  ) {
    this.contactFormulario = this.createForm();
    this.contactFormulario1 = this.createForm2();
  }

  get name() {
    return this.contactFormulario.get('name');
  }
  get apellido() {
    return this.contactFormulario.get('apellido');
  }
  get usuario() {
    return this.contactFormulario.get('usuario');
  }
  get password() {
    return this.contactFormulario.get('password');
  }
  get password_confirm() {
    return this.contactFormulario.get('password_confirm');
  }

  get roles() {
    return this.contactFormulario.get('roles');
  }

  get sucursal() {
    return this.contactFormulario.get('sucursal');
  }

  get password_confirm1() {
    return this.contactFormulario1.get('password_confirm1');
  }
  get password1() {
    return this.contactFormulario1.get('password1');
  }

  ngOnInit(): void {
    this.listarRoles();
    this.listarUsuarios();
    this.listarSucursales();
    this.contactFormulario.valueChanges.subscribe((change) => {
      if (change.password !== change.password_confirm) {
        this.contactFormulario
          .get('password_confirm')
          ?.setErrors({ isError: true });
      } else if (change.password === '') {
        //this is needed in case the user empties both fields, else it would
        //say they matched and therefore it's valid - the custom validator will
        //not pick up on this edge case
        this.contactFormulario
          .get('password_confirm')
          ?.setErrors({ isError: true });
      } else if (change.password === change.password_confirm) {
        //this removes the previously set errors
        this.contactFormulario.get('password_confirm')?.setErrors(null);
      }
    });
    this.contactFormulario1.valueChanges.subscribe((change) => {
      if (change.password1 !== change.password_confirm1) {
        this.contactFormulario1
          .get('password_confirm1')
          ?.setErrors({ isError: true });
      } else if (change.password1 === '') {
        //this is needed in case the user empties both fields, else it would
        //say they matched and therefore it's valid - the custom validator will
        //not pick up on this edge case

        this.contactFormulario1
          .get('password_confirm1')
          ?.setErrors({ isError: true });
      } else if (change.password1 === change.password_confirm1) {
        //this removes the previously set errors
        this.contactFormulario1.get('password_confirm1')?.setErrors(null);
      }
    });
  }

  notDefaultValidator(control: AbstractControl) {
    // in my case I set the default value to an empty string
    if (control.value === '') {
      return { isError: true };
    } else {
      return null;
    }
  }

  notDefaultValidator1(control1: AbstractControl) {
    // in my case I set the default value to an empty string
    if (control1.value === '') {
      return { isError: true };
    } else {
      return null;
    }
  }

  createForm() {
    return new FormGroup({
      name: new FormControl('', [Validators.required, Validators.minLength(3)]),
      apellido: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
      ]),
      usuario: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
      ]),
      roles: new FormControl('', [
        Validators.required,
        Validators.nullValidator,
      ]),
      sucursal: new FormControl('', [
        Validators.required,
        Validators.nullValidator,
      ]),

      //the custom validator is used here
      password_confirm: new FormControl('', this.notDefaultValidator),
    });
  }

  createForm2() {
    return new FormGroup({
      password1: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
      ]),
      //the custom validator is used here
      password_confirm1: new FormControl('', this.notDefaultValidator1),
    });
  }

  onResetForm2(): void {
    this.contactFormulario1.reset();
  }

  onResetForm(): void {
    this.contactFormulario.reset();
  }

  onSaveForm(): void {
    if (this.contactFormulario.valid) {
      this.onResetForm();
    }
  }

  onSaveForm2(): void {
    if (this.contactFormulario1.valid) {
      this.onResetForm2();
    }
  }

  /*   CRUD USUARIOS     */

  guardarUsuario() {
    this.objetoUsuario.store.id = Number(
      this.listaSucursal.find(
        (sucu) => sucu.name == this.objetoUsuario.store.name
      )?.id
    );
    this.objetoUsuario.roles = [this.objetoUsuario.roles[0]];
    this.serviceUser.guardarUsuario(this.objetoUsuario).subscribe(
      (response) => {
        this.serviceUser
          .getUsersPaginado(
            this.itemsPage,
            this.page,
            this.filtroBusquedaNombre,
            this.filtroBusquedaApellido,
            this.filtroBusquedaUsuario
          )
          .subscribe((respuesta) => {
            this.listaUsuarios = respuesta;
          });
        this.listarUsuarios();
        this.showModalSuccessSave();
        this.onResetForm();
        this.onResetForm2();
      },
      (error) => {
        this.alertasComponent.showOcurrioErrorStrategy(error);
      }
    );
  }

  modificarUsuario() {
    this.objetoUsuario.store.id = Number(
      this.listaSucursal.find(
        (sucu) => sucu.name == this.objetoUsuario.store.name
      )?.id
    );
    this.serviceUser.modificarUsuario(this.objetoUsuario).subscribe(
      () => {
        this.serviceUser.setRoleUsuario(this.objetoUsuario).subscribe(
          () => {
            this.listarUsuarios();
            this.showModalSuccessSave();
          },
          (error) => {
            this.alertasComponent.showOcurrioErrorStrategy(error);
          }
        );
        this.listarUsuarios();
        this.showModalSuccessSave();
        this.onResetForm();
        this.onResetForm2();
      },
      (error) => {
        this.alertasComponent.showOcurrioErrorStrategy(error);
      }
    );
  }
  editarUser(usuario: any) {
    this.objetoUsuario = usuario;
  }

  eliminarUser(id: number) {
    Swal.fire({
      title: 'Desea eliminar este registro?',
      icon: 'error',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.serviceUser.eliminarUser(id).subscribe(
          (data) => {
            this.serviceUser
              .getUsersPaginado(
                this.itemsPage,
                this.page,
                this.filtroBusquedaNombre,
                this.filtroBusquedaApellido,
                this.filtroBusquedaUsuario
              )
              .subscribe((respuesta) => {
                this.listaUsuarios = respuesta;
              });
            this.listarUsuarios();
          },
          (error) => {
            this.alertasComponent.showOcurrioErrorStrategy(error);
          }
        );
      }
    });
  }

  modificarPassword() {
    this.serviceUser
      .changePasswordAbm(this.objetoUsuario, this.objetoChangePassword)
      .subscribe(
        () => {
          this.listarUsuarios();
          this.showModalSuccessSave();
        },
        (error) => {
          this.alertasComponent.showOcurrioErrorStrategy(error);
        }
      );
  }

  /* BOTONES */
  cancelarUser() {
    this.listarUsuarios();
    this.showModalCancelar();
    this.onResetForm();
    this.onResetForm2();
  }

  cambiarContraseña(usuario: any) {
    this.objetoUsuario = usuario;
  }

  /* LISTAR Y SWAL */

  listarUsuarios() {
    this.serviceUser
      .getUsersPaginado(
        this.itemsPage,
        this.page,
        this.filtroBusquedaNombre,
        this.filtroBusquedaApellido,
        this.filtroBusquedaUsuario
      )
      .subscribe(
        (respuesta) => {
          this.listaUsuarios = respuesta.content;
          this.totalItems = respuesta.meta.totalItems;
        },
        (error) => {
          this.alertasComponent.showOcurrioErrorStrategy(error);
        }
      );
  }

  //RECUPERO OBJETO DEL BACKEND Y CREO UN NUEVO OBJETO CON ESOS DATOS QUE RECUPERO
  //PARA QUE EL OBJETO SE CREE Y TENGA TODOS LOS METODOS QUE PERTENECEN A EL

  seleccionUsuarioModificacion(usuario: IUser) {
    this.actualizarButtonConfirmacion(false);
    this.serviceUser.getUsuarioById(usuario.id).subscribe(
      (result) => {
        this.objetoUsuario = new Usuario(result);
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

  listarSucursales() {
    this.serviceSucursal.getSucursales().subscribe(
      (respuestasucursales) => {
        this.listaSucursal = respuestasucursales;
      },
      (error) => {
        this.alertasComponent.showOcurrioErrorStrategy(error);
      }
    );
  }

  actualizarButtonConfirmacion(bandera: boolean) {
    this.esObjetoNuevo = bandera;
  }

  resetearFormulario() {
    this.onResetForm();
    this.onResetForm2();
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
