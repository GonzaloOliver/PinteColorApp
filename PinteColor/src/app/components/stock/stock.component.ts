import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { MarcaService } from 'src/app/services/marca.service';
import { IArticulo } from 'src/app/interfaces/articulo.interface';
import { Articulo } from 'src/app/model/articulo.model';
import { ArticuloService } from 'src/app/services/articulo.service';
import { AlertasComponent } from '../alertas/alertas.component';
import { ISucursal } from 'src/app/interfaces/sucursal.interface';
import { Sucursal } from 'src/app/model/sucursal.model';
import { SucursalService } from 'src/app/services/sucursal.service';
import { StockService } from 'src/app/services/stock.service';
import Swal from 'sweetalert2';
import { IStockItemLista } from 'src/app/interfaces/stock/stockItemLista.interface';
import { StockItemLista } from 'src/app/model/stock/stockItemLista.model';
import { TipoMovimiento } from './tipomovimiento.enum';
import { IStockMasivo } from 'src/app/interfaces/stock/stockMasivo.interface';
import { StockMasivo } from 'src/app/model/stock/stockMasivo.model';
import { AlertasIconos } from '../alertas/alertas_iconos.enum';
import { IStockPutTransfer } from 'src/app/interfaces/stock/stockPutTransfer.interface';
import { StockPutTransfer } from 'src/app/model/stock/stockPutTransfer';
import { IProveedor } from 'src/app/interfaces/proveedor.interface';
import { ProveedorService } from 'src/app/services/proveedor.service';
import { delay } from 'rxjs/operators';

@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.css'],
})
export class StockComponent implements OnInit {
  frameworkComponents: any;
  camposSoloLectura: boolean = true;
  habilitarSucursalOrigen: boolean = true;
  habilitarSucursalDestino: boolean = true;
  habilitarObservacion: boolean = true;
  habilitarTipoMovimiento: boolean = false;
  habilitarArticulo: boolean = true;
  habilitarProveedor: boolean = true;
  habilitarCantidad: boolean = true;
  habilitarAdd: boolean = true;
  habilitarBtnProcesar: boolean = true;
  page: number = 1;
  itemsPage: number = 5;
  totalItems: number = 10;
  cantidadItems: number = 0;
  esEnvio: boolean = false;
  observacion: boolean = false;

  objetoArticulo: IArticulo = new Articulo();
  objetoItem: IStockItemLista = new StockItemLista();

  listaArticulos: IArticulo[] = [];
  listaSucursales: ISucursal[] = [];
  listaProveedores: IProveedor[] = [];

  listaArticulosSeleccionados: IStockItemLista[] = [];
  listaProcesarStockMasivo: IStockMasivo = new StockMasivo();
  listaProcesarTransferencia: IStockPutTransfer = new StockPutTransfer();

  listaTipoMovimiento: String[] = [];

  tipoMovimiento: String = '';

  constructor(
    private serviceArticulo: ArticuloService,
    private serviceSucursal: SucursalService,
    private proveedorService: ProveedorService,
    private serviceStock: StockService,
    private alertasComponent: AlertasComponent
  ) {}

  ngOnInit(): void {
    this.listarSucursales();
    this.buscarProveedores();
    this.listarArticulos();
    this.listarTipoMovimientos();
    this.camposSoloLectura = true;
  }

  procesarStock() {
    if (this.tipoMovimiento != TipoMovimiento.EnviarEntreSucursales) {
      for (let item of this.listaArticulosSeleccionados) {
        item.goodId = Number(
          this.listaArticulos.find((articulo) => articulo.name == item.goodName)
            ?.id
        );
        item.storeId = Number(
          this.listaSucursales.find(
            (sucursal) => sucursal.name == item.storeNameOrigen
          )?.id
        );
        this.listaProcesarStockMasivo.stocks.push(item);
      }
    } else {
      for (let item of this.listaArticulosSeleccionados) {
        this.listaProcesarTransferencia.originStoreId = Number(
          this.listaSucursales.find(
            (sucursal) => sucursal.name == item.storeNameOrigen
          )?.id
        );
        this.listaProcesarTransferencia.destinationStoreId = Number(
          this.listaSucursales.find(
            (sucursal) => sucursal.name == item.storeNameDestino
          )?.id
        );
        this.listaProcesarTransferencia.stocks.push(item);
      }
    }
    this.listaProcesarStockMasivo.supplier = Number(
      this.listaProveedores.find(
        (proveedor) =>
          proveedor.businessName == this.listaProcesarStockMasivo.supplierName
      )?.id
    );

    //AGREGAR STOCK

    if (this.tipoMovimiento == TipoMovimiento.AgregarStock) {
      this.serviceStock.agregarStock(this.listaProcesarStockMasivo).subscribe(
        () => {
          this.alertasComponent.showModalInformacion(AlertasIconos.Guardar);
          window.location.reload();
        },
        (error) => {
          this.alertasComponent.showOcurrioErrorStrategy(error);
        }
      );
    }
    //RESTAR STOCK
    else if (this.tipoMovimiento == TipoMovimiento.RestarStock) {
      for (let item of this.listaProcesarStockMasivo.stocks) {
        if (item.quantity > 0) {
          item.quantity = item.quantity * -1;
        }
      }
      this.serviceStock.agregarStock(this.listaProcesarStockMasivo).subscribe(
        () => {
          this.alertasComponent.showModalInformacion(AlertasIconos.Guardar);
          window.location.reload();
        },
        (error) => {
          this.alertasComponent.showOcurrioErrorStrategy(error);
        }
      );
    }
    //ACTUALIZAR STOCK
    else if (this.tipoMovimiento == TipoMovimiento.ActualizarStock) {
      this.serviceStock.cambiarStock(this.listaProcesarStockMasivo).subscribe(
        () => {
          this.alertasComponent.showModalInformacion(AlertasIconos.Guardar);
          window.location.reload();
        },
        (error) => {
          this.alertasComponent.showOcurrioErrorStrategy(error);
        }
      );
    }
    //ENVIAR ENTRE SUCURSALES
    else if (this.tipoMovimiento == TipoMovimiento.EnviarEntreSucursales) {
      this.serviceStock;
      this.serviceStock
        .transferirStock(this.listaProcesarTransferencia)
        .subscribe(
          () => {
            this.alertasComponent.showModalInformacion(AlertasIconos.Guardar);
            window.location.reload();
          },
          (error) => {
            this.alertasComponent.showOcurrioErrorStrategy(error);
          }
        );
    }
  }

  listarTipoMovimientos() {
    for (let item of Object.values(TipoMovimiento)) {
      this.listaTipoMovimiento.push(item);
    }
  }

  habilitarBtnAdd() {
    if (
      this.tipoMovimiento == TipoMovimiento.EnviarEntreSucursales ||
      this.tipoMovimiento == TipoMovimiento.RestarStock
    ) {
      if (this.objetoItem.quantity <= this.objetoItem.stockOrigen) {
        this.habilitarAdd = false;
      } else {
        this.habilitarAdd = true;
      }
    } else {
      if (this.objetoItem.quantity > 0) {
        this.habilitarAdd = false;
      } else {
        this.habilitarAdd = true;
      }
    }
  }

  procesarLista() {
    Swal.fire({
      title: '¿Desea procesar la lista?',
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si',
      cancelButtonText: 'Cancelar',
    }).then(async (result) => {
      if (result.isConfirmed) {
        this.procesarStock();
      }
    });
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

  calcularStock(objetonuevo: IStockItemLista) {
    if (this.tipoMovimiento == TipoMovimiento.EnviarEntreSucursales) {
      objetonuevo.stockOrigenFuturo =
        this.objetoItem.stockOrigen - this.objetoItem.quantity;
      objetonuevo.stockDestinoFuturo =
        this.objetoItem.stockDestino + this.objetoItem.quantity;
    } else if (this.tipoMovimiento == TipoMovimiento.AgregarStock) {
      objetonuevo.stockOrigenFuturo =
        this.objetoItem.stockOrigen + this.objetoItem.quantity;
    } else if (this.tipoMovimiento == TipoMovimiento.RestarStock) {
      objetonuevo.stockOrigenFuturo =
        this.objetoItem.stockOrigen - this.objetoItem.quantity;
    } else if (this.tipoMovimiento == TipoMovimiento.ActualizarStock) {
      objetonuevo.stockOrigenFuturo = this.objetoItem.quantity;
    }
  }

  //AL AGREGAR ITEM AGREGO OBJETOITEM A LA LISTA DE ARTICULOS
  agregarItemLista() {
    var objetonuevo: IStockItemLista = new StockItemLista(this.objetoItem);
    var index = 0;
    var esNuevo = true;
    for (let item of this.listaArticulosSeleccionados) {
      if (item.goodId == objetonuevo.goodId) {
        item.quantity += objetonuevo.quantity;
        esNuevo = false;
      }
    }
    if (esNuevo == true) {
      objetonuevo.goodCode = String(
        this.listaArticulos.find(
          (articulo) => articulo.name == objetonuevo.goodName
        )?.code
      );
      this.calcularStock(objetonuevo);
      this.listaArticulosSeleccionados.push(objetonuevo);
    }

    if (this.listaArticulosSeleccionados.length != 0) {
      this.habilitarBtnProcesar = false;
    } else {
      this.habilitarBtnProcesar = true;
    }

    this.habilitarTipoMovimiento = true;
    this.habilitarSucursalOrigen = true;
    this.habilitarSucursalDestino = true;
    this.habilitarAdd = true;
    this.habilitarProveedor = true;
    this.habilitarObservacion = true;
    this.objetoItem.goodName = '';
    this.objetoItem.quantity = 0;
    this.objetoItem.stockOrigen = 0;
    this.objetoItem.stockDestino = 0;
  }

  removerItemLista(id: number) {
    var index = 0;
    for (let item of this.listaArticulosSeleccionados) {
      if (item.goodId == id) {
        this.listaArticulosSeleccionados.splice(index, 1);
      }
      index += 1;
    }
    if (this.listaArticulosSeleccionados.length != 0) {
      this.habilitarBtnProcesar = false;
    } else {
      this.habilitarBtnProcesar = true;
    }

    this.habilitarAdd = true;
  }

  habilitarCampos() {
    if (this.objetoItem.storeNameOrigen != '') {
      if (this.tipoMovimiento == TipoMovimiento.EnviarEntreSucursales) {
        this.habilitarSucursalDestino = false;
      }
      this.habilitarArticulo = false;
      this.habilitarCantidad = false;
    }
  }

  esEnvioEntreSucursales() {
    if (this.tipoMovimiento == TipoMovimiento.EnviarEntreSucursales) {
      this.esEnvio = true;
    } else {
      this.esEnvio = false;
    }
  }

  habilitarSucursal() {
    if (this.listaArticulosSeleccionados.length == 0) {
      this.habilitarSucursalOrigen = false;
      this.habilitarObservacion = false;
      this.habilitarProveedor = false;
    } else {
      this.habilitarSucursalOrigen = true;
    }
    this.esEnvioEntreSucursales();
    if (
      this.tipoMovimiento == TipoMovimiento.EnviarEntreSucursales ||
      this.tipoMovimiento == TipoMovimiento.RestarStock
    ) {
      this.observacion = true;
    } else {
      this.observacion = false;
    }
  }

  habilitarStockActual() {
    if (this.objetoItem.storeNameOrigen != null) {
      this.objetoItem.storeId = Number(
        this.listaSucursales.find(
          (sucursal) => sucursal.name == this.objetoItem.storeNameOrigen
        )?.id
      );

      if (this.objetoItem.goodName != '') {
        this.objetoItem.goodId = Number(
          this.listaArticulos.find(
            (articulo) => articulo.name == this.objetoItem.goodName
          )?.id
        );
        this.serviceStock
          .getStockArticulo(this.objetoItem.goodId, this.objetoItem.storeId)
          .subscribe(
            (response) => {
              this.objetoItem.stockOrigen = response.quantity;
              this.objetoItem.goodCode = response.goodCode;
            },
            (error) => {
              this.alertasComponent.showOcurrioErrorStrategy(error);
            }
          );
      }
    }
  }

  showModalEliminar() {
    this.alertasComponent.showModalInformacion(AlertasIconos.Eliminar);
  }
}
