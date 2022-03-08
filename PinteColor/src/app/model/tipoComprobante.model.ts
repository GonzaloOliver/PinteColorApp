import { ITipoComprobante } from '../interfaces/tipoComprobante.interface';

export class TipoComprobante implements ITipoComprobante {
  name: string;
  value: string;
  constructor(result?: any) {
    if (result) {
      (this.name = result.name), (this.value = result.value);
    } else {
      (this.name = ''), (this.value = '');
    }
  }
  borrarCampos(): void {
    this.name = '';
    this.value = '';
  }
}
