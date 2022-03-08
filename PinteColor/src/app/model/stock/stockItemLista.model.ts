import { IStockItemLista } from 'src/app/interfaces/stock/stockItemLista.interface';

export class StockItemLista implements IStockItemLista {
  goodId: number;
  goodCode: String;
  goodName: String;
  stockActual: number;
  quantity: number;
  stockOrigen: number;
  stockDestino: number;
  stockOrigenFuturo: number;
  stockDestinoFuturo: number;
  storeId: number;
  storeIdDestino: number;
  storeNameOrigen: String;
  storeNameDestino: String;

  constructor(datos?: any) {
    if (datos) {
      (this.goodId = datos.goodId),
        (this.storeNameOrigen = datos.storeNameOrigen),
        (this.storeNameDestino = datos.storeNameDestino),
        (this.goodName = datos.goodName),
        (this.goodCode = datos.goodCode),
        (this.quantity = datos.quantity),
        (this.stockOrigen = datos.stockOrigen),
        (this.stockDestino = datos.stockDestino),
        (this.stockOrigenFuturo = datos.stockOrigenFuturo),
        (this.storeId = datos.storeId),
        (this.storeIdDestino = datos.storeIdDestino),
        (this.stockDestinoFuturo = datos.stockDestinoFuturo);
    } else {
      (this.goodId = 0),
        (this.storeNameOrigen = ''),
        (this.storeNameDestino = ''),
        (this.goodName = ''),
        (this.goodCode = ''),
        (this.quantity = 0),
        (this.stockOrigen = 0),
        (this.stockDestino = 0),
        (this.stockOrigenFuturo = 0),
        (this.storeId = 0),
        (this.storeIdDestino = 0),
        (this.stockDestinoFuturo = 0);
    }
  }

  convertirNumber(): void {
    this.goodId = Number(this.goodId);
    this.quantity = Number(this.quantity);
    this.stockOrigen = Number(this.stockOrigen);
    this.stockDestino = Number(this.stockDestino);
    this.stockOrigenFuturo = Number(this.stockOrigenFuturo);
    this.storeId = Number(this.storeId);
    this.storeIdDestino = Number(this.storeIdDestino);
    this.stockDestinoFuturo = Number(this.stockDestinoFuturo);
  }

  borrarCampos(): void {
    (this.goodId = 0),
      (this.goodName = ''),
      (this.goodCode = ''),
      (this.storeNameOrigen = ''),
      (this.storeNameDestino = ''),
      (this.quantity = 0),
      (this.stockOrigen = 0),
      (this.stockDestino = 0),
      (this.stockOrigenFuturo = 0),
      (this.storeId = 0),
      (this.storeIdDestino = 0),
      (this.stockDestinoFuturo = 0);
  }
}
