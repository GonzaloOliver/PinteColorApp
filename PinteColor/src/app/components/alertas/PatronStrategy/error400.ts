import { Router } from '@angular/router';
import { IStrategy } from './strategy_alertas.interface';
import Swal from 'sweetalert2';

export class Error400 implements IStrategy {
  mensaje: String = '';

  constructor(msg: any) {
    this.mensaje = msg;
  }

  ControlarError(): void {
    Swal.fire({
      icon: 'error',
      title: 'Se ha producido un error..',
      text: 'Descripcion: ' + this.mensaje,

      footer: '',
    });
  }
}
