import { IStockHistory } from './../../interfaces/stock/stockhistory.interface';
import { IArticulo } from 'src/app/interfaces/articulo.interface';
import { IProveedor } from 'src/app/interfaces/proveedor.interface';
import { ISucursal } from 'src/app/interfaces/sucursal.interface';
import { Articulo } from '../articulo.model';
import { Proveedor } from '../proveedor.model';
import { Sucursal } from '../sucursal.model';

export class StockHistory implements IStockHistory {
  id: number;
  action: any;
  date: any;
  change: number;
  description: String;
  good: IArticulo;
  supplier: IProveedor;
  source: ISucursal;
  applyTo: ISucursal;

  constructor() {
    this.id = 0;
    this.date = '';
    this.action = '';
    this.change = 0;
    this.description = '';
    this.good = new Articulo();
    this.supplier = new Proveedor();
    this.source = new Sucursal();
    this.applyTo = new Sucursal();
  }
}
