import { IStockHistory } from './../../interfaces/stock/stockhistory.interface';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IArticulo } from 'src/app/interfaces/articulo.interface';
import { Articulo } from 'src/app/model/articulo.model';
import { ArticuloService } from 'src/app/services/articulo.service';
import { AlertasComponent } from '../alertas/alertas.component';
import { ITable, PdfMakeWrapper, Table, TocItem } from 'pdfmake-wrapper';

import { Console } from 'node:console';
import { SettingsService } from 'src/app/services/settings.service';
import { IEmpresa } from 'src/app/interfaces/empresa.interface';
import { Empresa } from 'src/app/model/empresa.model';
import * as pdfMake from 'pdfmake/build/pdfmake';
import { IListaPrecio } from 'src/app/interfaces/listaprecio.interface';
import { ListaPrecio } from 'src/app/model/listaprecio.model';
import { ListaPrecioService } from 'src/app/services/listaprecio.service';
import { IListadoStock } from 'src/app/interfaces/IListadoStock.interface';
import { ISucursal } from 'src/app/interfaces/sucursal.interface';
import { IGetStockStore } from 'src/app/interfaces/stock/getstockstore.interface';
import { Sucursal } from 'src/app/model/sucursal.model';
import { GetStockStore } from 'src/app/model/stock/getstockstore.model';
import { StockService } from 'src/app/services/stock.service';
import { SucursalService } from 'src/app/services/sucursal.service';
import { sortBy } from 'sort-by-typescript';
import { IProveedor } from 'src/app/interfaces/proveedor.interface';
import { ProveedorService } from 'src/app/services/proveedor.service';
import { Proveedor } from 'src/app/model/proveedor.model';
import { StockHistory } from 'src/app/model/stock/stockHistory.model';
import { StockHistoryService } from 'src/app/services/stockhistory.service';

@Component({
  selector: 'app-stock-history',
  templateUrl: './stock-history.component.html',
  styleUrls: ['./stock-history.component.css'],
})
export class StockHistoryComponent implements OnInit {
  listaStockArticulos: IListadoStock[] = [];
  listaSucursales: ISucursal[] = [];
  listaArticulo: IArticulo[] = [];
  listaProveedores: IProveedor[] = [];
  listaStockHistory: IStockHistory[] = [];

  filtroBusquedaCode: String;

  objetoStockHistory: IStockHistory = new StockHistory();
  objetoSucursal: ISucursal = new Sucursal();
  objetoArticulo: IArticulo = new Articulo();
  objetoProveedor: IProveedor = new Proveedor();

  page: number = 1;
  itemsPage: number = 10;
  totalItems: number = 10;
  cantidadItems: number = 0;

  listaStockPorDeposito: IGetStockStore[] = [];

  constructor(
    private serviceSettings: SettingsService,
    private serviceSucursal: SucursalService,
    private alertasComponent: AlertasComponent,
    private proveedorService: ProveedorService,
    private serviceStock: StockService,
    private serviceStockHistory: StockHistoryService,
    private router: Router,
    private articuloService: ArticuloService
  ) {}

  ngOnInit(): void {
    this.listarArticulos();
    this.listarSucursales();
    this.listarProveedores();
    this.listarStockHistory();
  }

  buscarDestinoSucursal(value: any): String {
    if (value.stock != '' && value.stock != null) {
      return ' - ' + value.stock.source.name;
    } else {
      return ' ';
    }
  }

  buscarProveedor(value: any): String {
    //SI HAY PROVEEDOR REGISTRADO MUESTRO PROVEEDOR SINO MUESTRO LA SUCURSAL DE ORIGEN
    if (value.supplier != '' && value.supplier != null) {
      return value.supplier.businessName;
    } else if(value.source != '' && value.source != null){
      return value.source.name;
    } else {
      return '';
    }
  }

  //CAMBIOS EN BACKEND
  /*buscarNombreMov(value: any): String {
    if (value.action == 'ADD' && value.change > 0) {
      return 'SUMAR';
    } else if (value.action == 'ADD' && value.change < 0) {
      return 'RESTAR';
    } else if (value.action == 'TRANSFER') {
      return 'TRANSFERENCIA';
    } else if (value.action == 'ADD' && value.change == 0) {
      return 'ACTUALIZAR';
    } else {
      return '';
    }
  }*/

  listarArticulos() {
    this.articuloService.getArticulos().subscribe(
      (respuesta) => {
        this.listaArticulo = respuesta;
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
      },
      (error) => {
        this.alertasComponent.showOcurrioErrorStrategy(error);
      }
    );
  }

  listarProveedores() {
    this.proveedorService.getProveedores().subscribe(
      (respuesta) => {
        this.listaProveedores = respuesta;
      },
      (error) => {
        this.alertasComponent.showOcurrioErrorStrategy(error);
      }
    );
  }

  listarStockHistory() {
    this.objetoArticulo.id = 0;
    this.objetoSucursal.id = 0;
    this.objetoProveedor.id = 0;

    if (this.objetoArticulo.name != '' && this.objetoArticulo.name != null) {
      this.objetoArticulo.id = Number(
        this.listaArticulo.find(
          (articulo) => articulo.name == this.objetoArticulo.name
        )?.id
      );
    }

    if (this.objetoSucursal.name != '' && this.objetoSucursal.name != null) {
      this.objetoSucursal.id = Number(
        this.listaSucursales.find(
          (sucursal) => sucursal.name == this.objetoSucursal.name
        )?.id
      );
    }

    if (
      this.objetoProveedor.businessName != '' &&
      this.objetoProveedor.businessName != null
    ) {
      this.objetoProveedor.id = Number(
        this.listaProveedores.find(
          (proveedor) =>
            proveedor.businessName == this.objetoProveedor.businessName
        )?.id
      );
    }
    this.serviceStockHistory
      .getStockHistory(
        this.itemsPage,
        this.page,
        this.objetoArticulo.id,
        this.objetoSucursal.id,
        this.objetoProveedor.id,
        this.objetoStockHistory.description
      )
      .subscribe(
        (respuesta) => {
          this.listaStockHistory = respuesta.content;
          this.totalItems = respuesta.meta.totalItems;
        },
        (error) => {
          this.alertasComponent.showOcurrioErrorStrategy(error);
        }
      );
  }

  formatearFecha(fecha: any) {
    const date = new Date(fecha);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const hora = date.getHours();
    const minutos = date.getMinutes();
    const myFormattedDate =
      day.toString().padStart(2, '0') +
      '-' +
      month.toString().padStart(2, '0') +
      '-' +
      year +
      ' ' +
      hora.toString().padStart(2, '0') +
      ':' +
      minutos.toString().padStart(2, '0');
    return myFormattedDate;
  }
}
