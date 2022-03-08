import { Router } from "@angular/router";
import { IStrategy } from "./strategy_alertas.interface";

export class Error404 implements IStrategy{

    constructor(private router: Router){

    }
    ControlarError(): void {
        this.router.navigate(['/error404']);
    }

}