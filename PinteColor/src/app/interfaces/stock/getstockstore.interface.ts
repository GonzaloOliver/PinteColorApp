import { ISucursal } from 'src/app/interfaces/sucursal.interface';
import { IArticulo } from '../articulo.interface';

export interface IGetStockStore {
  quantity: number;
  good: IArticulo;
  store: ISucursal;
}
