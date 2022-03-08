export interface IStockItemLista {
  goodId: number;
  goodCode: String;
  goodName: String;
  stockOrigen: number;
  stockDestino: number;
  quantity: number;
  stockOrigenFuturo: number;
  stockDestinoFuturo: number;
  storeId: number;
  storeIdDestino: number;
  storeNameOrigen: String;
  storeNameDestino: String;

  borrarCampos(): void;
  convertirNumber(): void;
}
