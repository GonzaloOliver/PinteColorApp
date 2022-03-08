import { IProvincia } from '../interfaces/provincia.interface';

export class Provincia implements IProvincia {
  id: number;
  name: string;

  constructor(result?: any) {
    if (result) {
        (this.id = result.id),
        (this.name = result.name);
    } else {
        (this.id = 0),
        (this.name = '');
    }
  }

  borrarCampos(): void {
      (this.id = 0),
      (this.name = '');
  }
}
