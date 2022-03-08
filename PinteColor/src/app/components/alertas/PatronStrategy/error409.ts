import { Router } from '@angular/router';
import { IStrategy } from './strategy_alertas.interface';
import Swal from 'sweetalert2';

export class Error409 implements IStrategy {
  mensaje: String = ''
  
  constructor(msg : String) {
    this.mensaje = msg;
  }

  ControlarError(): void {
    Swal.fire({
      icon: 'info',
      title: 'Se ha producido un error..',
      text: 'Comuniquese con su proveedor de Sistemas',

      footer: 'Descripcion: ' + this.mensaje,
    });
  }
}
