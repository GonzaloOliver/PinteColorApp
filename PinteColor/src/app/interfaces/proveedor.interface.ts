import { ICiudad } from "./ciudad.interface";

export interface IProveedor {
  id:number;
  businessName: string;
  cuit: string;
  contactFullName: string;
  email: string;
  phoneNumber: string;
  code: string;
  ivaCondition: string;
  address: string;
  city: ICiudad;

  borrarCampos():void
}
