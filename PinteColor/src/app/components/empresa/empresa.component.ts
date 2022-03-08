import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { IEmpresa } from 'src/app/interfaces/empresa.interface';
import { AlertasComponent } from '../alertas/alertas.component';
import { SettingsService } from 'src/app/services/settings.service';
import { ICondicionIva } from 'src/app/interfaces/condicionesiva.interface';
import { AlertasIconos } from '../alertas/alertas_iconos.enum';
import { Empresa } from 'src/app/model/empresa.model';
import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from 'pdfmake/build/vfs_fonts';


(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;


@Component({
  selector: 'app-empresa',
  templateUrl: './empresa.component.html',
  styleUrls: ['./empresa.component.css'],
})

export class EmpresaComponent implements OnInit {
 

  camposSoloLectura: boolean = true;
  listaCondicionesIva: ICondicionIva[] = [];
  objetoEmpresa: IEmpresa = new Empresa;
 

  


  constructor(  
    private alertasComponent: AlertasComponent,
    private settingsService: SettingsService
  ) {
    this.buscarDatosEmpresa();
  }


  

  ngOnInit(): void {
    this.buscarDatosEmpresa();
    this.buscarCondicionesIva();
    this.camposSoloLectura = true;

    
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

  buscarDatosEmpresa() {
    this.settingsService.getDatosEmpresa().subscribe(
      (respuesta) => {
        this.objetoEmpresa = respuesta;
      },
      (error) => {
        this.alertasComponent.showOcurrioErrorStrategy(error);
      }
    );
  }

  guardarEmpresa() {
    this.settingsService.guardarDatosEmpresa(this.objetoEmpresa).subscribe(
      (response) => {},
      (error) => {
        if (this.alertasComponent.obtengoConfirmacion(error)) {
          this.showModalGuardar();
          this.deshabilitarCampos();
          this.buscarDatosEmpresa();
        } else {
          this.alertasComponent.showOcurrioErrorStrategy(error);
          this.deshabilitarCampos();
        }
      }
    );
  }

  cancelarOperacion() {
    this.deshabilitarCampos();
    this.showModalCancelar();
    this.buscarDatosEmpresa();
  }

  showModalGuardar() {
    this.alertasComponent.showModalInformacion(AlertasIconos.Guardar);
  }

  showModalCancelar() {
    this.alertasComponent.showModalInformacion(AlertasIconos.Cancelar);
  }

  deshabilitarCampos() {
    this.camposSoloLectura = true;
  }
  habilitarCampos() {
    this.camposSoloLectura = false;
  }

  

}
