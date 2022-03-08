import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertasComponent } from 'src/app/components/alertas/alertas.component';
import { ICondicionIva } from 'src/app/interfaces/condicionesiva.interface';
import { IProveedor } from 'src/app/interfaces/proveedor.interface';
import { AlertasIconos } from '../alertas/alertas_iconos.enum';
import { SettingsService } from 'src/app/services/settings.service';
import { ProveedorService } from 'src/app/services/proveedor.service';
import Swal from 'sweetalert2';
import {
  FormsModule,
  FormGroup,
  Validators,
  FormBuilder,
  FormControl,
} from '@angular/forms';
import { Proveedor } from 'src/app/model/proveedor.model';
import { ICiudad } from 'src/app/interfaces/ciudad.interface';
import { IProvincia } from 'src/app/interfaces/provincia.interface';
import { Provincia } from 'src/app/model/provincia.modelo';
import { Ciudad } from 'src/app/model/ciudad.model';
import { ProvinciaService } from 'src/app/services/provincia.service';

declare var $: any;
@Component({
  selector: 'app-proveedores',
  templateUrl: './proveedores.component.html',
  styleUrls: ['./proveedores.component.css'],
})
export class ProveedoresComponent implements OnInit {
  public contactFormulario: FormGroup;

  filtroBusquedaRazonSocial: string = '';
  filtroBusquedaDireccion: string = '';
  filtroBusquedaTelefono: string = '';

  listaProveedores: IProveedor[] = [];
  listaCondicionesIva: ICondicionIva[] = [];
  page: number = 1;
  itemsPage: number = 5;
  totalItems: number = 10;
  cantidadItems: number = 0;
  esObjetoNuevo: boolean = false;
  listaCiudades: ICiudad[] = [];
  listaProvincias: IProvincia[] = [];
  camposSoloLectura: boolean = true;
  camposSoloLectura2: boolean = true;
  public numbersOnlyValidator(event: any) {
    const pattern = /^[0-9\-]*$/;
    if (!pattern.test(event.target.value)) {
      event.target.value = event.target.value.replace(/[^0-9\-]/g, '');
    }
  }

  /*public cuitValidator(event: any) {
    const pattern = /[^0-9]{2} [-]{1} [^0-9]{8} [-]{1} [^0-9]{1}/;
    if (!pattern.test(event.target.value)) {
      event.target.value = event.target.value.replace(/[^0-9\-]/g, "");
    }
  }*/

  objetoProvincia: IProvincia = new Provincia();
  objetoProveedor: IProveedor = new Proveedor();
  private emailPattern: any = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  constructor(
    private router: Router,
    private alertasComponent: AlertasComponent,
    private settingsService: SettingsService,
    private provinciaService: ProvinciaService,
    private serviceProveedor: ProveedorService
  ) {
    this.contactFormulario = this.createForm();
  }

  get CodigoProveedor() {
    return this.contactFormulario.get('CodigoProveedor');
  }
  get name() {
    return this.contactFormulario.get('name');
  }
  get condicioniva() {
    return this.contactFormulario.get('condicioniva');
  }
  get razonsocial() {
    return this.contactFormulario.get('razonsocial');
  }
  get cuit() {
    return this.contactFormulario.get('cuit');
  }

  get direccion() {
    return this.contactFormulario.get('direccion');
  }

  get provincia1() {
    return this.contactFormulario.get('provincia1');
  }

  get ciudad1() {
    return this.contactFormulario.get('ciudad');
  }

  get email1() {
    return this.contactFormulario.get('email1');
  }

  get telefono() {
    return this.contactFormulario.get('telefono');
  }

  get cdpostal() {
    return this.contactFormulario.get('cdpostal');
  }

  createForm() {
    return new FormGroup({
      CodigoProveedor: new FormControl('', [
        Validators.required,
        Validators.maxLength(3),
        Validators.minLength(3),
      ]),
      name: new FormControl('', [Validators.required, Validators.minLength(3)]),
      condicioniva: new FormControl('', [
        Validators.required,
        Validators.nullValidator,
      ]),
      razonsocial: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
      ]),
      cuit: new FormControl('', [Validators.required, Validators.minLength(6)]),
      direccion: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
      ]),
      provincia1: new FormControl('', [
        Validators.required,
        Validators.nullValidator,
      ]),
      ciudad1: new FormControl('', [
        Validators.required,
        Validators.nullValidator,
      ]),
      email1: new FormControl('', [
        Validators.required,
        Validators.minLength(5),
        Validators.pattern(this.emailPattern),
      ]),
      telefono: new FormControl('', [
        Validators.required,
        Validators.minLength(10),
      ]),
      cdpostal: new FormControl(),
    });
  }

  onResetForm(): void {
    this.contactFormulario.reset();
  }

  onSaveForm(): void {
    if (this.contactFormulario.valid) {
      this.onResetForm();
    }
  }

  ngOnInit(): void {
    this.listarProveedores();
    this.buscarCondicionesIva();
    this.listarProvincias();
  }

  /* CRUD PROVEEDORES */

  guardarProveedor() {
    this.objetoProveedor.cuit =
      this.objetoProveedor.cuit.substring(0, 2) +
      '-' +
      this.objetoProveedor.cuit.substring(2, 10) +
      '-' +
      this.objetoProveedor.cuit.substring(10, 11);
    this.serviceProveedor.guardarProveedor(this.objetoProveedor).subscribe(
      (response) => {
        this.listarProveedores();
        this.showModalSuccessSave();
        this.camposSoloLectura = true;
      },
      (error) => {
        this.alertasComponent.showOcurrioErrorStrategy(error);
        this.camposSoloLectura = true;
      }
    );
    /*this.resetearFormulario();*/
  }

  modificarProveedor() {
    this.objetoProveedor.cuit = this.objetoProveedor.cuit.replace('-', '');
    this.objetoProveedor.cuit = this.objetoProveedor.cuit.replace('-', '');
    this.objetoProveedor.cuit =
      this.objetoProveedor.cuit.substring(0, 2) +
      '-' +
      this.objetoProveedor.cuit.substring(2, 10) +
      '-' +
      this.objetoProveedor.cuit.substring(10, 11);
    this.serviceProveedor.modificarProveedor(this.objetoProveedor).subscribe(
      (response) => {
        this.listarProveedores();
        this.camposSoloLectura = true;
        this.showModalSuccessSave();
      },
      (error) => {
        this.alertasComponent.showOcurrioErrorStrategy(error);
        this.camposSoloLectura = true;
      }
    );
    /*this.resetearFormulario();*/
  }

  eliminarProveedor(id: number) {
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
        this.serviceProveedor.eliminarProveedor(id).subscribe(
          (data) => {
            this.listarProveedores();
          },
          (error) => {
            this.alertasComponent.showOcurrioErrorStrategy(error);
          }
        );
        this.showModalEliminar();
      }
    });
    /*this.resetearFormulario();*/
  }

  /* BOTONES */

  cancelarProveedor() {
    this.listarProveedores();
    this.showModalCancelar();
    this.camposSoloLectura = true;
    /*this.resetearFormulario();*/
  }

  //RECUPERO OBJETO LINEA DEL BACKEND Y CREO UN NUEVO OBJETO CON ESOS DATOS QUE RECUPERO
  //PARA QUE EL OBJETO SE CREE Y TENGA TODOS LOS METODOS QUE PERTENECEN A EL

  seleccionProveedorModificacion(proveedor: IProveedor) {
    this.serviceProveedor.getProveedorById(proveedor.id).subscribe((result) => {
      this.objetoProveedor = new Proveedor(result);
      this.objetoProvincia = new Provincia(result.city.province);
    });
    this.actualizarButtonConfirmacion(false);
  }

  /* HABILITACION DE CAMPOS */

  actualizarButtonConfirmacion(bandera: boolean) {
    this.esObjetoNuevo = bandera;
    this.onResetForm();
  }

  habilitarCampos() {
    //OBTENGO ID PARA LA PROVINCIA SELECCIONADA
    if (this.objetoProvincia.name != '') {
      this.objetoProvincia.id = Number(
        this.listaProvincias.find(
          (provincia) => provincia.name == this.objetoProvincia.name
        )?.id
      );
      if (this.objetoProvincia.id != 0) {
        this.camposSoloLectura = false;
        this.listarCiudades();
      }
    }
  }

  habilitarCodigoPostal() {
    //OBTENGO ID PARA LA PROVINCIA SELECCIONADA
    if (this.objetoProveedor.city.name != '') {
      this.provinciaService
        .getCiudadByProvincia(this.objetoProvincia.id)
        .subscribe((result) => {
          this.objetoProveedor.city.id = Number(
            this.listaCiudades.find(
              (ciudad) => ciudad.name == this.objetoProveedor.city.name
            )?.id
          );
        });
      if (this.objetoProveedor.city.name != '') {
        this.provinciaService
          .getCiudadByProvincia(this.objetoProvincia.id)
          .subscribe((result) => {
            this.objetoProveedor.city.zipCode = Number(
              this.listaCiudades.find(
                (ciudad) => ciudad.name == this.objetoProveedor.city.name
              )?.zipCode
            );
          });
      }
    }
  }

  deshabilitarCampos() {
    this.camposSoloLectura = true;
  }

  /* LISTAR Y SWALES */

  listarProveedores() {
    this.serviceProveedor
      .getProveedoresPaginado(
        this.itemsPage,
        this.page,
        this.filtroBusquedaRazonSocial,
        this.filtroBusquedaDireccion,
        this.filtroBusquedaTelefono
      )
      .subscribe(
        (respuesta) => {
          this.listaProveedores = respuesta.content;
          this.totalItems = respuesta.meta.totalItems;
        },
        (error) => {
          this.alertasComponent.showOcurrioErrorStrategy(error);
        }
      );
  }

  listarProvincias() {
    this.provinciaService.getProvincias().subscribe(
      (respuesta) => {
        this.listaProvincias = respuesta;
      },
      (error) => {
        this.alertasComponent.showOcurrioErrorStrategy(error);
      }
    );
  }

  listarCiudades() {
    if (this.objetoProvincia.name != null) {
      this.provinciaService
        .getCiudadByProvincia(this.objetoProvincia.id)
        .subscribe(
          (respuesta) => {
            this.listaCiudades = respuesta;
          },
          (error) => {
            this.alertasComponent.showOcurrioErrorStrategy(error);
          }
        );
    }
  }

  buscarCondicionesIva() {
    this.settingsService.getCondicionesIva().subscribe(
      (respuesta) => {
        this.listaCondicionesIva = respuesta;
      },
      (error) => {
        this.alertasComponent.showOcurrioErrorStrategy(error);
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
