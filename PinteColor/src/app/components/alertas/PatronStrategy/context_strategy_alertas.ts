import { IStrategy } from "./strategy_alertas.interface";

export class ContextStrategy {
    strategy : IStrategy | undefined;

    setStrategy(strategia : IStrategy){
        this.strategy = strategia;
    }

    executeStrategy(){
        return this.strategy?.ControlarError()
    }
}