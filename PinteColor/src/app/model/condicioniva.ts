import { ICondicionIva } from '../interfaces/condicionesiva.interface';

export class CondicionIva implements ICondicionIva {
  name: string;
  value: string;

  constructor(result?: any) {
    if (result) {
      (this.name = ''), (this.value = result);
    } else {
      (this.name = ''), (this.value = '');
    }
  }
}
