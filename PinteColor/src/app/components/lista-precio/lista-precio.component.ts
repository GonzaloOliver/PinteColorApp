import { Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertasComponent } from '../alertas/alertas.component';
import {
  FormsModule,
  FormGroup,
  Validators,
  FormBuilder,
  FormControl,
} from '@angular/forms';
import { AlertasIconos } from '../alertas/alertas_iconos.enum';
import Swal from 'sweetalert2';
import { IListaPrecio } from 'src/app/interfaces/listaprecio.interface';
import { ListaPrecio } from 'src/app/model/listaprecio.model';
import { ListaPrecioService } from 'src/app/services/listaprecio.service';
import * as XLSX from 'xlsx';


declare var $: any;
@Component({
  selector: 'app-lista-precio',
  templateUrl: './lista-precio.component.html',
  styleUrls: ['./lista-precio.component.css'],
})
export class ListaPrecioComponent implements OnInit {

  /*name of the excel-file which will be downloaded. */
  fileName = 'ListadoListasdePrecios.xlsx';

  exportexcel(): void {
    /* table id is passed over here */
    let element = document.getElementById('listado-listas-de-precios');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, this.fileName);

  }



  public contactFormulario: FormGroup;

  filtroBusquedaNombre: string = '';

  page: number = 1;
  itemsPage: number = 5;
  totalItems: number = 10;
  cantidadItems: number = 0;
  esObjetoNuevo: boolean = false;
  listaPrecio: IListaPrecio[] = [];
  objetoListaPrecio: IListaPrecio = new ListaPrecio();
  public numbersOnlyValidators(event: any) {
    const pattern = /^[0-9\-]*$/;
    if (!pattern.test(event.target.value)) {
      event.target.value = event.target.value.replace(/[^0-9\-]/g, '');
    }
  }

  constructor(
    private router: Router,
    private serviceListaPrecio: ListaPrecioService,
    private alertasComponent: AlertasComponent
  ) {
    function validaNumericos(event: { charCode: number }) {
      if (event.charCode >= 48 && event.charCode <= 57) {
        return true;
      }
      return false;
    }
    this.contactFormulario = this.createForm();
  }

  get name() {
    return this.contactFormulario.get('name');
  }
  get value() {
    return this.contactFormulario.get('value');
  }

  get descuento() {
    return this.contactFormulario.get('descuento');
  }

  createForm() {
    return new FormGroup({
      name: new FormControl('', [Validators.required, Validators.minLength(2)]),
      value: new FormControl('', [
        Validators.required,
        Validators.minLength(2),
      ]),
    });
  }

  onResetForm(): void {
    this.contactFormulario.reset();
  }

  onSaveForm(): void {
    if (this.contactFormulario.valid) {
      this.onResetForm();
    }
  }

  ngOnInit(): void {
    this.listarListaPrecio();
  }

  guardarListaPrecio() {
    this.serviceListaPrecio
      .guardarListaPrecio(this.objetoListaPrecio)
      .subscribe(
        (response) => {
          this.listarListaPrecio();
          this.showModalSuccessSave();
          this.onResetForm();
        },
        (error) => {
          this.alertasComponent.showOcurrioErrorStrategy(error);
        }
      );
  }

  modificarListaPrecio() {
    this.serviceListaPrecio
      .modificarListaPrecio(this.objetoListaPrecio)
      .subscribe(
        (response) => {
          this.listarListaPrecio();
          this.showModalSuccessSave();
        },
        (error) => {
          this.alertasComponent.showOcurrioErrorStrategy(error);
        }
      );
  }

  //RECUPERO OBJETO LINEA DEL BACKEND Y CREO UN NUEVO OBJETO CON ESOS DATOS QUE RECUPERO
  //PARA QUE EL OBJETO SE CREE Y TENGA TODOS LOS METODOS QUE PERTENECEN A EL

  seleccionListaPrecioModificacion(listaprecio: IListaPrecio) {
    this.serviceListaPrecio
      .getListaPrecioById(listaprecio.id)
      .subscribe((result) => {
        this.objetoListaPrecio = new ListaPrecio(result);
      });
    this.actualizarButtonConfirmacion(false);
  }

  listarListaPrecio() {
    this.serviceListaPrecio
      .getListaPrecioPaginado(
        this.itemsPage,
        this.page,
        this.filtroBusquedaNombre
      )
      .subscribe(
        (respuesta) => {
          this.listaPrecio = respuesta.content;
          this.totalItems = respuesta.meta.totalItems;
        },
        (error) => {
          this.alertasComponent.showOcurrioErrorStrategy(error);
        }
      );
  }

  eliminarListaPrecio(id: number) {
    Swal.fire({
      title: 'Desea eliminar este registro?',
      icon: 'error',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.serviceListaPrecio.eliminarListaPrecio(id).subscribe(
          (data) => {
            this.listarListaPrecio();
          },
          (error) => {
            this.alertasComponent.showOcurrioErrorStrategy(error);
          }
        );
        this.showModalEliminar();
      }
    });
  }

  cancelarListaPrecio() {
    this.listarListaPrecio();
    this.showModalCancelar();
    this.onResetForm();
  }

  resetearFormulario() {
    this.onResetForm();
  }
  actualizarButtonConfirmacion(bandera: boolean) {
    this.esObjetoNuevo = bandera;
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
