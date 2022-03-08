import { IListaPrecio } from '../interfaces/listaprecio.interface';
export class ListaPrecio implements IListaPrecio {
  id: number;
  name: string;
  value: number;

  constructor(result?: any) {
    if (result) {
      (this.id = result.id), (this.name = result.name);
      this.value = result.value;
    } else {
      (this.id = 0), (this.name = ''), (this.value = 0);
    }
  }
}
