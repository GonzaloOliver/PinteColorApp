import { ICiudad } from '../interfaces/ciudad.interface';
import { ISucursal } from '../interfaces/sucursal.interface';
import { Ciudad } from './ciudad.model';

export class Sucursal implements ISucursal {
  id: number;
  name: string;
  phoneNumber: string;
  address: string;
  city: ICiudad;
  isPOS: boolean;
  posFiscalNumber?: string;

  constructor(result?: any) {
    if (result) {
      (this.id = result.id),
        (this.name = result.name),
        (this.phoneNumber = result.phoneNumber),
        (this.address = result.address),
        (this.city = new Ciudad(result.city)),
        (this.isPOS = result.isPOS);
      this.posFiscalNumber = result.posFiscalNumber;
    } else {
      (this.id = 0),
        (this.phoneNumber = ''),
        (this.address = ''),
        (this.city = new Ciudad()),
        (this.isPOS = false);
    }
  }

  borrarCampos(): void {
    (this.id = 0),
      (this.name = ''),
      (this.phoneNumber = ''),
      (this.address = ''),
      (this.city = new Ciudad()),
      (this.isPOS = false);
  }
}
