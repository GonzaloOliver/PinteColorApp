import { IProveedor } from 'src/app/interfaces/proveedor.interface';
import { IStockItemLista } from 'src/app/interfaces/stock/stockItemLista.interface';
import { IStockMasivo } from 'src/app/interfaces/stock/stockMasivo.interface';
import { Proveedor } from '../proveedor.model';
import { StockItemLista } from './stockItemLista.model';

export class StockMasivo implements IStockMasivo {
  supplier: Number;
  supplierName: String;
  description: String;
  stocks: IStockItemLista[];

  constructor() {
    this.description = '';
    this.supplierName = '';
    this.supplier = 0;
    this.stocks = [];
  }

  borrarCampos(): void {
    this.description = '';
    this.supplierName = '';
    this.supplier = 0;
    this.stocks = [];
  }
}
