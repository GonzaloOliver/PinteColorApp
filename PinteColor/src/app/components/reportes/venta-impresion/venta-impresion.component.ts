import { Component, OnInit } from '@angular/core';
import * as pdfMake from 'pdfmake/build/pdfmake';
import { IArticulo } from 'src/app/interfaces/articulo.interface';
import { Empresa } from 'src/app/model/empresa.model';
import { IEmpresa } from 'src/app/interfaces/empresa.interface';
import { AlertasComponent } from 'src/app/components/alertas/alertas.component';
import { SettingsService } from 'src/app/services/settings.service';
import { ISucursal } from 'src/app/interfaces/sucursal.interface';
import { SucursalService } from './../../../services/sucursal.service';
import { Sucursal } from 'src/app/model/sucursal.model';
import { StockService } from 'src/app/services/stock.service';
import { IGetStockStore } from 'src/app/interfaces/stock/getstockstore.interface';
import { sortBy } from 'sort-by-typescript';
import { TouchSequence } from 'selenium-webdriver';
import { IUser } from 'src/app/interfaces/usuarios/user.interface';
import { Usuario } from 'src/app/model/Usuarios/usuario.model';
import { UserService } from 'src/app/services/user.service';
import { ClienteService } from 'src/app/services/cliente.service';
import { IVenta } from 'src/app/interfaces/venta.interface';
import { ICliente } from 'src/app/interfaces/cliente.interface';
import { Venta } from 'src/app/model/venta.model';
import { ICondicionIva } from 'src/app/interfaces/condicionesiva.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { VentaService } from 'src/app/services/venta.service';
import { ITipoComprobante } from 'src/app/interfaces/tipoComprobante.interface';
import { IUnidadMedida } from 'src/app/interfaces/unidadmedida.interface';
import { Logo } from '../logo.enum';

@Component({
  selector: 'app-venta-impresion',
  templateUrl: './venta-impresion.component.html',
  styleUrls: ['./venta-impresion.component.css'],
})
export class VentaImpresionComponent implements OnInit {
  idComprobante: string = '';

  listaStockPorDeposito: IGetStockStore[] = [];
  listaSucursales: ISucursal[] = [];
  listafactura: IArticulo[] = [];
  listaDetalleArticulosComprobante: any[] = [];
  listaClientes: ICliente[] = [];
  listaUnidadesMedida: IUnidadMedida[] = [];
  listaCondicionesIva: ICondicionIva[] = [];
  listaTipoComprobante: ITipoComprobante[] = [];

  objetoGetStockStore: IGetStockStore;
  objetoEmpresa: IEmpresa = new Empresa();
  objetoSucursal: ISucursal = new Sucursal();
  objetoUsuarioLogueado: IUser = new Usuario();
  objetoVenta: IVenta = new Venta();

  constructor(
    private serviceUser: UserService,
    private serviceSettings: SettingsService,
    private alertasComponent: AlertasComponent,
    private serviceSucursal: SucursalService,
    private clienteService: ClienteService,
    private settingsService: SettingsService,
    private serviceVenta: VentaService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.idComprobante = this.route.snapshot.paramMap.get('id')!;
    
    this.buscarUnidadMedida();
  }

  listarDetalleVenta() {
    this.serviceVenta.getVentaById(this.idComprobante).subscribe(
      (respuesta) => {
        this.objetoVenta = new Venta(respuesta);
        this.rellenarListaDetalles();
        this.buscarTipoComprobantes();
        this.buscarDatosEmpresa();
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

        this.objetoVenta.proofType.name = String(
          this.listaTipoComprobante.find(
            (tipocomprobante) =>
              tipocomprobante.value == this.objetoVenta.proofType.value
          )?.name
        );
      },
      (error) => {
        this.alertasComponent.showOcurrioErrorStrategy(error);
      }
    );
  }

  rellenarListaDetalles() {
    this.objetoVenta.details.forEach((detalle) => {

      var unidadmedida = String(
        this.listaUnidadesMedida.find(
          (unidad) => unidad.value == detalle.good.measure
        )?.name
      );

      var odetalle = {
        codigo: detalle.good.code,
        nombre: detalle.good.name,
        descripcion: detalle.good.description,
        cantidad: detalle.quantity,
        precio: detalle.price,
        measure: unidadmedida,
      };

      this.listaDetalleArticulosComprobante.push(odetalle);
    });

    if (this.objetoVenta.details.length < 40) {
      for (
        let i = this.objetoVenta.details.length;
        this.listaDetalleArticulosComprobante.length < 40;
        i++
      ) {
        var odetalle = {
          codigo: ' ',
          nombre: ' ',
          descripcion: ' ',
          cantidad: ' ',
          precio: ' ',
        };
        this.listaDetalleArticulosComprobante.push(odetalle);
      }
    }
  }
  generarImpresionRecibo() {
    let date = new Date();
    let today = date.toLocaleDateString();
    let docDefinition = {
      content: [
        {
          style: 'tableExanple',
          color: '#222',
          table: {
            widths: [200, 100, 210],
            headerRows: 2,

            // keepWithHeaderRows: 1,
            body: [
              [
                {
                  text:
                    '' +
                    '\n' +
                    'Razon Social: ' +
                    this.objetoEmpresa.businessName +
                    '\n' +
                    'Domicilio: ' +
                    this.objetoUsuarioLogueado.store.address +
                    '\n' +
                    'CUIT: ' +
                    this.objetoEmpresa.cuit,
                  style: 'tableHeader, fontSize: 8 ',
                  colSpan: 1,
                  alignment: 'left',
                },
                {
                  image: Logo.ImagenPintecolor,
                  width: 100,
                  height: 50,
                },
                {
                  text:
                    this.objetoVenta.proofType.name +
                    '\n' +
                    '' +
                    '\n' +
                    'N° Comprobante: ' +
                    this.objetoVenta.pos.posFiscalNumber +
                    ' - ' +
                    this.objetoVenta.saleNumber +
                    '\n' +
                    '\n' +
                    'Condicion: ' +
                    this.obtenerCondicionDeVenta() +
                    '\n' +
                    'Fecha Comprobante: ' +
                    this.formatearFecha(this.objetoVenta.date) +
                    '\n',
                  style: 'tableHeader, fontSize: 8 ',
                  alignment: 'left',
                },
              ],
              [
                {
                  text: '' + '\n' + '',
                  style: 'tableHeader',
                  colSpan: 3,
                  alignment: 'center',
                },
              ],
            ],
          },
        },

        {
          style: 'tableExample',
          color: '#444',
          table: {
            widths: [239, 280],
            headerRows: 1,

            // keepWithHeaderRows: 1,
            body: [
              [
                {
                  text:
                    'Razon Social: ' +
                    this.objetoVenta.customer.businessName +
                    '\n' +
                    'Domicilio: ' +
                    this.objetoVenta.customer.address +
                    '\n' +
                    'Ciudad: ' +
                    this.objetoVenta.customer.city.name,
                  style: 'fontSize: 8 ',
                },
                {
                  text:
                    'CUIT: ' +
                    this.objetoVenta.customer.idNumber +
                    '\n' +
                    'Condicion IVA: ' +
                    this.objetoVenta.customer.ivaCondition.value +
                    '\n' +
                    '' +
                    '\n' +
                    '',
                  colSpan: 1,
                  alignment: 'Left',
                  style: 'fontSize: 8 ',
                },
              ],
            ],
          },
        },
        {
          style: 'tableExample',
          table: {
            widths: [239, 280],
            body: [
              ['Observacion:', 'Firma:'],
              [
                {
                  stack: [
                    this.objetoVenta.commentary
                  ]
                },
                [
                  {
                    text:
                      '\n' +
                      '' +
                      '\n' +
                      ''+
                      '\n' +
                      '' +
                      '\n' +
                      '' + 
                      '\n' +
                      '' +
                      '\n' +
                      ''+
                      '\n' +
                      '' +
                      '\n' +
                      '',
                  },
                ],
              ]
            ]
          }
        },
      ],

      styles: {
        header: {
          fontSize: 18,
          bold: true,
        },
        subheader: {
          fontSize: 16,
          bold: true,
        },
        Chico: {
          fontSize: 7,
        },
        Grande: {
          fontSize: 10,
        },
        tableHeader: {
          bold: true,
          fontSize: 13,
          color: 'Black',
        },
      },

      defaultStyle: {
        // alignment: 'justify'
      },
    };
    pdfMake.createPdf(docDefinition).open();
  }
  generarImpresionComprobante() {
    let date = new Date();
    let today = date.toLocaleDateString();
    let docDefinition = {
      content: [
        {
          style: 'tableExanple',
          color: '#222',
          table: {
            widths: [200, 100, 210],
            headerRows: 2,

            // keepWithHeaderRows: 1,
            body: [
              [
                {
                  text:
                    '' +
                    '\n' +
                    'Razon Social: ' +
                    this.objetoEmpresa.businessName +
                    '\n' +
                    'Domicilio: ' +
                    this.objetoUsuarioLogueado.store.address +
                    '\n' +
                    'CUIT: ' +
                    this.objetoEmpresa.cuit,
                  style: 'tableHeader, fontSize: 8 ',
                  colSpan: 1,
                  alignment: 'left',
                },
                {
                  image: Logo.ImagenPintecolor,
                  width: 100,
                  height: 50,
                },
                {
                  text:
                    this.objetoVenta.proofType.name +
                    '\n' +
                    '' +
                    '\n' +
                    'N° Comprobante: ' +
                    this.objetoVenta.pos.posFiscalNumber +
                    ' - ' +
                    this.objetoVenta.saleNumber +
                    '\n' +
                    '\n' +
                    'Condicion: ' +
                    this.obtenerCondicionDeVenta() +
                    '\n' +
                    'Fecha Comprobante: ' +
                    this.formatearFecha(this.objetoVenta.date) +
                    '\n',
                  style: 'tableHeader, fontSize: 8 ',
                  alignment: 'left',
                },
              ],
              [
                {
                  text: '' + '\n' + '',
                  style: 'tableHeader',
                  colSpan: 3,
                  alignment: 'center',
                },
              ],
            ],
          },
        },

        {
          style: 'tableExample',
          color: '#444',
          table: {
            widths: [239, 280],
            headerRows: 1,

            // keepWithHeaderRows: 1,
            body: [
              [
                {
                  text:
                    'Razon Social: ' +
                    this.objetoVenta.customer.businessName +
                    '\n' +
                    'Domicilio: ' +
                    this.objetoVenta.customer.address +
                    '\n' +
                    'Ciudad: ' +
                    this.objetoVenta.customer.city.name,
                  style: 'fontSize: 8 ',
                },
                {
                  text:
                    'CUIT: ' +
                    this.objetoVenta.customer.idNumber +
                    '\n' +
                    'Condicion IVA: ' +
                    this.objetoVenta.customer.ivaCondition.value +
                    '\n' +
                    '' +
                    '\n' +
                    '',
                  colSpan: 1,
                  alignment: 'Left',
                  style: 'fontSize: 8 ',
                },
              ],
            ],
          },
        },

        {
          style: { fontSize: 11 },
          table: {
            headerRows: 1,
            widths: [70,224, 65, 66, 66],
            body: [
              ['Codigo', 'Nombre Articulo', 'Cantidad', 'Precio Lista', 'Precio Final'],
              [
                this.listaDetalleArticulosComprobante.map((art) => [
                  art.codigo,
                ]),
                this.listaDetalleArticulosComprobante.map((art) => [
                  art.nombre,
                ]),
                this.listaDetalleArticulosComprobante.map((art) => [
                  art.cantidad != 0 ? art.cantidad + ' (' + art.measure + ')' : '',
                ]),
                this.listaDetalleArticulosComprobante.map((art) => [
                  art.cantidad != 0 ? ' $ ' + ((art.precio * art.cantidad) + (art.precio * art.cantidad * (this.objetoVenta.pricelistDiscount/100))).toFixed(2) : '',
                ]),
                this.listaDetalleArticulosComprobante.map((art) => [
                  art.cantidad != 0 ? ' $ ' + (art.precio * art.cantidad).toFixed(2) : '',
                ]),
              ],
            ],
          },
        },

        {
          style: 'tableExample',
          table: {
            headerRows: 1,
            widths: [433, 86],
            body: [
              ['Subtotal: ', ' $ ' + (this.objetoVenta.amount! + (this.objetoVenta.amount! * (this.objetoVenta.pricelistDiscount/100))).toFixed(2)],
              ['Descuento: ', ' % ' + this.objetoVenta.pricelistDiscount],
              ['Total: ', ' $ ' + this.objetoVenta.amount!.toFixed(2)],
            ],
          },
        },
      ],

      styles: {
        header: {
          fontSize: 18,
          bold: true,
        },
        subheader: {
          fontSize: 16,
          bold: true,
        },
        Chico: {
          fontSize: 7,
        },
        Grande: {
          fontSize: 10,
        },
        tableHeader: {
          bold: true,
          fontSize: 13,
          color: 'Black',
        },
      },

      defaultStyle: {
        // alignment: 'justify'
      },
    };
    pdfMake.createPdf(docDefinition).open();
  }

  obtenerCondicionDeVenta() {
    if (this.objetoVenta.isDebt == true) {
      return 'Cuenta Corriente';
    } else {
      return 'Contado';
    }
  }

  buscarDatosEmpresa() {
    this.serviceSettings.getDatosEmpresa().subscribe(
      (respuesta) => {
        this.objetoEmpresa = respuesta;
        this.listarSucursales();
      },
      (error) => {
        this.alertasComponent.showOcurrioErrorStrategy(error);
      }
    );
  }

  listarSucursales() {
    this.serviceSucursal.getSucursales().subscribe(
      (respuesta) => {
        this.listaSucursales = respuesta;
        this.obtenerUsuarioActual();
        /*this.totalItems = respuesta.meta.totalItems*/
      },
      (error) => {
        this.alertasComponent.showOcurrioErrorStrategy(error);
      }
    );
  }

  generarImpresion(){
    if (
      this.objetoVenta.proofType.value == 'Recibo' ||
      this.objetoVenta.proofType.value == 'ReciboX'
    ) {
      this.generarImpresionRecibo();
    } else {
      this.generarImpresionComprobante();
    }
  }
  
  obtenerUsuarioActual() {
    this.serviceUser.getPerfilUsuario().subscribe(
      (result) => {
        this.objetoUsuarioLogueado = new Usuario(result);
        this.generarImpresion();
        this.router.navigate(['/home/consulta-ventas']);
      },
      (error) => {
        this.alertasComponent.showOcurrioErrorStrategy(error);
      }
    );
  }

  buscarClienteById() {
    this.clienteService.getClienteById(this.objetoVenta.customer.id).subscribe(
      (respuesta) => {
        this.listaClientes = respuesta;
      },
      (error) => {
        this.alertasComponent.showOcurrioErrorStrategy(error);
      }
    );
  }
  buscarUnidadMedida() {
    this.settingsService.getUnidadMedida().subscribe(
      (respuesta) => {
        this.listaUnidadesMedida = respuesta;
        this.listarDetalleVenta();
      },
      (error) => {
        this.alertasComponent.showOcurrioErrorStrategy(error);
      }
    );
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

  formatearFecha(fecha: any) {
    const date = new Date(fecha);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const myFormattedDate =
      day.toString().padStart(2, '0') +
      '/' +
      month.toString().padStart(2, '0') +
      '/' +
      year;
    return myFormattedDate;
  }
}
