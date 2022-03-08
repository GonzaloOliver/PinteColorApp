import { IStockItemLista } from './stockItemLista.interface';

export interface IStockPutTransfer {
  originStoreId: number;
  destinationStoreId: number;
  description?: string;
  stocks: IStockItemLista[];
}
