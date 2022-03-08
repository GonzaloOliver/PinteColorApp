import { RubroComponent } from "../components/rubro/rubro.component";
import { IArticulo } from "../interfaces/articulo.interface";
import { ILinea } from "../interfaces/linea.interface";
import { IRubro } from "../interfaces/rubro.interface";
import { Rubro } from "./rubro.model";

export class Linea implements ILinea{
    id: number;
    name: string;
    sector: IRubro;

    constructor(result? : any){
        if(result){
            this.id = result.id,
            this.name = result.name,
            this.sector = new Rubro(result.sector);
        } else {
            this.id = 0,
            this.name = '',
            this.sector = new Rubro();
        }
    };
    
    borrarCampos(): void {
        this.id = 0,
        this.name = '',
        this.sector = new Rubro();
    }

    
}