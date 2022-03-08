import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import Swal from 'sweetalert2';
import { AlertasIconos } from './alertas_iconos.enum';
import { ContextStrategy } from './PatronStrategy/context_strategy_alertas';
import { Error400 } from './PatronStrategy/error400';
import { Error401 } from './PatronStrategy/error401';
import { Error403 } from './PatronStrategy/error403';
import { Error404 } from './PatronStrategy/error404';
import { Error409 } from './PatronStrategy/error409';
import { Error500 } from './PatronStrategy/error500';

@Component({
  selector: 'app-alertas',
  template: '',
})
export class AlertasComponent implements OnInit {
  contexto_error: ContextStrategy = new ContextStrategy();
  constructor(private router: Router) {}

  ngOnInit(): void {}

  obtengoConfirmacion(error: any) {
    if (error.status == 200) {
      return true;
    } else {
      return false;
    }
  }

  showOcurrioErrorStrategy(error: any) {
    let mensaje_error = error.error.message;

    if (error.status == 400) {
      this.contexto_error?.setStrategy(new Error400(mensaje_error));
    } else if (error.status == 401) {
      this.contexto_error?.setStrategy(new Error401(this.router));
    } else if (error.status == 403) {
      this.contexto_error?.setStrategy(new Error403(this.router));
    } else if (error.status == 404) {
      this.contexto_error?.setStrategy(new Error404(this.router));
    } else if (error.status == 409) {
      this.contexto_error?.setStrategy(new Error409(mensaje_error));
    } else if (error.status == 500) {
      this.contexto_error?.setStrategy(new Error500());
    } //ELSE ERROR 500

    //EJECUTO ESTRATEGIA
    this.contexto_error?.executeStrategy();
  }

  showModalInformacion(icono: any) {
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 1500,
      timerProgressBar: true,
      onOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer);
        toast.addEventListener('mouseleave', Swal.resumeTimer);
      },
    });

    if (icono == AlertasIconos.Eliminar) {
      Toast.fire({
        icon: icono,
        title: ' Eliminado correctamente ',
      });
    } else if (icono == AlertasIconos.Guardar) {
      Toast.fire({
        icon: icono,
        title: ' Guardado correctamente ',
      });
    } else if (icono == AlertasIconos.Cancelar) {
      Toast.fire({
        icon: icono,
        title: ' La operacion fue cancelada ',
      });
    }
  }
}
