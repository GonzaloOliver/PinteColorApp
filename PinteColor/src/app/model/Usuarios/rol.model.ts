import { IRoles } from "../../interfaces/usuarios/roles.interface";

export class Rol implements IRoles{
    name: string;
    value: string;

    constructor(result? : any){
        if(result){
            this.name = result.name,
            this.value = result.value
        } else {
            this.name = '',
            this.value = ''
        }
    }

    borrarCampos(): void{
        this.name = '';
        this.value = '';
    }
}
