import { IAlicuotaIva } from "../interfaces/alicuotaiva.interface";

export class AlicuotaIva implements IAlicuotaIva {
    name: string;
    value: string;

    constructor(result? : any){
        if(result){
            this.value = result.value;
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