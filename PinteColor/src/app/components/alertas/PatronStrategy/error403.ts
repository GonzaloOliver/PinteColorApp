import { Router } from '@angular/router';
import { IStrategy } from './strategy_alertas.interface';
import Swal from 'sweetalert2';

export class Error403 implements IStrategy {
  constructor(private router: Router) {}
  ControlarError(): void {
    Swal.fire({
      icon: 'info',
      title: 'Se ha producido un error..',
      text: 'Comuniquese con su proveedor de Sistemas',

      footer:
        'Descripcion: El usuario no posee autorizacion para realizar la accion.',
    });
    this.router.navigate(['/home/dashboard']);
  }
}
