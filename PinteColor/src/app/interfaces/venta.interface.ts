import { ITipoComprobante } from './tipoComprobante.interface';
import { IDetalleVenta } from './detalleVenta.interface';
import { ISucursal } from 'src/app/interfaces/sucursal.interface';
import { IUser } from 'src/app/interfaces/usuarios/user.interface';
import { ICliente } from 'src/app/interfaces/cliente.interface';
import { IListaPrecio } from './listaprecio.interface';

export interface IVenta {
  id: number;
  saleNumber: number;
  proofType: ITipoComprobante;
  discountStock: boolean;
  customer: ICliente;
  pricelist: IListaPrecio;
  user: IUser;
  pos: ISucursal;
  date: Date;
  details: IDetalleVenta[];
  amount?: number;
  commentary?: String;
  isDebt: boolean;
  afipNumber?: string;
  remito?: any;
  pricelistDiscount: number;
}
