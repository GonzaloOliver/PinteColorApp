import { SaldoCliente } from './saldocliente.model';
import { ICiudad } from '../interfaces/ciudad.interface';
import { ICliente } from '../interfaces/cliente.interface';
import { ICondicionIva } from '../interfaces/condicionesiva.interface';
import { ISaldoCliente } from '../interfaces/saldocliente.interface';
import { Ciudad } from './ciudad.model';
import { CondicionIva } from './condicioniva';

export class Cliente implements ICliente {
  id: number;
  businessName: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  idType: string;
  idNumber: string;
  birthdayDate: string;
  ivaCondition: ICondicionIva;
  address: string;
  city: ICiudad;
  debtReturn: ISaldoCliente;

  constructor(result?: any) {
    if (result) {
      (this.id = result.id),
        (this.firstName = result.firstName),
        (this.businessName = result.businessName),
        (this.lastName = result.lastName),
        (this.email = result.email),
        (this.phoneNumber = result.phoneNumber),
        (this.address = result.address),
        (this.idNumber = result.idNumber),
        (this.idType = result.idType),
        (this.birthdayDate = result.birthdayDate),
        (this.ivaCondition = new CondicionIva(result.ivaCondition)),
        (this.city = new Ciudad(result.city)),
        (this.debtReturn = new SaldoCliente(result.debtReturn));
    } else {
      (this.id = 0),
        (this.firstName = ''),
        (this.businessName = ''),
        (this.lastName = ''),
        (this.email = ''),
        (this.phoneNumber = ''),
        (this.address = ''),
        (this.idNumber = ''),
        (this.idType = ''),
        (this.birthdayDate = ''),
        (this.ivaCondition = new CondicionIva()),
        (this.city = new Ciudad()),
        (this.debtReturn = new SaldoCliente());
    }
  }

  borrarCampos(): void {
    (this.id = 0),
      (this.firstName = ''),
      (this.businessName = ''),
      (this.lastName = ''),
      (this.email = ''),
      (this.phoneNumber = ''),
      (this.address = ''),
      (this.idNumber = ''),
      (this.idType = ''),
      (this.birthdayDate = ''),
      (this.ivaCondition = new CondicionIva()),
      (this.city = new Ciudad()),
      (this.debtReturn = new SaldoCliente());
  }
}
