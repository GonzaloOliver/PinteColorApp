import { IUnidadMedida } from "../interfaces/unidadmedida.interface";

export class UnidadMedida implements IUnidadMedida {
    name: string;
    value: string;

    constructor(result? : any){
        if(result){
            this.value = result.id;
            this.name = result.name;
        } else {
            this.value = '';
            this.name = '';
        }
    }

    borrarCampos(): void{
        this.name = '';
        this.value = '';
    }
}