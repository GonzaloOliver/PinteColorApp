import { IMarca } from '../interfaces/marca.interface';

export class Marca implements IMarca {
    id : number;
    name: string;

    constructor(result? : any){
        if(result){
            this.id = result.id,
            this.name = result.name;
        } else {
            this.id = 0,
            this.name = '';
        }
    }

}