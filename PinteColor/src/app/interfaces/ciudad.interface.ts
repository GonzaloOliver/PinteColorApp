import { IProvincia } from "./provincia.interface";

export interface ICiudad {
    id:number;
    name: string;
    zipCode: number;
    province? :IProvincia;

    borrarCampos():void
}