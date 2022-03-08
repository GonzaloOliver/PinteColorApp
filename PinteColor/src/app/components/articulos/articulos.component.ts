import { Component, OnInit } from '@angular/core';
import { AlertasComponent } from '../alertas/alertas.component';
import { AlertasIconos } from '../alertas/alertas_iconos.enum';
import { MarcaService } from 'src/app/services/marca.service';
import { LineaService } from 'src/app/services/linea.service';
import { RubroService } from 'src/app/services/rubro.service';
import { ProveedorService } from 'src/app/services/proveedor.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ArticuloService } from 'src/app/services/articulo.service';
import { ILinea } from 'src/app/interfaces/linea.interface';
import { IRubro } from 'src/app/interfaces/rubro.interface';
import { IProveedor } from 'src/app/interfaces/proveedor.interface';
import { IMarca } from 'src/app/interfaces/marca.interface';
import { IArticulo } from 'src/app/interfaces/articulo.interface';
import { Articulo } from 'src/app/model/articulo.model';
import { Rubro } from 'src/app/model/rubro.model';
import { SettingsService } from 'src/app/services/settings.service';
import { IAlicuotaIva } from 'src/app/interfaces/alicuotaiva.interface';
import { IUnidadMedida } from 'src/app/interfaces/unidadmedida.interface';
import { Proveedor } from 'src/app/model/proveedor.model';
import { Linea } from 'src/app/model/linea.model';
import { formatNumber } from '@angular/common';
import {
  FormsModule,
  FormGroup,
  Validators,
  FormBuilder,
  FormControl,
} from '@angular/forms';

declare var $: any;
@Component({
  selector: 'app-articulos',
  templateUrl: './articulos.component.html',
  styleUrls: ['./articulos.component.css'],
})
export class ArticulosComponent implements OnInit {
  listaArticulos: IArticulo[] = [];
  listaProveedores: IProveedor[] = [];
  listaRubros: IRubro[] = [];
  listaLineas: ILinea[] = [];
  listaLineasAll: ILinea[] = [];
  listaMarcas: IMarca[] = [];
  listaAlicuotas: IAlicuotaIva[] = [];
  listaUnidadMedida: IUnidadMedida[] = [];

  public contactFormulario: FormGroup;

  filtroBusquedaNombre: string;
  filtroBusquedaProveedor: string;
  filtroBusquedaMarca: string;
  filtroBusquedaLinea: string;

  filtroBusquedaProveedorId: any = '';
  filtroBusquedaMarcaId: any = '';
  filtroBusquedaLineaId: any = '';

  page: number = 1;
  itemsPage: number = 5;
  totalItems: number = 10;
  cantidadItems: number = 0;
  esObjetoNuevo: boolean = false;
  readUtilidad: boolean = true;
  readCosto: boolean = true;
  readPrecioGrav: boolean = true;
  readPrecioIVA: boolean = true;
  camposSoloLectura: boolean = true;

  objetoRubro: IRubro = new Rubro();
  objetoArticulo: IArticulo = new Articulo();

  constructor(
    private router: Router,
    private alertasComponent: AlertasComponent,
    private proveedorService: ProveedorService,
    private lineaService: LineaService,
    private rubroService: RubroService,
    private marcaService: MarcaService,
    private articuloService: ArticuloService,
    private settingsService: SettingsService
  ) {
    this.contactFormulario = this.createForm();
  }

  ngOnInit(): void {
    this.buscarProveedores();
    this.buscarRubros();
    this.buscarMarcas();
    this.buscarAlicuotas();
    this.buscarUnidadMedida();
    this.buscarLineasAll();

    this.listarArticulos();
    this.camposSoloLectura = true;
  }

  get codinterno() {
    return this.contactFormulario.get('codinterno');
  }

  get nombre() {
    return this.contactFormulario.get('nombre');
  }

  get descripcion() {
    return this.contactFormulario.get('descripcion');
  }

  get um() {
    return this.contactFormulario.get('um');
  }

  get marca() {
    return this.contactFormulario.get('marca');
  }

  get linea() {
    return this.contactFormulario.get('linea');
  }

  get rubro() {
    return this.contactFormulario.get('rubro');
  }

  get proveedor() {
    return this.contactFormulario.get('proveedor');
  }

  get alicuota1() {
    return this.contactFormulario.get('alicuota1');
  }

  get codproveedor() {
    return this.contactFormulario.get('codproveedor');
  }

  /* CRUD PROVEEDORES */

  createForm() {
    return new FormGroup({
      codinterno: new FormControl('', [
        Validators.required,
        Validators.minLength(1),
      ]),

      nombre: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
      ]),

      descripcion: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
      ]),

      um: new FormControl('', [Validators.required, Validators.nullValidator]),

      marca: new FormControl('', [
        Validators.required,
        Validators.nullValidator,
      ]),
      rubro: new FormControl('', [
        Validators.required,
        Validators.nullValidator,
      ]),
      linea: new FormControl('', [
        Validators.required,
        Validators.nullValidator,
      ]),

      proveedor: new FormControl('', [
        Validators.required,
        Validators.nullValidator,
      ]),
      alicuota1: new FormControl('', [
        Validators.required,
        Validators.nullValidator,
      ]),

      codproveedor: new FormControl(),
    });
  }

  onResetForm(): void {
    this.contactFormulario.reset();
    this.objetoArticulo.borrarCampos();
  }

  onSaveForm(): void {
    if (this.contactFormulario.valid) {
      this.onResetForm();
    }
  }

  guardarArticulo() {
    this.objetoArticulo.convertirNumber();
    this.objetoArticulo.code =
      this.objetoArticulo.codeProveedor?.toUpperCase() +
      '-' +
      this.objetoArticulo.codeNumerico?.toUpperCase();

    this.objetoArticulo.supplier.id = Number(
      this.listaProveedores.find(
        (proveedor) =>
          proveedor.businessName == this.objetoArticulo.supplier.businessName
      )?.id
    );
    this.objetoArticulo.line.id = Number(
      this.listaLineas.find(
        (linea) => linea.name == this.objetoArticulo.line.name
      )?.id
    );
    this.objetoArticulo.brand.id = Number(
      this.listaMarcas.find(
        (marca) => marca.name == this.objetoArticulo.brand.name
      )?.id
    );
    this.articuloService.guardarArticulo(this.objetoArticulo).subscribe(
      (response) => {
        this.listarArticulos();
        this.showModalSuccessSave();
        this.camposSoloLectura = true;
      },
      (error) => {
        this.alertasComponent.showOcurrioErrorStrategy(error);
        this.camposSoloLectura = true;
      }
    );
  }

  modificarArticulo() {
    this.objetoArticulo.code =
      this.objetoArticulo.codeProveedor?.toUpperCase() +
      '-' +
      this.objetoArticulo.codeNumerico?.toUpperCase();

    this.objetoArticulo.supplier.id = Number(
      this.listaProveedores.find(
        (proveedor) =>
          proveedor.businessName == this.objetoArticulo.supplier.businessName
      )?.id
    );
    if (this.listaLineas.length != 0) {
      this.objetoArticulo.line.id = Number(
        this.listaLineas.find(
          (linea) => linea.name == this.objetoArticulo.line.name
        )?.id
      );
    }
    this.objetoArticulo.brand.id = Number(
      this.listaMarcas.find(
        (marca) => marca.name == this.objetoArticulo.brand.name
      )?.id
    );
    this.objetoArticulo.convertirNumber();

    this.articuloService.modificarArticulo(this.objetoArticulo).subscribe(
      () => {
        this.listarArticulos();
        this.showModalSuccessSave();
        this.camposSoloLectura = true;
      },
      (error) => {
        this.alertasComponent.showOcurrioErrorStrategy(error);
        this.camposSoloLectura = true;
      }
    );
  }

  habilitarCampos() {
    if (this.objetoArticulo.aliquot != '') {
      this.readCosto = false;
      this.readUtilidad = false;
    }
    if (this.objetoArticulo.aliquot == 'A0') {
      this.objetoArticulo.salePriceWithAliquot = this.objetoArticulo.salePrice;
    } else if (this.objetoArticulo.aliquot == 'A10_5') {
      this.objetoArticulo.salePriceWithAliquot = Number(
        (this.objetoArticulo.salePrice * (1 + 10.5 / 100)).toFixed(2)
      );
    } else if (this.objetoArticulo.aliquot == 'A21') {
      this.objetoArticulo.salePriceWithAliquot = Number(
        (this.objetoArticulo.salePrice * (1 + 21 / 100)).toFixed(2)
      );
    } else if (this.objetoArticulo.aliquot == 'A27') {
      this.objetoArticulo.salePriceWithAliquot = Number(
        (this.objetoArticulo.salePrice * (1 + 27 / 100)).toFixed(2)
      );
    }
  }

  habilitarPrecio() {
    if (this.objetoArticulo.costPrice != 0) {
      this.readPrecioGrav = false;
      this.readPrecioIVA = false;
    }
  }

  eliminarArticulo(id: number) {
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
        this.articuloService.eliminarArticulo(id).subscribe(
          (data) => {
            this.listarArticulos();
          },
          (error) => {
            this.alertasComponent.showOcurrioErrorStrategy(error);
          }
        );
        this.showModalEliminar();
      }
    });
  }

  /* BOTONES */

  cancelarArticulo() {
    this.listarArticulos();
    this.showModalCancelar();
    this.camposSoloLectura = true;
  }

  seleccionArticuloModificacion(articulo: any) {
    this.articuloService.getArticuloById(articulo.id).subscribe((result) => {
      this.objetoArticulo = new Articulo(result);
      this.actualizarPrecioConIVA();
    });
    this.actualizarButtonConfirmacion(false);
  }

  /* HABILITACION DE CAMPOS */

  actualizarButtonConfirmacion(bandera: boolean) {
    this.esObjetoNuevo = bandera;
    this.onResetForm();
  }

  deshabilitarCampos() {
    this.camposSoloLectura = true;
  }

  habilitarBusquedaLineas() {
    if (this.objetoArticulo.line.sector.name != null) {
      this.objetoArticulo.line.sector.id = Number(
        this.listaRubros.find(
          (rubros) => rubros.name == this.objetoArticulo.line.sector.name
        )?.id
      );

      if (
        this.objetoArticulo.line.sector.id != 0 &&
        this.objetoArticulo.line.sector.name != ''
      ) {
        this.camposSoloLectura = false;
        this.buscarLineas();
      }
    } else {
      this.objetoArticulo.line.name = '';
    }
  }

  /* LISTAR, BUSCAR Y SWALES */

  listarArticulos() {
    if (this.filtroBusquedaProveedor != '') {
      this.filtroBusquedaProveedorId = this.listaProveedores.find(
        (proveedor) => proveedor.businessName == this.filtroBusquedaProveedor
      )?.id;
    }
    if (this.filtroBusquedaMarca != '') {
      this.filtroBusquedaMarcaId = this.listaMarcas.find(
        (marca) => marca.name == this.filtroBusquedaMarca
      )?.id;
    }
    if (this.filtroBusquedaLinea != '') {
      this.filtroBusquedaLineaId = this.listaLineasAll.find(
        (linea) => linea.name == this.filtroBusquedaLinea
      )?.id;
    }
    this.articuloService
      .getArticulosPaginado(
        this.itemsPage,
        this.page,
        this.filtroBusquedaNombre,
        this.filtroBusquedaProveedorId,
        this.filtroBusquedaMarcaId,
        this.filtroBusquedaLineaId
      )
      .subscribe(
        (respuesta) => {
          this.listaArticulos = respuesta.content;
          this.totalItems = respuesta.meta.totalItems;
        },
        (error) => {
          this.alertasComponent.showOcurrioErrorStrategy(error);
        }
      );
  }

  buscarProveedores() {
    this.proveedorService.getProveedores().subscribe(
      (respuesta) => {
        this.listaProveedores = respuesta;
      },
      (error) => {
        this.alertasComponent.showOcurrioErrorStrategy(error);
      }
    );
  }

  buscarLineas() {
    this.lineaService
      .getLineBySector(this.objetoArticulo.line.sector.id)
      .subscribe(
        (respuesta) => {
          this.listaLineas = respuesta;
        },
        (error) => {
          this.alertasComponent.showOcurrioErrorStrategy(error);
        }
      );
  }
  buscarLineasAll() {
    this.lineaService.getLineas().subscribe(
      (respuesta) => {
        this.listaLineasAll = respuesta;
      },
      (error) => {
        this.alertasComponent.showOcurrioErrorStrategy(error);
      }
    );
  }
  buscarRubros() {
    this.rubroService.getRubros().subscribe(
      (respuesta) => {
        this.listaRubros = respuesta;
      },
      (error) => {
        this.alertasComponent.showOcurrioErrorStrategy(error);
      }
    );
  }

  buscarNombreRubro(valueRubro: any) {
    return this.listaRubros.find((rubro) => rubro.id == valueRubro.id)?.name;
  }

  buscarMarcas() {
    this.marcaService.getMarcas().subscribe(
      (respuesta) => {
        this.listaMarcas = respuesta;
      },
      (error) => {
        this.alertasComponent.showOcurrioErrorStrategy(error);
      }
    );
  }

  buscarAlicuotas() {
    this.settingsService.getAlicuota().subscribe(
      (respuestaalicuotas) => {
        this.listaAlicuotas = respuestaalicuotas;
      },
      (error) => {
        this.alertasComponent.showOcurrioErrorStrategy(error);
      }
    );
  }

  buscarUnidadMedida() {
    this.settingsService.getUnidadMedida().subscribe(
      (respuestaunidadmedida) => {
        this.listaUnidadMedida = respuestaunidadmedida;
      },
      (error) => {
        this.alertasComponent.showOcurrioErrorStrategy(error);
      }
    );
  }

  //#region ACTUALIZACIONES DE PRECIOS

  actualizarCambioUtilidad() {
    if (this.objetoArticulo.costPrice != 0) {
      this.objetoArticulo.salePrice = Number(
        (
          this.objetoArticulo.costPrice *
          (1 + this.objetoArticulo.profitMargin / 100)
        ).toFixed(2)
      );
    }
    this.actualizarPrecioConIVA();
  }

  actualizarCambioPrecioGravado() {
    if (this.objetoArticulo.costPrice != 0) {
      this.objetoArticulo.profitMargin = Number(
        (
          ((this.objetoArticulo.salePrice - this.objetoArticulo.costPrice) /
            this.objetoArticulo.costPrice) *
          100
        ).toFixed(2)
      );
    }
    this.actualizarPrecioConIVA();
  }

  actualizarCambioCosto() {
    if (this.objetoArticulo.profitMargin != 0) {
      this.objetoArticulo.salePrice = Number(
        (
          this.objetoArticulo.costPrice *
          (1 + this.objetoArticulo.profitMargin / 100)
        ).toFixed(2)
      );
    }
    this.habilitarPrecio();
    this.actualizarPrecioConIVA();
  }

  actualizarCodigoProveedor() {
    if (
      this.objetoArticulo.supplier.businessName != '' &&
      this.objetoArticulo.supplier.businessName != null
    ) {
      this.objetoArticulo.supplier.code = this.listaProveedores
        .find(
          (proveedor) =>
            proveedor.businessName == this.objetoArticulo.supplier.businessName
        )
        ?.code.toString();
      this.objetoArticulo.codeProveedor = this.objetoArticulo.supplier.code;
    }
  }

  actualizarCambioEnPrecioConIVA() {
    if (this.objetoArticulo.aliquot != '') {
      if (this.objetoArticulo.aliquot == 'A0') {
        this.objetoArticulo.salePrice = Number(
          this.objetoArticulo.salePriceWithAliquot
        );
        this.objetoArticulo.profitMargin = Number(
          (
            ((this.objetoArticulo.salePrice - this.objetoArticulo.costPrice) /
              this.objetoArticulo.costPrice) *
            100
          ).toFixed(2)
        );
      } else if (this.objetoArticulo.aliquot == 'A10_5') {
        this.objetoArticulo.salePrice = Number(
          (Number(this.objetoArticulo.salePriceWithAliquot) / 1.105).toFixed(2)
        );
        this.objetoArticulo.profitMargin = Number(
          (
            ((this.objetoArticulo.salePrice - this.objetoArticulo.costPrice) /
              this.objetoArticulo.costPrice) *
            100
          ).toFixed(2)
        );
      } else if (this.objetoArticulo.aliquot == 'A21') {
        this.objetoArticulo.salePrice = Number(
          (Number(this.objetoArticulo.salePriceWithAliquot) / 1.21).toFixed(2)
        );
        this.objetoArticulo.profitMargin = Number(
          (
            ((this.objetoArticulo.salePrice - this.objetoArticulo.costPrice) /
              this.objetoArticulo.costPrice) *
            100
          ).toFixed(2)
        );
      } else if (this.objetoArticulo.aliquot == 'A27') {
        this.objetoArticulo.salePrice = Number(
          (Number(this.objetoArticulo.salePriceWithAliquot) / 1.27).toFixed(2)
        );
        this.objetoArticulo.profitMargin = Number(
          (
            ((this.objetoArticulo.salePrice - this.objetoArticulo.costPrice) /
              this.objetoArticulo.costPrice) *
            100
          ).toFixed(2)
        );
      }
    }
  }

  actualizarPrecioConIVA() {
    if (this.objetoArticulo.costPrice != 0) {
      if (this.objetoArticulo.aliquot == 'A0') {
        this.objetoArticulo.salePriceWithAliquot = Number(
          this.objetoArticulo.salePrice.toFixed(2)
        );
      } else if (this.objetoArticulo.aliquot == 'A10_5') {
        this.objetoArticulo.salePriceWithAliquot = Number(
          (this.objetoArticulo.salePrice * 1.105).toFixed(2)
        );
      } else if (this.objetoArticulo.aliquot == 'A21') {
        this.objetoArticulo.salePriceWithAliquot = Number(
          (this.objetoArticulo.salePrice * 1.21).toFixed(2)
        );
      } else if (this.objetoArticulo.aliquot == 'A27') {
        this.objetoArticulo.salePriceWithAliquot = Number(
          (this.objetoArticulo.salePrice * 1.27).toFixed(2)
        );
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
