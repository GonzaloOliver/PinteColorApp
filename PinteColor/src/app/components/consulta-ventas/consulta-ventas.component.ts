import { IVenta } from 'src/app/interfaces/venta.interface';
import { Component, OnInit } from '@angular/core';
import { ICliente } from 'src/app/interfaces/cliente.interface';
import { ICondicionIva } from 'src/app/interfaces/condicionesiva.interface';
import { ITipoDocumento } from 'src/app/interfaces/tipodocumento.interface';
import { IProvincia } from 'src/app/interfaces/provincia.interface';
import { ICiudad } from 'src/app/interfaces/ciudad.interface';
import { Cliente } from 'src/app/model/cliente.model';
import { Provincia } from 'src/app/model/provincia.modelo';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AlertasComponent } from '../alertas/alertas.component';
import { SettingsService } from 'src/app/services/settings.service';
import { ClienteService } from 'src/app/services/cliente.service';
import { VentaService } from 'src/app/services/venta.service';
import { ProvinciaService } from 'src/app/services/provincia.service';
import { Ciudad } from 'src/app/model/ciudad.model';
import { ITipoComprobante } from 'src/app/interfaces/tipoComprobante.interface';
import { AlertasIconos } from '../alertas/alertas_iconos.enum';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Venta } from 'src/app/model/venta.model';
import { unwatchFile } from 'fs';

@Component({
  selector: 'app-consulta-ventas',
  templateUrl: './consulta-ventas.component.html',
  styleUrls: ['./consulta-ventas.component.css'],
})
export class ConsultaVentasComponent implements OnInit {
  public contactFormulario: FormGroup;

  filtroBusquedaCliente: string;
  filtroBusquedaClienteId: number;
  filtroBusquedaTipoComprobante: string;
  filtroBusquedaFechaDesde: string = '';
  filtroBusquedaFechaHasta: string = '';

  listaComprobantes: IVenta[] = [];
  listaClientes: ICliente[] = [];
  listaTipoComprobante: ITipoComprobante[] = [];
  listaCondicionesIva: ICondicionIva[] = [];
  listaTipoDocumento: ITipoDocumento[] = [];
  listaProvincias: IProvincia[] = [];
  listaCiudades: ICiudad[] = [];
  selectCondicionVenta: String;

  page: number = 1;
  itemsPage: number = 5;
  totalItems: number = 10;
  cantidadItems: number = 0;

  objetoCliente: ICliente = new Cliente();
  objetoProvincia: IProvincia = new Provincia();
  objetoVenta: IVenta = new Venta();
  objetoProvinciaParaCliente: IProvincia = new Provincia();

  condiciones = [{ name: 'Contado' }, { name: 'Cuenta Corriente' }];
  constructor(
    private router: Router,
    private alertasComponent: AlertasComponent,
    private settingsService: SettingsService,
    private serviceCliente: ClienteService,
    private serviceVenta: VentaService,
    private serviceProvincias: ProvinciaService
  ) {}

  ngOnInit(): void {
    this.listarComprobantes();
    this.buscarTipoComprobantes();
    this.buscarClientes();
  }

  buscarCondicionesIva() {
    this.settingsService.getCondicionesIva().subscribe(
      (respuesta) => {
        this.listaCondicionesIva = respuesta;
      },
      (error) => {
        this.alertasComponent.showOcurrioErrorStrategy(error);
      }
    );
  }

  buscarClientes() {
    this.serviceCliente.getClientesAll().subscribe(
      (respuesta) => {
        this.listaClientes = respuesta;
      },
      (error) => {
        this.alertasComponent.showOcurrioErrorStrategy(error);
      }
    );
  }

  buscarTipoComprobantes() {
    this.settingsService.getTipoComprobante().subscribe(
      (respuesta) => {
        this.listaTipoComprobante = respuesta;
      },
      (error) => {
        this.alertasComponent.showOcurrioErrorStrategy(error);
      }
    );
  }

  buscarTipoDocumento() {
    this.settingsService.getTipoDocumento().subscribe(
      (respuesta) => {
        this.listaTipoDocumento = respuesta;
      },
      (error) => {
        this.alertasComponent.showOcurrioErrorStrategy(error);
      }
    );
  }

  listarProvincias() {
    this.serviceProvincias.getProvincias().subscribe(
      (respuesta) => {
        this.listaProvincias = respuesta;
      },
      (error) => {
        this.alertasComponent.showOcurrioErrorStrategy(error);
      }
    );
  }

  seleccionVentaModificacion(venta: IVenta) {
    this.serviceVenta.getVentaById(venta.id).subscribe((result) => {
      this.objetoVenta = new Venta(result);
      this.selectCondicionVenta = this.mostrarCondicionDeVenta(
        this.objetoVenta.isDebt
      );
    });
  }

  listarCiudadesByProvincia() {
    if (this.objetoProvincia.name != null) {
      this.serviceProvincias
        .getCiudadByProvincia(this.objetoProvincia.id)
        .subscribe(
          (res) => {
            this.listaCiudades = res;
            this.objetoCliente.city = new Ciudad();
          },
          (error) => {
            this.alertasComponent.showOcurrioErrorStrategy(error);
          }
        );
    }
  }

  listarComprobantes() {
    //Obtiene en base al nombre del cliente seleccion el id del cliente para poder filtrarlo
    if (
      this.filtroBusquedaCliente != '' &&
      this.filtroBusquedaCliente != null
    ) {
      this.filtroBusquedaClienteId = Number(
        this.listaClientes.find(
          (cliente) => cliente.businessName == this.filtroBusquedaCliente
        )?.id
      );
    } else {
      this.filtroBusquedaClienteId = 0;
    }
    //Obtiene listado de ventas pasando por parametros filtros de cliente y tipo de comprobante
    this.serviceVenta
      .getVentasPaginado(
        this.itemsPage,
        this.page,
        this.filtroBusquedaTipoComprobante,
        this.filtroBusquedaClienteId,
        this.filtroBusquedaFechaDesde,
        this.filtroBusquedaFechaHasta
      )
      .subscribe(
        (respuesta) => {
          this.listaComprobantes = respuesta.content;
          this.totalItems = respuesta.meta.totalItems;
        },
        (error) => {
          this.alertasComponent.showOcurrioErrorStrategy(error);
        }
      );
  }
  esRecibo() {
    if (
      this.objetoVenta.proofType.value == 'Recibo' ||
      this.objetoVenta.proofType.value == 'ReciboX'
    ) {
      return true;
    } else {
      return false;
    }
  }
  modificarVenta() {
    this.objetoVenta.isDebt = this.obtenerCondicionVenta(
      this.selectCondicionVenta
    );

    this.serviceVenta.modificarVenta(this.objetoVenta).subscribe(
      () => {
        Swal.fire(
          'Confirmado',
          'Se modifico correctamente el comprobante.',
          'success'
        ).then(() => {
          window.location.reload();
        });
      },
      (error) => {
        this.alertasComponent.showOcurrioErrorStrategy(error);
      }
    );
  }

  eliminarVenta(id: number) {
    Swal.fire({
      title: '¿Esta seguro que desea eliminar el comprobante?',
      icon: 'error',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.serviceVenta.getVentaById(id).subscribe(
          (respuesta) => {
            var objventa = new Venta(respuesta);
            this.serviceVenta.eliminarVenta(id).subscribe(
              () => {
                this.listarComprobantes();
              },
              (error) => {
                if (objventa.remito.id != 0) {
                  Swal.fire({
                    title: 'Se ha ocurrido un error',
                    text: error.error.message,
                    icon: 'error',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Forzar Eliminado',
                    cancelButtonText: 'Cancelar',
                  }).then((result) => {
                    if (result.isConfirmed) {
                      Swal.fire({
                        title:'¿Esta seguro?',
                        text:'Al momento de forzar el borrado se eliminara el remito y la factura asociada.',
                        icon: 'error',
                        showCancelButton: true,
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#d33',
                        confirmButtonText: 'Si',
                        cancelButtonText: 'Cancelar',
                      }).then((result) => {
                        if (result.isConfirmed) {
                          this.serviceVenta.eliminarForceVenta(id).subscribe(
                            () => {
                              this.listarComprobantes();
                            },
                            (error) => {
                              this.alertasComponent.showOcurrioErrorStrategy(
                                error
                              );
                            }
                          );
                          this.showModalEliminar();
                        }
                      });
                    }
                  });
                } else {
                  this.alertasComponent.showOcurrioErrorStrategy(error);
                }
              }
            );
            this.showModalEliminar();
          },
          (error) => {
            this.alertasComponent.showOcurrioErrorStrategy(error);
          }
        );
      }
    });
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

  cancelarEdicionComprobante() {
    this.showModalCancelar();
  }
  formatearListaPrecio(listaprecio: any) {
    if (listaprecio == '' || listaprecio == null) {
      return '';
    } else {
      return listaprecio.name;
    }
  }

  mostrarCondicionDeVenta(condicion: any) {
    if (condicion) {
      return 'Cuenta Corriente';
    } else {
      return 'Contado';
    }
  }

  obtenerCondicionVenta(isDebt: any) {
    if (isDebt == 'Cuenta Corriente') {
      return true;
    } else {
      return false;
    }
  }

  showModalSuccessSave() {
    this.alertasComponent.showModalInformacion(AlertasIconos.Guardar);
  }

  showModalCancelar() {
    this.alertasComponent.showModalInformacion(AlertasIconos.Cancelar);
  }

  showModalEliminar() {
    this.alertasComponent.showModalInformacion(AlertasIconos.Eliminar);
  }
}
