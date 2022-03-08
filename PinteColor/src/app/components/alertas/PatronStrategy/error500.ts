import { IStrategy } from "./strategy_alertas.interface";
import Swal from 'sweetalert2';

export class Error500 implements IStrategy{
    ControlarError(): void {
        Swal.fire({
            icon: 'question',
            title: 'Codigo de error: 500',
            text: 'Comuniquese con su proveedor de Sistemas',
    
            footer: 'Descripcion: Se produjo un error al intentar acceder al servidor.',
          });
    }

}