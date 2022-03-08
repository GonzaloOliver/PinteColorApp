import { IVenta } from '../../interfaces/venta.interface';
import { VentaService } from 'src/app/services/venta.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertasComponent } from 'src/app/components/alertas/alertas.component';
import { ICondicionIva } from 'src/app/interfaces/condicionesiva.interface';
import { ICliente } from 'src/app/interfaces/cliente.interface';
import { AlertasIconos } from '../alertas/alertas_iconos.enum';
import { ClienteService } from 'src/app/services/cliente.service';
import { ITipoDocumento } from 'src/app/interfaces/tipodocumento.interface';
import Swal from 'sweetalert2';
import { Cliente } from 'src/app/model/cliente.model';
import {
  FormsModule,
  FormGroup,
  Validators,
  FormBuilder,
  FormControl,
  FormGroupDirective,
  NgForm,
} from '@angular/forms';
import { IProvincia } from 'src/app/interfaces/provincia.interface';
import { ICiudad } from 'src/app/interfaces/ciudad.interface';
import { ProvinciaService } from 'src/app/services/provincia.service';
import { Provincia } from 'src/app/model/provincia.modelo';
import { Ciudad } from 'src/app/model/ciudad.model';
import { SettingsService } from 'src/app/services/settings.service';
import { Proveedor } from 'src/app/model/proveedor.model';
import { ProveedorService } from 'src/app/services/proveedor.service';
import { IProveedor } from 'src/app/interfaces/proveedor.interface';

declare var $: any;
@Component({
  selector: 'app-cuenta-corriente',
  templateUrl: './cuenta-corriente.component.html',
  styleUrls: ['./cuenta-corriente.component.css'],
})
export class CuentaCorrienteComponent implements OnInit {
  public contactFormulario: FormGroup;

  filtroBusquedaNombre: string = '';
  filtroBusquedaApellido: string = '';
  filtroBusquedaTelefono: string = '';
  filtroBusquedaCorreo: string = '';

  listaClientes: ICliente[] = [];
  listaCondicionesIva: ICondicionIva[] = [];
  listaTipoDocumento: ITipoDocumento[] = [];
  listaProvincias: IProvincia[] = [];
  listaCiudades: ICiudad[] = [];
  listaProveedores: IProveedor[] = [];

  page: number = 1;
  itemsPage: number = 5;
  totalItems: number = 10;
  cantidadItems: number = 0;

  esObjetoNuevo: boolean = false;
  campoSoloLectura: boolean = true;
  docSoloLectura: boolean = true;
  esCuit: boolean = false;

  objetoCliente: ICliente = new Cliente();
  objetoProvincia: IProvincia = new Provincia();
  objetoProvinciaParaCliente: IProvincia = new Provincia();
  public numbersOnlyValidator(event: any) {
    const pattern = /^[0-9\-]*$/;
    if (!pattern.test(event.target.value)) {
      event.target.value = event.target.value.replace(/[^0-9\-]/g, '');
    }
  }

  private emailPattern: any =
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  constructor(
    private router: Router,
    private alertasComponent: AlertasComponent,
    private settingsService: SettingsService,
    private serviceCliente: ClienteService,
    private serviceVenta: VentaService,
    private serviceProvincias: ProvinciaService,
    private serviceProveedor: ProveedorService
  ) {
    this.contactFormulario = this.createForm();
  }

  get name() {
    return this.contactFormulario.get('name');
  }

  get apellido() {
    return this.contactFormulario.get('apellido');
  }

  get condicioniva() {
    return this.contactFormulario.get('condicioniva');
  }

  get razonsocial() {
    return this.contactFormulario.get('razonsocial');
  }
  get documento() {
    return this.contactFormulario.get('documento');
  }
  get cuit() {
    return this.contactFormulario.get('cuit');
  }
  get tipo() {
    return this.contactFormulario.get('tipo');
  }
  get direccion() {
    return this.contactFormulario.get('direccion');
  }
  get provincia() {
    return this.contactFormulario.get('provincia');
  }
  get ciudad() {
    return this.contactFormulario.get('ciudad');
  }
  get fechanac() {
    return this.contactFormulario.get('fechanac');
  }
  get email() {
    return this.contactFormulario.get('email');
  }
  get telefono() {
    return this.contactFormulario.get('telefono');
  }
  get cdpostal() {
    return this.contactFormulario.get('cdpostal');
  }

  createForm() {
    return new FormGroup({
      name: new FormControl('', [Validators.required, Validators.minLength(3)]),
      apellido: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
      ]),
      condicioniva: new FormControl('', [
        Validators.required,
        Validators.nullValidator,
      ]),
      razonsocial: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
      ]),
      documento: new FormControl('', [
        /*Validators.required, */ Validators.minLength(3),
      ]),
      cuit: new FormControl('', [
        /*Validators.required, */ Validators.minLength(3),
      ]),
      tipo: new FormControl('', [
        Validators.required,
        Validators.nullValidator,
      ]),
      direccion: new FormControl('', [
        Validators.required,
        Validators.minLength(5),
      ]),
      provincia: new FormControl('', [
        Validators.required,
        Validators.nullValidator,
      ]),
      ciudad: new FormControl('', [
        Validators.required,
        Validators.nullValidator,
      ]),
      fechanac: new FormControl('', [Validators.required]),
      email: new FormControl('', [
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
    this.listarClientes();

    this.buscarCondicionesIva();
    this.buscarTipoDocumento();
    this.listarProvincias();
  }

  //#region  CRUD

  guardarCliente() {
    if (this.objetoCliente.idType == 'CUIT') {
      this.objetoCliente.idNumber =
        this.objetoCliente.idNumber.substring(0, 2) +
        '-' +
        this.objetoCliente.idNumber.substring(2, 10) +
        '-' +
        this.objetoCliente.idNumber.substring(10, 11);
    }
    this.serviceCliente.guardarCliente(this.objetoCliente).subscribe(
      (response) => {
        this.listarClientes();
        this.showModalSuccessSave();
      },
      (error) => {
        this.alertasComponent.showOcurrioErrorStrategy(error);
      }
    );
  }

  modificarCliente() {
    if (this.objetoCliente.idType == 'CUIT') {
      this.objetoCliente.idNumber = this.objetoCliente.idNumber.replace(
        '-',
        ''
      );
      this.objetoCliente.idNumber = this.objetoCliente.idNumber.replace(
        '-',
        ''
      );
      this.objetoCliente.idNumber =
        this.objetoCliente.idNumber.substring(0, 2) +
        '-' +
        this.objetoCliente.idNumber.substring(2, 10) +
        '-' +
        this.objetoCliente.idNumber.substring(10, 11);
    }
    this.serviceCliente.modificarCliente(this.objetoCliente).subscribe(
      () => {
        this.listarClientes();
        this.showModalSuccessSave();
      },
      (error) => {
        this.alertasComponent.showOcurrioErrorStrategy(error);
      }
    );
  }

  eliminarCliente(id: number) {
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
        this.serviceCliente.eliminarCliente(id).subscribe(
          () => {
            this.listarClientes();
          },
          (error) => {
            this.alertasComponent.showOcurrioErrorStrategy(error);
          }
        );
        this.showModalEliminar();
      }
    });
  }
  //#endregion

  //#region BUSCAR Y LISTAR
  buscarCiudades() {
    if (this.objetoProvincia.name != '') {
      this.objetoProvincia.id = Number(
        this.listaProvincias.find(
          (provincia) => provincia.name == this.objetoProvincia.name
        )?.id
      );
      if (this.objetoProvincia.id != 0) {
        this.campoSoloLectura = false;
        this.listarCiudadesByProvincia();
      }
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

  habilitarCuit() {
    if (this.objetoCliente.idType != null && this.objetoCliente.idType != '') {
      this.docSoloLectura = false;
      if (
        this.objetoCliente.idType == 'CUIT' ||
        this.objetoCliente.idType == 'CUIL'
      ) {
        this.esCuit = true;
      } else {
        this.esCuit = false;
      }
    }
  }

  buscarTipoDocumento() {
    this.settingsService.getTipoDocumento().subscribe(
      (respuesta) => {
        this.listaTipoDocumento = respuesta;
      },
      (error) => {
        this.alertasComponent.showOcurrioErrorStrategy(error);
      }
    );
  }

  listarClientes() {
    this.serviceCliente
      .getClientesPaginado(
        this.itemsPage,
        this.page,
        this.filtroBusquedaNombre,
        this.filtroBusquedaApellido,
        this.filtroBusquedaTelefono,
        this.filtroBusquedaCorreo
      )
      .subscribe(
        (respuesta) => {
          this.listaClientes = respuesta.content;
          this.totalItems = respuesta.meta.totalItems;
        },
        (error) => {
          this.alertasComponent.showOcurrioErrorStrategy(error);
        }
      );
  }

  listarProvincias() {
    this.serviceProvincias.getProvincias().subscribe(
      (respuesta) => {
        this.listaProvincias = respuesta;
      },
      (error) => {
        this.alertasComponent.showOcurrioErrorStrategy(error);
      }
    );
  }

  listarCiudadesByProvincia() {
    if (this.objetoProvincia.name != null) {
      this.serviceProvincias
        .getCiudadByProvincia(this.objetoProvincia.id)
        .subscribe(
          (res) => {
            this.listaCiudades = res;
            this.objetoCliente.city = new Ciudad();
          },
          (error) => {
            this.alertasComponent.showOcurrioErrorStrategy(error);
          }
        );
    }
  }
  //#endregion

  cancelarCliente() {
    this.listarClientes();
    this.showModalCancelar();
    this.campoSoloLectura = true;
  }

  //RECUPERO OBJETO DEL BACKEND Y CREO UN NUEVO OBJETO CON ESOS DATOS QUE RECUPERO
  //PARA QUE EL OBJETO SE CREE Y TENGA TODOS LOS METODOS QUE PERTENECEN A EL

  seleccionClienteModificacion(cliente: ICliente) {
    this.serviceCliente.getClienteById(cliente.id).subscribe((result) => {
      this.objetoCliente = new Cliente(result);
      this.objetoProvincia = new Provincia(result.city.province);
    });

    this.actualizarButtonConfirmacion(false);
  }

  deshabilitarCampos() {}

  habilitarCodigoPostal() {
    if (this.objetoCliente.city.name != '') {
      this.objetoCliente.city.id = Number(
        this.listaCiudades.find(
          (ciudad) => ciudad.name == this.objetoCliente.city.name
        )?.id
      );
      if (this.objetoCliente.city.id != 0) {
        this.objetoCliente.city.zipCode = Number(
          this.listaCiudades.find(
            (ciudad) => ciudad.name == this.objetoCliente.city.name
          )?.zipCode
        );
      }
    }
  }

  actualizarButtonConfirmacion(bandera: boolean) {
    this.esObjetoNuevo = bandera;
    this.onResetForm();
    this.esCuit = false;
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
