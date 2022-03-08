import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { ISucursal } from 'src/app/interfaces/sucursal.interface';
import { SucursalService } from 'src/app/services/sucursal.service';
import { AlertasComponent } from '../alertas/alertas.component';
import {
  FormsModule,
  FormGroup,
  Validators,
  FormBuilder,
  FormControl,
} from '@angular/forms';
import { AlertasIconos } from '../alertas/alertas_iconos.enum';
import Swal from 'sweetalert2';
import { Sucursal } from 'src/app/model/sucursal.model';
import { ICiudad } from 'src/app/interfaces/ciudad.interface';
import { IProvincia } from 'src/app/interfaces/provincia.interface';
import { Provincia } from 'src/app/model/provincia.modelo';
import { ProvinciaService } from 'src/app/services/provincia.service';
import { PdfMakeWrapper } from 'pdfmake-wrapper';

declare var $: any;
@Component({
  selector: 'app-sucursal',
  templateUrl: './sucursal.component.html',
  styleUrls: ['./sucursal.component.css'],
})
export class SucursalComponent implements OnInit {
  public contactFormulario: FormGroup;
  filtroSucursal: string = '';

  filtroBusquedaNombre: string = '';
  filtroBusquedaDireccion: string = '';

  page: number = 1;
  itemsPage: number = 5;
  totalItems: number = 10;
  cantidadItems: number = 0;
  esObjetoNuevo: boolean = false;
  listaSucursales: ISucursal[] = [];
  listaCiudades: ICiudad[] = [];
  listaProvincias: IProvincia[] = [];
  camposSoloLectura: boolean = true;
  valorSwitch: boolean;

  objetoProvincia: IProvincia = new Provincia();
  objetoSucursal: ISucursal = new Sucursal();
  public numbersOnlyValidator(event: any) {
    const pattern = /^[0-9\-]*$/;
    if (!pattern.test(event.target.value)) {
      event.target.value = event.target.value.replace(/[^0-9\-]/g, '');
    }
  }
  get name() {
    return this.contactFormulario.get('name');
  }
  get telefono() {
    return this.contactFormulario.get('telefono');
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

  constructor(
    private router: Router,
    private serviceSucursal: SucursalService,
    private provinciaService: ProvinciaService,
    private alertasComponent: AlertasComponent
  ) {
    this.contactFormulario = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.minLength(3)]),
      telefono: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
      ]),
      direccion: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
      ]),
      provincia: new FormControl('', [
        Validators.required,
        Validators.nullValidator,
      ]),
      ciudad: new FormControl('', [
        Validators.required,
        Validators.nullValidator,
      ]),

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
    this.listarSucursales();
    this.listarProvincias();
  }

  guardarSucursal() {
    this.serviceSucursal.guardarSucursal(this.objetoSucursal).subscribe(
      (response) => {
        this.listarSucursales();
        this.showModalSuccessSave();
      },
      (error) => {
        this.alertasComponent.showOcurrioErrorStrategy(error);
      }
    );
  }

  modificarSucursal() {
    this.serviceSucursal.modificarSucursal(this.objetoSucursal).subscribe(
      () => {
        this.listarSucursales();
        this.showModalSuccessSave();
      },
      (error) => {
        this.alertasComponent.showOcurrioErrorStrategy(error);
      }
    );
  }

  //RECUPERO OBJETO DEL BACKEND Y CREO UN NUEVO OBJETO CON ESOS DATOS QUE RECUPERO
  //PARA QUE EL OBJETO SE CREE Y TENGA TODOS LOS METODOS QUE PERTENECEN A EL

  seleccionSucursalModificacion(sucursal: ISucursal) {
    this.serviceSucursal.getSucursalById(sucursal.id).subscribe((result) => {
      this.objetoSucursal = new Sucursal(result);
      this.objetoProvincia = new Provincia(result.city.province);
    });
    this.actualizarButtonConfirmacion(false);
  }

  listarSucursales() {
    this.serviceSucursal
      .getSucursalesPaginado(
        this.itemsPage,
        this.page,
        this.filtroBusquedaNombre,
        this.filtroBusquedaDireccion
      )
      .subscribe(
        (respuesta) => {
          this.listaSucursales = respuesta.content;
          this.totalItems = respuesta.meta.totalItems;
        },
        (error) => {
          this.alertasComponent.showOcurrioErrorStrategy(error);
        }
      );
  }

  eliminarSucursal(id: number) {
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
        this.serviceSucursal.eliminarSucursal(id).subscribe(
          (data) => {
            this.serviceSucursal
              .getSucursalesPaginado(
                this.itemsPage,
                this.page,
                this.filtroBusquedaNombre,
                this.filtroBusquedaDireccion
              )
              .subscribe((respuesta) => {
                this.listaSucursales = respuesta;
              });
            this.listarSucursales();
          },
          (error) => {
            this.alertasComponent.showOcurrioErrorStrategy(error);
          }
        );
        this.showModalEliminar();
      }
    });
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

  cancelarSucursal() {
    this.listarSucursales();
    this.showModalCancelar();
  }

  buscarSucursal() {
    this.serviceSucursal.getSucursalById(this.filtroSucursal).subscribe(
      (result) => {
        this.listaSucursales = result.content;
      },
      (error) => {
        this.listaSucursales = [];
      }
    );
  }

  actualizarButtonConfirmacion(bandera: boolean) {
    this.esObjetoNuevo = bandera;

    /*this.resetearFormulario();*/
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

  habilitarSucursalFiscal() { }

  controlarSwitch() {
    if (this.objetoSucursal.isPOS) {
      this.objetoSucursal.isPOS = false;
    } else {
      this.objetoSucursal.isPOS = true;
    }
  }

  habilitarCodigoPostal() {
    //OBTENGO ID PARA LA PROVINCIA SELECCIONADA
    if (this.objetoSucursal.city.name != '') {
      this.provinciaService
        .getCiudadByProvincia(this.objetoProvincia.id)
        .subscribe((result) => {
          this.objetoSucursal.city.id = Number(
            this.listaCiudades.find(
              (ciudad) => ciudad.name == this.objetoSucursal.city.name
            )?.id
          );
        });
      if (this.objetoSucursal.city.name != '') {
        this.provinciaService
          .getCiudadByProvincia(this.objetoProvincia.id)
          .subscribe((result) => {
            this.objetoSucursal.city.zipCode = Number(
              this.listaCiudades.find(
                (ciudad) => ciudad.name == this.objetoSucursal.city.name
              )?.zipCode
            );
          });
      }
    }
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
