import { TipoComprobante } from './tipoComprobante.model';
import { Sucursal } from 'src/app/model/sucursal.model';
import { Usuario } from 'src/app/model/Usuarios/usuario.model';
import { Cliente } from 'src/app/model/cliente.model';
import { ICliente } from '../interfaces/cliente.interface';
import { ISucursal } from '../interfaces/sucursal.interface';
import { IUser } from '../interfaces/usuarios/user.interface';
import { IVenta } from '../interfaces/venta.interface';
import { ITipoComprobante } from '../interfaces/tipoComprobante.interface';
import { IDetalleVenta } from '../interfaces/detalleVenta.interface';
import { IListaPrecio } from '../interfaces/listaprecio.interface';
import { ListaPrecio } from './listaprecio.model';
import { DetalleVenta } from './detalleVenta.model';

export class Venta implements IVenta {
  user: IUser;
  pos: ISucursal;
  date: Date;
  id: number;
  customer: ICliente;
  saleNumber: number;
  proofType: ITipoComprobante;
  discountStock: boolean;
  details: IDetalleVenta[];
  amount?: number;
  pricelist: IListaPrecio;
  commentary?: String;
  isDebt: boolean;
  afipNumber?: string;
  remito?: any;
  pricelistDiscount: number;

  constructor(result?: any) {
    if (result) {
      this.id = result.id;
      this.saleNumber = result.saleNumber;
      this.pos = new Sucursal(result.pos);
      this.proofType = new TipoComprobante({ value: result.proofType });
      this.date = result.date;
      this.commentary = result.commentary;
      this.isDebt = result.isDebt;
      this.discountStock = result.discountStock;
      this.afipNumber = result.afipNumber;
      this.user = new Usuario(result.user);
      this.customer = new Cliente(result.customer);
      this.pricelist = new ListaPrecio(result.pricelist);
      this.details = result.details;
      this.remito = result.remito;
      this.amount = result.amount;
      this.pricelistDiscount = result.pricelistDiscount;
    } else {
      this.id = 0;
      this.saleNumber = 0;
      this.afipNumber = '';
      this.commentary = '';
      this.remito = {};
      this.isDebt = false;
      this.pos = new Sucursal();
      this.proofType = new TipoComprobante();
      this.date = this.date;
      this.discountStock = false;
      this.user = new Usuario();
      this.customer = new Cliente();
      this.pricelist = new ListaPrecio();
    }
  }

  borrarCampos(): void {
    this.id = 0;
    this.saleNumber = 0;
    this.pos = new Sucursal();
    this.proofType = new TipoComprobante();
    this.date = this.date;
    this.discountStock = false;
    this.user = new Usuario();
    this.customer = new Cliente();
    this.pricelist = new ListaPrecio();
    this.commentary = '';
    this.isDebt = false;
    this.afipNumber = '';
    this.remito = {};
  }
}
