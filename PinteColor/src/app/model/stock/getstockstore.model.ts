import { IArticulo } from 'src/app/interfaces/articulo.interface';
import { IGetStockStore } from 'src/app/interfaces/stock/getstockstore.interface';
import { ISucursal } from 'src/app/interfaces/sucursal.interface';
import { Articulo } from '../articulo.model';
import { Sucursal } from '../sucursal.model';

export class GetStockStore implements IGetStockStore {
  quantity: number;
  good: IArticulo;
  store: ISucursal;

  constructor(result?: any) {
    if (result) {
      this.quantity = result.quantity;
      this.good = new Articulo(result.good);
      this.store = new Sucursal(result.store);
    } else {
      this.quantity = 0;
      this.good = new Articulo();
      this.store = new Sucursal();
    }
  }
}
