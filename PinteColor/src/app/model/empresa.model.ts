import { IEmpresa } from '../interfaces/empresa.interface';

export class Empresa implements IEmpresa {
  email: string;
  businessName: string;
  cuit: string;
  ivaCondition: string;

  constructor(result?: any) {
    if (result) {
      (this.email = result.email),
        (this.businessName = result.businessName),
        (this.cuit = result.cuit),
        (this.ivaCondition = result.ivaCondition);
    } else {
      (this.email = ''),
        (this.businessName = ''),
        (this.cuit = ''),
        (this.ivaCondition = '');
    }
  }
}
