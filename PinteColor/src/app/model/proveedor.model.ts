import { ICiudad } from '../interfaces/ciudad.interface';
import { IProveedor } from '../interfaces/proveedor.interface';
import { Ciudad } from './ciudad.model';

export class Proveedor implements IProveedor {
  id: number;
  businessName: string;
  cuit: string;
  contactFullName: string;
  email: string;
  phoneNumber: string;
  code: string;
  ivaCondition: string;
  address: string;
  city: ICiudad;

  constructor(result?: any) {
    if (result) {
      (this.id = result.id),
        (this.contactFullName = result.contactFullName),
        (this.businessName = result.businessName),
        (this.code = result.code),
        (this.cuit = result.cuit),
        (this.email = result.email),
        (this.phoneNumber = result.phoneNumber),
        (this.ivaCondition = result.ivaCondition),
        (this.address = result.address),
        (this.city = new Ciudad(result.city));
    } else {
      (this.id = 0),
        (this.contactFullName = ''),
        (this.code = ''),
        (this.cuit = ''),
        (this.email = ''),
        (this.phoneNumber = ''),
        (this.ivaCondition = ''),
        (this.address = ''),
        (this.city = new Ciudad());
    }
  }

  borrarCampos(): void {
    (this.id = 0),
      (this.contactFullName = ''),
      (this.businessName = ''),
      (this.code = ''),
      (this.cuit = ''),
      (this.email = ''),
      (this.phoneNumber = ''),
      (this.ivaCondition = ''),
      (this.address = ''),
      (this.city = new Ciudad());
  }
}
