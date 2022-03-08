import { Component, ElementRef, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IRubro } from 'src/app/interfaces/rubro.interface';
import {
  FormsModule,
  FormGroup,
  Validators,
  FormBuilder,
  FormControl,
} from '@angular/forms';
import { NgForm } from '@angular/forms';
import { RubroService } from 'src/app/services/rubro.service';
import { AlertasComponent } from '../alertas/alertas.component';
import { AlertasIconos } from '../alertas/alertas_iconos.enum';
import Swal from 'sweetalert2';
import { Rubro } from 'src/app/model/rubro.model';

declare var $: any;
@Component({
  selector: 'app-rubro',
  templateUrl: './rubro.component.html',
  styleUrls: ['./rubro.component.css'],
})
export class RubroComponent implements OnInit {
  public contactFormulario: FormGroup;
  filtroRubro: string = '';
  rubro: IRubro[] = [];
  page: number = 1;
  itemsPage: number = 5;
  totalItems: number = 10;
  cantidadItems: number = 0;
  esObjetoNuevo: boolean = false;

  objetoRubro: IRubro = new Rubro();

  constructor(
    private router: Router,
    private serviceRubro: RubroService,
    private alertasComponent: AlertasComponent
  ) {
    this.contactFormulario = this.createForm();
  }

  get name() {
    return this.contactFormulario.get('name');
  }

  ngOnInit(): void {
    this.listarRubros();
  }

  createForm() {
    return new FormGroup({
      name: new FormControl('', [Validators.required, Validators.minLength(3)]),
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

  guardarRubro() {
    this.serviceRubro.guardarRubro(this.objetoRubro).subscribe(
      () => {
        this.listarRubros();
        this.showModalSuccessSave();
        this.onResetForm();
      },
      (error) => {
        this.alertasComponent.showOcurrioErrorStrategy(error);
      }
    );
  }

  modificarRubro() {
    this.serviceRubro.modificarRubro(this.objetoRubro).subscribe(
      () => {
        this.listarRubros();
        this.showModalSuccessSave();
      },
      (error) => {
        this.alertasComponent.showOcurrioErrorStrategy(error);
      }
    );
  }

  seleccionRubroModificacion(rubro: any) {
    this.serviceRubro.getRubroById(rubro.id).subscribe((result) => {
      this.objetoRubro = new Rubro(result);
    });
    this.actualizarButtonConfirmacion(false);
  }

  cancelarRubro() {
    this.listarRubros();
    this.showModalCancelar();
    this.onResetForm();
  }

  listarRubros() {
    this.serviceRubro
      .getRubrosPaginado(this.itemsPage, this.page, this.filtroRubro)
      .subscribe(
        (respuesta) => {
          this.rubro = respuesta.content;
          this.totalItems = respuesta.meta.totalItems;
        },
        (error) => {
          this.alertasComponent.showOcurrioErrorStrategy(error);
        }
      );
  }

  eliminarRubro(id: number) {
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
        this.serviceRubro.eliminarRubro(id).subscribe(
          (data) => {
            this.listarRubros();
          },
          (error) => {
            this.alertasComponent.showOcurrioErrorStrategy(error);
          }
        );
        this.showModalEliminar();
      }
    });
  }

  actualizarButtonConfirmacion(bandera: boolean) {
    this.esObjetoNuevo = bandera;
  }
  resetearFormulario() {
    this.onResetForm();
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
