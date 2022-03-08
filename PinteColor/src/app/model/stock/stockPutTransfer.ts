import { IStockItemLista } from 'src/app/interfaces/stock/stockItemLista.interface';
import { IStockPutTransfer } from 'src/app/interfaces/stock/stockPutTransfer.interface';

export class StockPutTransfer implements IStockPutTransfer {
  originStoreId: number;
  destinationStoreId: number;
  description?: string;
  stocks: IStockItemLista[];

  constructor() {
    this.originStoreId = 0;
    this.destinationStoreId = 0;
    this.description = '';
    this.stocks = [];
  }

  borrarCampos(): void {
    this.originStoreId = 0;
    this.destinationStoreId = 0;
    this.description = '';
    this.stocks = [];
  }
}
