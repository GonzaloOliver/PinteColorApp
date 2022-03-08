import { IArticulo } from 'src/app/interfaces/articulo.interface';
import { Articulo } from 'src/app/model/articulo.model';
import { Venta } from './venta.model';
import { Sucursal } from 'src/app/model/sucursal.model';
import { Usuario } from 'src/app/model/Usuarios/usuario.model';
import { IDetalleVenta } from '../interfaces/detalleVenta.interface';
import { IVenta } from '../interfaces/venta.interface';

export class DetalleVenta implements IDetalleVenta {
  id: number;
  sale: IVenta;
  good: IArticulo;
  quantity: number;
  price: number;
  cost: number;

  constructor(result?: any) {
    if (result) {
      this.id = result.id;
      this.quantity = result.quantity;
      this.price = result.price;
      this.cost = result.cost;
      this.good = new Articulo(result.good);
      this.sale = new Venta(result.sale);
    } else {
      this.id = 0;
      this.quantity = 0;
      this.price = 0;
      this.cost = 0;
      this.good = new Articulo();
      this.sale = new Venta();
    }
  }

  borrarCampos(): void {
    this.id = 0;
    this.quantity = 0;
    this.price = 0;
    this.cost = 0;
    this.good = new Articulo();
    this.sale = new Venta();
  }
}
