import { IArticulo } from 'src/app/interfaces/articulo.interface';
import { IVenta } from '../interfaces/venta.interface';

export interface IDetalleVenta {
  id: number;
  sale: IVenta;
  good: IArticulo;
  quantity: number;
  price: number;
  cost: number;
}
