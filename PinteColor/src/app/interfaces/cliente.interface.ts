import { ISaldoCliente } from './saldocliente.interface';
import { ICiudad } from './ciudad.interface';
import { ICondicionIva } from './condicionesiva.interface';

export interface ICliente {
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

  borrarCampos(): void;
}
