import { IProveedor } from '../proveedor.interface';
import { IStockItemLista } from './stockItemLista.interface';

export interface IStockMasivo {
  supplier: Number;
  supplierName: String;
  description?: String;
  stocks: IStockItemLista[];

  borrarCampos(): void;
}
