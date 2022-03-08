import { Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IMarca } from 'src/app/interfaces/marca.interface';
import { MarcaService } from 'src/app/services/marca.service';
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
import { Marca } from 'src/app/model/marca.model';

declare var $: any;
@Component({
  selector: 'app-marca',
  templateUrl: './marca.component.html',
  styleUrls: ['./marca.component.css'],
})
export class MarcaComponent implements OnInit {
  public contactFormulario: FormGroup;
  filtroMarca: string = '';
  page: number = 1;
  itemsPage: number = 5;
  totalItems: number = 10;
  cantidadItems: number = 0;
  esObjetoNuevo: boolean = false;
  marca: IMarca[] = [];

  objetoMarca: IMarca = new Marca();

  constructor(
    private router: Router,
    private serviceMarca: MarcaService,
    private alertasComponent: AlertasComponent
  ) {
    this.contactFormulario = this.createForm();
  }

  get name() {
    return this.contactFormulario.get('name');
  }

  ngOnInit(): void {
    this.listarMarcas();
  }

  createForm() {
    return new FormGroup({
      name: new FormControl('', [Validators.required, Validators.minLength(2)]),
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

  guardarMarca() {
    this.serviceMarca.guardarMarca(this.objetoMarca).subscribe(
      (response) => {
        this.listarMarcas();
        this.showModalSuccessSave();
        this.onResetForm();
      },
      (error) => {
        this.alertasComponent.showOcurrioErrorStrategy(error);
      }
    );
  }

  modificarMarca() {
    this.serviceMarca.modificarMarca(this.objetoMarca).subscribe(
      (response) => {
        this.listarMarcas();
        this.showModalSuccessSave();
      },
      (error) => {
        this.alertasComponent.showOcurrioErrorStrategy(error);
      }
    );
  }

  //RECUPERO OBJETO LINEA DEL BACKEND Y CREO UN NUEVO OBJETO CON ESOS DATOS QUE RECUPERO
  //PARA QUE EL OBJETO SE CREE Y TENGA TODOS LOS METODOS QUE PERTENECEN A EL

  seleccionMarcaModificacion(marca: IMarca) {
    this.serviceMarca.getMarcaById(marca.id).subscribe((result) => {
      this.objetoMarca = new Marca(result);
    });
    this.actualizarButtonConfirmacion(false);
  }

  listarMarcas() {
    this.serviceMarca
      .getMarcasPaginado(this.itemsPage, this.page, this.filtroMarca)
      .subscribe(
        (respuesta) => {
          this.marca = respuesta.content;
          this.totalItems = respuesta.meta.totalItems;
        },
        (error) => {
          this.alertasComponent.showOcurrioErrorStrategy(error);
        }
      );
  }

  eliminarMarca(id: number) {
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
        this.serviceMarca.eliminarMarca(id).subscribe(
          (data) => {
            this.listarMarcas();
          },
          (error) => {
            this.alertasComponent.showOcurrioErrorStrategy(error);
          }
        );
        this.showModalEliminar();
      }
    });
  }

  cancelarMarca() {
    this.listarMarcas();
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
