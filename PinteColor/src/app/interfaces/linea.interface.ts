import { IRubro } from "./rubro.interface";

export interface ILinea{
    id : number;
    name: string;
    sector:IRubro;
    
    borrarCampos():void;
}