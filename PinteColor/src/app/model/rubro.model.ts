import { IRubro } from "../interfaces/rubro.interface";

export class Rubro implements IRubro{
    id: number;
    name: string;

    constructor(result? : any){
        if(result){
            this.id = result.id,
            this.name = result.name
        } else {
            this.id = 0,
            this.name = ''
        }
    }

    borrarCampos(): void{
        this.id = 0;
        this.name = '';
    }
}