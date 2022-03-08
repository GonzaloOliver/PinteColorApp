import { ICambioPasswordAbm } from "src/app/interfaces/usuarios/cambiopasswordperfil.interface";

export class CambioPasswordAbm implements ICambioPasswordAbm{
    newPassword: string;
    repeatNewPassword: string;
    
    constructor(){
        this.newPassword = '';
        this.repeatNewPassword = '';
    }
    borrarCampos(): void {
        this.newPassword = '';
        this.repeatNewPassword = '';
    }

    
}