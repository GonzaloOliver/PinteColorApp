import { Component, ElementRef, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ILinea } from 'src/app/interfaces/linea.interface';
import { NgForm } from '@angular/forms';
import { LineaService } from 'src/app/services/linea.service';
import {
  FormsModule,
  FormGroup,
  Validators,
  FormBuilder,
  FormControl,
} from '@angular/forms';
import { AlertasComponent } from '../alertas/alertas.component';
import { RubroService } from 'src/app/services/rubro.service';
import { IRubro } from 'src/app/interfaces/rubro.interface';
import { AlertasIconos } from '../alertas/alertas_iconos.enum';
import { Linea } from 'src/app/model/linea.model';
import Swal from 'sweetalert2';
import { Rubro } from 'src/app/model/rubro.model';

declare var $: any;
@Component({
  selector: 'app-linea',
  templateUrl: './linea.component.html',
  styleUrls: ['./linea.component.css'],
})
export class LineaComponent implements OnInit {
  public contactFormulario: FormGroup;

  esObjetoNuevo: boolean = false;

  filtroLineaNombre: string = '';
  filtroLineaNombreRubro: string;
  filtroLineaIdRubro: any = '';

  page: number = 1;
  itemsPage: number = 5;
  totalItems: number = 10;
  cantidadItems: number = 0;

  listaLineas: ILinea[] = [];
  listaRubros: IRubro[] = [];

  title = 'sweetAlert';

  objetoRubro: IRubro = new Rubro();
  objetoLinea: ILinea = new Linea();

  constructor(
    private router: Router,
    private serviceLinea: LineaService,
    private serviceRubro: RubroService,
    private alertasComponent: AlertasComponent
  ) {
    this.contactFormulario = this.createForm();
  }

  get name() {
    return this.contactFormulario.get('name');
  }
  get name1() {
    return this.contactFormulario.get('name1');
  }

  ngOnInit(): void {
    this.listarLineas();
    this.listarRubros();
  }

  createForm() {
    return new FormGroup({
      name: new FormControl('', [Validators.required, Validators.minLength(3)]),
      name1: new FormControl('', [
        Validators.required,
        Validators.nullValidator,
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

  actualizarButtonConfirmacion(bandera: boolean) {
    this.esObjetoNuevo = bandera;
  }

  cancelarLinea() {
    this.listarLineas();
    this.showModalCancelar();
    this.onResetForm();
  }
  guardarLinea() {
    //OBTENGO ID PARA EL RUBRO SELECCIONADO
    this.objetoLinea.sector.id = Number(
      this.listaRubros.find(
        (rubro) => rubro.name == this.objetoLinea.sector.name
      )?.id
    );

    this.serviceLinea.guardarLinea(this.objetoLinea).subscribe(
      () => {
        this.listarLineas();
        this.showModalSuccessSave();
        this.onResetForm();
      },
      (error) => {
        this.alertasComponent.showOcurrioErrorStrategy(error);
      }
    );
  }

  modificarLinea() {
    //OBTENGO ID PARA EL RUBRO SELECCIONADO
    this.objetoLinea.sector.id = Number(
      this.listaRubros.find(
        (rubro) => rubro.name == this.objetoLinea.sector.name
      )?.id
    );

    this.serviceLinea.modificarLinea(this.objetoLinea).subscribe(
      () => {
        this.listarLineas();
        this.showModalSuccessSave();
      },
      (error) => {
        this.alertasComponent.showOcurrioErrorStrategy(error);
      }
    );
  }

  eliminarLinea(id: number) {
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
        this.serviceLinea.eliminarLinea(id).subscribe(
          (data) => {
            this.listarLineas();
          },
          (error) => {
            this.alertasComponent.showOcurrioErrorStrategy(error);
          }
        );
        this.showModalEliminar();
      }
    });
  }

  //RECUPERO OBJETO LINEA DEL BACKEND Y CREO UN NUEVO OBJETO CON ESOS DATOS QUE RECUPERO
  //PARA QUE EL OBJETO SE CREE Y TENGA TODOS LOS METODOS QUE PERTENECEN A EL

  seleccionLineaModificacion(linea: ILinea) {
    this.serviceLinea.getLineaById(linea.id).subscribe((result) => {
      this.objetoLinea = new Linea(result);
    });
    this.actualizarButtonConfirmacion(false);
  }

  listarLineas() {
    if (this.filtroLineaNombreRubro != '') {
      this.filtroLineaIdRubro = this.listaRubros.find(
        (rubro) => rubro.name == this.filtroLineaNombreRubro
      )?.id;
    }
    this.serviceLinea
      .getLineasPaginado(
        this.itemsPage,
        this.page,
        this.filtroLineaNombre,
        this.filtroLineaIdRubro
      )
      .subscribe(
        (respuesta) => {
          this.listaLineas = respuesta.content;
          this.totalItems = respuesta.meta.totalItems;
        },
        (error) => {
          this.alertasComponent.showOcurrioErrorStrategy(error);
        }
      );
  }

  listarRubros() {
    this.serviceRubro.getRubros().subscribe(
      (respuesta) => {
        this.listaRubros = respuesta;
      },
      (error) => {
        this.alertasComponent.showOcurrioErrorStrategy(error);
      }
    );
  }
  resetearFormulario() {
    this.onResetForm();
  }
  buscarNombreRubro(valueRubro: any) {
    return this.listaRubros.find((rubro) => rubro.id == valueRubro.id)?.name;
  }

  showModalEliminar() {
    this.alertasComponent.showModalInformacion(AlertasIconos.Eliminar);
  }
  showModalSuccessSave() {
    this.alertasComponent.showModalInformacion(AlertasIconos.Guardar);
  }
  showModalCancelar() {
    this.alertasComponent.showModalInformacion(AlertasIconos.Cancelar);
  }
}
