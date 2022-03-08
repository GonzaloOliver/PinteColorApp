import { IProveedor } from 'src/app/interfaces/proveedor.interface';
import { ISucursal } from 'src/app/interfaces/sucursal.interface';
import { IArticulo } from '../articulo.interface';

export interface IStockHistory {
  id: number;
  date: any;
  action: any;
  change: number;
  description: String;
  good: IArticulo;
  supplier: IProveedor;
  source: ISucursal;
  applyTo: ISucursal;
}
