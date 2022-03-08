import { ICambioPasswordPerfil } from "src/app/interfaces/usuarios/cambiopasswordabm.interface";

export class CambioPasswordPerfil implements ICambioPasswordPerfil{
    oldPassword: string;
    newPassword: string;
    repeatNewPassword: string;
    
    constructor(){
        this.oldPassword = '';
        this.newPassword = '';
        this.repeatNewPassword = '';
    }
    borrarCampos(): void {
        this.oldPassword = '';
        this.newPassword = '';
        this.repeatNewPassword = '';
    }
}