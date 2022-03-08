import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ICliente } from 'src/app/interfaces/cliente.interface';
import { IVenta } from 'src/app/interfaces/venta.interface';
import { Cliente } from 'src/app/model/cliente.model';
import { ClienteService } from 'src/app/services/cliente.service';
import { VentaService } from 'src/app/services/venta.service';
import { AlertasComponent } from '../alertas/alertas.component';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-detalle-cuenta-corriente',
  templateUrl: './detalle-cuenta-corriente.component.html',
  styleUrls: ['./detalle-cuenta-corriente.component.css'],
})
export class DetalleCuentaCorrienteComponent implements OnInit {
  fileName = 'Detallectacte.xlsx';
  exportexcel(): void {
    /* table id is passed over here */
    let element = document.getElementById('listado_proveedores');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, this.fileName);
  }

  id: string = '';
  saldototal: string = '';

  page: number = 1;
  itemsPage: number = 5;
  totalItems: number = 10;
  cantidadItems: number = 0;

  objetoCliente: ICliente = new Cliente();
  saldo: string = '';

  listaDetalleVenta: IVenta[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private serviceVenta: VentaService,
    private alertasComponent: AlertasComponent,
    private clienteService: ClienteService
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id')!;
    this.listarDetalleVenta();
    this.getSaldoCliente();
    this.getDatosCliente();
  }

  listarDetalleVenta() {
    this.serviceVenta
      .getSalesByCustomerSPR(this.itemsPage, this.page, this.id)
      .subscribe(
        (respuesta) => {
          this.listaDetalleVenta = respuesta.content;
          this.totalItems = respuesta.meta.totalItems;
        },
        (error) => {
          this.alertasComponent.showOcurrioErrorStrategy(error);
        }
      );
  }

  getSaldoCliente() {
    this.clienteService.getSaldoClienteById(this.id).subscribe(
      (respuesta) => {
        this.saldototal = respuesta.totalDebt;
      },
      (error) => {
        this.alertasComponent.showOcurrioErrorStrategy(error);
      }
    );
  }

  getDatosCliente() {
    this.clienteService.getClienteById(this.id).subscribe(
      (respuesta) => {
        this.objetoCliente = new Cliente(respuesta);
      },
      (error) => {
        this.alertasComponent.showOcurrioErrorStrategy(error);
      }
    );
  }

  saldoTotalFormateado(){
    return Number(this.saldototal).toFixed(2);
  }
  
  esSaldoPositivo() {
    if (Number(this.saldototal) > 0) {
      return true;
    } else {
      return false;
    }
  }
  esSaldoCero() {
    if (Number(this.saldototal) == 0) {
      return true;
    } else {
      return false;
    }
  }
  esSaldoNegativo() {
    if (Number(this.saldototal) < 0) {
      return true;
    } else {
      return false;
    }
  }

  formatearFecha(fecha: any) {
    const date = new Date(fecha);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const hora = date.getHours();
    const minutos = date.getMinutes();
    const myFormattedDate =
      day.toString().padStart(2, '0') +
      '-' +
      month.toString().padStart(2, '0') +
      '-' +
      year +
      ' ' +
      hora.toString().padStart(2, '0') +
      ':' +
      minutos.toString().padStart(2, '0');
    return myFormattedDate;
  }
}
