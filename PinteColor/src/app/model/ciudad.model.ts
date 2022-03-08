import { ICiudad } from '../interfaces/ciudad.interface';
import { IProvincia } from '../interfaces/provincia.interface';
import { Provincia } from './provincia.modelo';

export class Ciudad implements ICiudad {
  id: number;
  name: string;
  zipCode: number;
  province? : IProvincia;

  constructor(result?: any) {
    if (result) {
      this.id = result.id,
      this.name = result.name,
      this.zipCode = result.zipCode;
      this.province = result.province
    } else {
      this.id = 0, 
      this.name = '', 
      this.zipCode = 0;
      this.province = new Provincia()
    }
  }

  borrarCampos(): void {
    (this.id = 0),
    (this.name = ''),
    (this.zipCode = 0),
    this.province = new Provincia();
}
}
