import { ISucursal } from "../sucursal.interface";
import { IRoles } from "./roles.interface";

export interface IUser{
    id:number;
    firstName:string;
    lastName:string;
    username:string;
    password:string;
    repeatPassword:string;
    roles:string [];
    store:ISucursal;

    borrarCampos(): void;
}