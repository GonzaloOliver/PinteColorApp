import { IListadoStock } from '../interfaces/IListadoStock.interface';

export class ListadoStock implements IListadoStock {
  id: number;
  name: string;
  discount: number;
  storeId: number;
  goodCode: string;
  quantity: number;

  constructor(result?: any) {
    if (result) {
      (this.id = result.id), (this.name = result.name);
      (this.id = result.id), (this.goodCode = result.goodCode);
      this.discount = result.discount;
      this.storeId = result.storeId;
      this.quantity = result.quantity;
    } else {
      (this.id = 0), (this.name = '');
      (this.id = 0), (this.goodCode = '');
      this.discount = 0;
      this.storeId = 0;
      this.quantity = 0;
    }
  }
}
