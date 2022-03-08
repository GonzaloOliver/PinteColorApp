import { Router } from '@angular/router';
import { IStrategy } from './strategy_alertas.interface';
import Swal from 'sweetalert2';

export class Error401 implements IStrategy {
  constructor(private router: Router) {}
  ControlarError(): void {
    localStorage.removeItem('userToken');
    this.router.navigate(['/login']);
  }
}
