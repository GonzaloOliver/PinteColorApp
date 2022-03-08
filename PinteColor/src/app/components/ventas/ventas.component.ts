import { ListaPrecioService } from './../../services/listaprecio.service';
import { IListaPrecio } from './../../interfaces/listaprecio.interface';
import { ListaPrecio } from './../../model/listaprecio.model';
import { ITipoComprobante } from './../../interfaces/tipoComprobante.interface';
import { GetStockStore } from 'src/app/model/stock/getstockstore.model';
import { IGetStockStore } from 'src/app/interfaces/stock/getstockstore.interface';
import { ClienteService } from 'src/app/services/cliente.service';
import { Venta } from './../../model/venta.model';
import Swal from 'sweetalert2';
import { IVenta } from './../../interfaces/venta.interface';
import { DetalleVenta } from './../../model/detalleVenta.model';
import { IDetalleVenta } from './../../interfaces/detalleVenta.interface';
import { ICliente } from 'src/app/interfaces/cliente.interface';
import { Component, OnInit, TestabilityRegistry } from '@angular/core';
import { MarcaService } from 'src/app/services/marca.service';
import { IMarca } from 'src/app/interfaces/marca.interface';
import { IArticulo } from 'src/app/interfaces/articulo.interface';
import { Articulo } from 'src/app/model/articulo.model';
import { ArticuloService } from 'src/app/services/articulo.service';
import { AlertasComponent } from '../alertas/alertas.component';
import { ISucursal } from 'src/app/interfaces/sucursal.interface';
import { SucursalService } from 'src/app/services/sucursal.service';
import { StockService } from 'src/app/services/stock.service';
import { IUser } from 'src/app/interfaces/usuarios/user.interface';
import { Usuario } from 'src/app/model/Usuarios/usuario.model';
import { UserService } from 'src/app/services/user.service';
import { ICondicionIva } from 'src/app/interfaces/condicionesiva.interface';
import { SettingsService } from 'src/app/services/settings.service';
import { CondicionIva } from 'src/app/model/condicioniva';
import { VentaService } from 'src/app/services/venta.service';
import { AlertasIconos } from '../alertas/alertas_iconos.enum';

@Component({
  selector: 'app-ventas',
  templateUrl: './ventas.component.html',
  styleUrls: ['./ventas.component.css'],
})
export class VentasComponent implements OnInit {
  camposSoloLectura: boolean = true;
  objetoArticulo: IArticulo = new Articulo();
  objetoListaPrecio: IListaPrecio = new ListaPrecio();
  listaArticulos: IArticulo[] = [];
  habilitarTipoComprobante: boolean = false;
  habilitarArticulo: boolean = true;
  habilitarCliente: boolean = true;
  habilitarAdd: boolean = true;
  habilitarNroComprobante: boolean = true;
  habilitarRemito: boolean = false;
  habilitarRegistrar: boolean = true;
  esRemito: boolean = false;
  esGeneral: boolean = true;
  habilitarAsociacion: boolean = false;
  habilitarListaPrecios: boolean = true;
  habilitarCondVenta: boolean = true;
  habilitarNroAFIP: boolean = true;

  objetoVenta: IVenta = new Venta();
  objetoItem: IDetalleVenta = new DetalleVenta();
  objetoStockActual: IGetStockStore = new GetStockStore();
  objetoUsuarioLogueado: IUser = new Usuario();
  ventaSIparcial: number;
  ventaCIparcial: number;

  selectCondicionVenta: String;

  listaTipoComprobante: ITipoComprobante[] = [];
  listaClientes: ICliente[] = [];
  listaPrecios: IListaPrecio[] = [];
  listaRemitos: any[] = [];
  listaSucursales: ISucursal[] = [];
  listaCondicionesIva: ICondicionIva[] = [];
  listaArticulosSeleccionados: IDetalleVenta[] = [];

  tipoComprobante: String = '';
  totalVenta: number = 0;

  posId: number = 1;
  numeroSugerido: number = 0;

  condiciones = [{ name: 'Contado' }, { name: 'Cta Cte' }];

  constructor(
    private serviceUser: UserService,
    private serviceMarca: MarcaService,
    private clienteService: ClienteService,
    private listaPrecioService: ListaPrecioService,
    private serviceSucursal: SucursalService,
    private serviceStock: StockService,
    private serviceVenta: VentaService,
    private serviceArticulo: ArticuloService,
    private alertasComponent: AlertasComponent,
    private settingsService: SettingsService
  ) {}

  ngOnInit(): void {
    this.listarSucursales();
    this.camposSoloLectura = true;
    this.buscarTipoComprobantes();
    this.listarArticulos();
    this.buscarClientes();
    this.buscarListaPrecios();
    this.buscarCondicionesIva();
    this.obtenerUsuarioActual();
  }

  marca: IMarca[] = [];
  objetoMarca: any = {};
  fechaCbte: any = {};

  listarArticulos() {
    this.serviceArticulo.getArticulos().subscribe(
      (respuesta) => {
        this.listaArticulos = respuesta;
      },
      (error) => {
        this.alertasComponent.showOcurrioErrorStrategy(error);
      }
    );
  }

  listarSucursales() {
    this.serviceSucursal.getSucursales().subscribe(
      (respuesta) => {
        this.listaSucursales = respuesta;
        /*this.totalItems = respuesta.meta.totalItems*/
      },
      (error) => {
        this.alertasComponent.showOcurrioErrorStrategy(error);
      }
    );
  }

  buscarClientes() {
    this.clienteService.getClientesAll().subscribe(
      (respuesta) => {
        this.listaClientes = respuesta;
      },
      (error) => {
        this.alertasComponent.showOcurrioErrorStrategy(error);
      }
    );
  }

  buscarListaPrecios() {
    this.listaPrecioService.getListaPrecio().subscribe(
      (respuesta) => {
        this.listaPrecios = respuesta;
      },
      (error) => {
        this.alertasComponent.showOcurrioErrorStrategy(error);
      }
    );
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

  buscarTipoComprobantes() {
    this.settingsService.getTipoComprobante().subscribe(
      (respuesta) => {
        this.listaTipoComprobante = respuesta;
      },
      (error) => {
        this.alertasComponent.showOcurrioErrorStrategy(error);
      }
    );
  }

  changeHabilitarCliente() {
    this.habilitarNroComprobante = false;
    this.habilitarCliente = false;
    this.cambiarPantallaCarga();
  }

  buscarRemitosCliente() {
    this.serviceVenta.getRemitosNotUsed(this.objetoVenta.customer.id).subscribe(
      (respuesta) => {
        this.listaRemitos = respuesta.content;
      },
      (error) => {
        this.alertasComponent.showOcurrioErrorStrategy(error);
      }
    );
  }

  habilitarDatosCliente() {
    if (this.objetoVenta.customer.businessName != null) {
      this.objetoVenta.customer.idNumber = String(
        this.listaClientes.find(
          (cliente) =>
            cliente.businessName == this.objetoVenta.customer.businessName
        )?.idNumber
      );

      this.objetoVenta.customer.id = Number(
        this.listaClientes.find(
          (cliente) =>
            cliente.businessName == this.objetoVenta.customer.businessName
        )?.id
      );

      this.objetoVenta.customer.ivaCondition.value = String(
        this.listaClientes.find(
          (cliente) =>
            cliente.businessName == this.objetoVenta.customer.businessName
        )?.ivaCondition
      );

      this.objetoVenta.customer.ivaCondition.name = String(
        this.listaCondicionesIva.find(
          (condicion) =>
            condicion.value == this.objetoVenta.customer.ivaCondition.value
        )?.name
      );
    } else {
      this.objetoVenta.customer.ivaCondition = new CondicionIva();
      this.objetoVenta.customer.idNumber = '';
    }

    this.habilitarCondVenta = false;
    this.buscarRemitosCliente();
  }

  condicionVenta() {
    if (this.selectCondicionVenta == this.condiciones[0].name) {
      this.objetoVenta.isDebt = false;
    } else {
      this.objetoVenta.isDebt = true;
    }

    this.habilitarListaPrecios = false;
  }

  habilitarStockActual() {
    if (
      this.objetoVenta.pos != null &&
      this.objetoItem.good.name != '' &&
      this.objetoItem.good.name != null
    ) {
      this.objetoVenta.pos.id = Number(
        this.listaSucursales.find(
          (sucursal) => sucursal.name == this.objetoVenta.pos.name
        )?.id
      );

      if (this.objetoItem.good.name != '') {
        this.objetoItem.good.id = Number(
          this.listaArticulos.find(
            (articulo) => articulo.name == this.objetoItem.good.name
          )?.id
        );
        this.objetoItem.good.salePrice = Number(
          this.listaArticulos.find(
            (articulo) => articulo.name == this.objetoItem.good.name
          )?.salePrice
        );
        this.objetoItem.good.salePriceWithAliquot = Number(
          this.listaArticulos.find(
            (articulo) => articulo.name == this.objetoItem.good.name
          )?.salePriceWithAliquot
        );

        this.objetoVenta.pricelist.value = Number(
          this.listaPrecios.find(
            (listaprecio) => listaprecio.name == this.objetoVenta.pricelist.name
          )?.value
        );

        this.objetoItem.price = Number(
          (
            this.objetoItem.good.salePriceWithAliquot *
            (1 + this.objetoVenta.pricelist.value / 100)
          ).toFixed(2)
        );

        this.objetoItem.good.costPrice = Number(
          this.listaArticulos.find(
            (articulo) => articulo.name == this.objetoItem.good.name
          )?.costPrice
        );

        this.serviceStock
          .getStockArticulo(
            this.objetoItem.good.id,
            this.objetoUsuarioLogueado.store.id
          )
          .subscribe(
            (response) => {
              this.objetoStockActual.quantity = response.quantity;
              this.objetoStockActual.good.code = response.goodCode;
            },
            (error) => {
              this.alertasComponent.showOcurrioErrorStrategy(error);
            }
          );
      }
    }
  }

  agregarItemLista() {
    var objetonuevo: IDetalleVenta = new DetalleVenta(this.objetoItem);
    var esNuevo = true;

    for (let item of this.listaArticulosSeleccionados) {
      if (item.good.id == objetonuevo.good.id) {
        item.quantity += objetonuevo.quantity;
        esNuevo = false;
      }
    }

    if (esNuevo == true) {
      objetonuevo.good.code = String(
        this.listaArticulos.find(
          (articulo) => articulo.name == objetonuevo.good.name
        )?.code
      );
      objetonuevo.price = this.objetoItem.price;
      //this.calcularStock(objetonuevo);
      this.listaArticulosSeleccionados.push(objetonuevo);
    }

    if (this.listaArticulosSeleccionados.length != 0) {
      this.habilitarRegistrar = false;
    } else {
      this.habilitarRegistrar = true;
    }

    this.calcularTotal();

    this.objetoItem.good.name = '';
    this.objetoItem.good.id = 0;
    this.objetoItem.id = 0;
    this.objetoItem.cost = 0;
    this.objetoItem.price = 0;
    this.objetoItem.quantity = 0;
    this.objetoItem.good.salePriceWithAliquot = 0;
    this.objetoItem.good.salePrice = 0;
    this.objetoItem.good.costPrice = 0;
    this.objetoStockActual.quantity = 0;
    this.habilitarAdd = true;
    this.habilitarTipoComprobante = true;
    this.habilitarNroAFIP = true;
    this.habilitarCliente = true;
    this.habilitarNroComprobante = true;
    this.habilitarListaPrecios = true;
    this.habilitarCondVenta = true;
  }

  changeHabilitarAdd() {
    if (this.objetoItem.quantity > 0) {
      this.habilitarAdd = false;
    } else {
      this.habilitarAdd = true;
    }
  }

  obtenerProximoNumero() {
    if (this.objetoVenta.proofType.value != null) {
      this.serviceVenta
        .getNextNumber(this.posId, this.objetoVenta.proofType.value)
        .subscribe(
          (respuesta) => {
            this.numeroSugerido = respuesta;
          },
          (error) => {
            this.alertasComponent.showOcurrioErrorStrategy(error);
          }
        );

      if (
        this.objetoVenta.proofType.value == 'FacturaA' ||
        this.objetoVenta.proofType.value == 'FacturaB' ||
        this.objetoVenta.proofType.value == 'NotaCreditoA' ||
        this.objetoVenta.proofType.value == 'NotaCreditoB' ||
        this.objetoVenta.proofType.value == 'NotaDebitoA' ||
        this.objetoVenta.proofType.value == 'NotaDebitoB'
      ) {
        this.habilitarNroAFIP = false;
      } else {
        this.habilitarNroAFIP = true;
      }
    }
  }

  removerItemLista(id: number) {
    var index = 0;
    for (let item of this.listaArticulosSeleccionados) {
      if (item.good.id == id) {
        this.listaArticulosSeleccionados.splice(index, 1);
      }
      index += 1;
    }

    if (this.listaArticulosSeleccionados.length != 0) {
      this.habilitarRegistrar = false;
    } else {
      this.habilitarRegistrar = true;
      this.habilitarAdd = false;
      this.habilitarTipoComprobante = false;
      this.habilitarNroAFIP = false;
      this.habilitarCliente = false;
      this.habilitarNroComprobante = false;
      this.habilitarListaPrecios = false;
      this.habilitarCondVenta = false;
    }

    this.calcularTotal();
  }

  calcularTotal() {
    var index = 0;
    this.totalVenta = 0;

    if (this.listaArticulosSeleccionados.length != 0) {
      for (let item of this.listaArticulosSeleccionados) {
        this.totalVenta += Number((item.price * item.quantity).toFixed(2));
        index += 1;
      }
    } else {
      this.totalVenta = 0;
    }
  }

  procesarVenta() {
    Swal.fire({
      title: 'Esta seguro?',
      text: 'El comprobante sera registrado',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.value) {
        this.registrarVenta();
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire('Cancelado', 'El comprobante no ah sido registrado', 'error');
      }
    });
  }

  registrarVenta() {
    this.objetoVenta.customer.id = Number(
      this.listaClientes.find(
        (cliente) =>
          cliente.businessName == this.objetoVenta.customer.businessName
      )?.id
    );

    this.objetoVenta.proofType.name = String(
      this.listaTipoComprobante.find(
        (tipocomprobante) =>
          tipocomprobante.value == this.objetoVenta.proofType.value
      )?.name
    );

    this.objetoVenta.pricelist.id = Number(
      this.listaPrecios.find(
        (listaprecio) => listaprecio.name == this.objetoVenta.pricelist.name
      )?.id
    );

    this.objetoVenta.pos.id = Number(this.objetoUsuarioLogueado.store.id);
    this.objetoVenta.details = this.listaArticulosSeleccionados;

    var Venta;

    if (
      this.objetoVenta.proofType.value == 'Recibo' ||
      this.objetoVenta.proofType.value == 'ReciboX'
    ) {
      var Recibo = {
        customer: this.objetoVenta.customer,
        proofType: this.objetoVenta.proofType.value,
        pos: this.objetoVenta.pos,
        commentary: this.objetoVenta.commentary,
        amount: Number(this.totalVenta),
      };
      this.serviceVenta.guardarRecibo(Recibo).subscribe(
        () => {
          Swal.fire(
            'Confirmado',
            'El comprobante ah sido registrado correctamente',
            'success'
          ).then(() => {
            window.location.reload();
          });
        },
        (error) => {
          this.alertasComponent.showOcurrioErrorStrategy(error);
        }
      );
    } else {
      if (
        this.objetoVenta.proofType.value == 'Remito' ||
        this.objetoVenta.proofType.value == 'RemitoX'
      ) {
        Venta = {
          discountStock: this.objetoVenta.discountStock,
          customer: this.objetoVenta.customer,
          proofType: this.objetoVenta.proofType.value,
          pricelist: this.objetoVenta.pricelist,
          pos: this.objetoVenta.pos,
          details: this.objetoVenta.details,
          afipNumber: this.objetoVenta.afipNumber,
          isDebt: this.objetoVenta.isDebt,
          commentary: this.objetoVenta.commentary,
        };
      } else {
        if (this.esAsociadoARemito()) {
          Venta = {
            discountStock: this.objetoVenta.discountStock,
            customer: this.objetoVenta.customer,
            proofType: this.objetoVenta.proofType.value,
            pricelist: this.objetoVenta.pricelist,
            pos: this.objetoVenta.pos,
            details: this.objetoVenta.details,
            afipNumber: this.objetoVenta.afipNumber,
            commentary: this.objetoVenta.commentary,
            isDebt: this.objetoVenta.isDebt,
            remito: { id: Number(this.objetoVenta.remito.id) },
          };
        } else {
          Venta = {
            discountStock: this.objetoVenta.discountStock,
            customer: this.objetoVenta.customer,
            proofType: this.objetoVenta.proofType.value,
            pricelist: this.objetoVenta.pricelist,
            pos: this.objetoVenta.pos,
            details: this.objetoVenta.details,
            afipNumber: this.objetoVenta.afipNumber,
            commentary: this.objetoVenta.commentary,
            isDebt: this.objetoVenta.isDebt,
          };
        }
      }
      this.serviceVenta.guardarVenta(Venta).subscribe(
        () => {
          Swal.fire(
            'Confirmado',
            'El comprobante ah sido registrado correctamente',
            'success'
          ).then(() => {
            window.location.reload();
          });
        },
        (error) => {
          this.alertasComponent.showOcurrioErrorStrategy(error);
        }
      );
    }
  }

  limpiarDetalleComprobante() {
    this.listaArticulosSeleccionados.length = 0;
  }

  cargarListaDetalleRemito() {
    if (this.esAsociadoARemito()) {
      this.serviceVenta.getVentaById(this.objetoVenta.remito.id).subscribe(
        (respuesta) => {
          this.listaArticulosSeleccionados.length = 0;
          respuesta.details.forEach((elemento: IDetalleVenta) => {
            this.listaArticulosSeleccionados.push(elemento);
          });
          if (this.listaArticulosSeleccionados.length > 0) {
            this.habilitarRegistrar = false;
          }
        },
        (error) => {
          this.alertasComponent.showOcurrioErrorStrategy(error);
        }
      );
    }
  }

  verificarHabilitacionArticulo() {
    if (
      this.habilitarArticulo &&
      this.objetoVenta.pricelist.name != '' &&
      this.objetoVenta.pricelist.name != null &&
      this.selectCondicionVenta != '' &&
      this.selectCondicionVenta != null &&
      !this.habilitarRemito
    ) {
      return false;
    } else {
      this.limpiarCamposArticulo();
      return true;
    }
  }

  limpiarCamposArticulo() {
    this.habilitarAdd = true;
    this.objetoItem.good.salePrice = 0;
    this.objetoItem.good.salePriceWithAliquot = 0;
    this.objetoItem.quantity = 0;
    this.objetoStockActual.quantity = 0;
    this.objetoItem.price = 0;
  }

  cambiarPantallaCarga() {
    if (
      this.objetoVenta.proofType.value == 'Recibo' ||
      this.objetoVenta.proofType.value == 'ReciboX'
    ) {
      this.esRemito = true;
      this.esGeneral = false;
    } else {
      this.esRemito = false;
      this.esGeneral = true;
    }
  }

  habilitarRemitoAsociado() {
    if (
      this.objetoVenta.proofType.value == 'FacturaX' ||
      this.objetoVenta.proofType.value == 'FacturaA' ||
      this.objetoVenta.proofType.value == 'FacturaB'
    ) {
      this.habilitarAsociacion = true;
    } else {
      this.habilitarAsociacion = false;
    }
  }

  esAsociadoARemito() {
    return this.habilitarRemito;
  }

  cambioCheck() {
    if (this.habilitarRemito == true) {
      this.habilitarRemito = false;
    } else {
      this.habilitarRemito = true;
    }
    this.limpiarDetalleComprobante();
    this.objetoVenta.remito = {};
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
