import { ICiudad } from "./ciudad.interface";

export interface ISucursal{
    id : number;
    name: string;
    phoneNumber: string;
    address: string;
    city: ICiudad;
    isPOS: boolean;
    posFiscalNumber?: string;

    borrarCampos():void
}