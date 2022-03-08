import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ICondicionIva } from '../interfaces/condicionesiva.interface';
import { IRoles } from '../interfaces/usuarios/roles.interface';
import { ITipoDocumento } from '../interfaces/tipodocumento.interface';
import { IEmpresa } from '../interfaces/empresa.interface';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  private URL_API: string = environment.url + 'settings/';
  private token = 'BEARER' + ' ' + localStorage.getItem('userToken');

  httpOptions = {
    headers: new HttpHeaders({ Authorization: this.token }),
  };

  constructor(private http: HttpClient) {}

  getCondicionesIva(): Observable<any> {
    return this.http.get<ICondicionIva[]>(
      this.URL_API + 'iva',
      this.httpOptions
    );
  }

  getPermisosDeUsuario(): Observable<any> {
    return this.http.get<any[]>(
      this.URL_API + 'rolePermissions',
      this.httpOptions
    );
  }

  getUnidadMedida(): Observable<any> {
    return this.http.get<any[]>(this.URL_API + 'measure', this.httpOptions);
  }

  getAlicuota(): Observable<any> {
    return this.http.get<any[]>(this.URL_API + 'aliquots', this.httpOptions);
  }

  getDatosEmpresa(): Observable<any> {
    return this.http.get<IEmpresa[]>(
      this.URL_API + 'companyInfo',
      this.httpOptions
    );
  }

  guardarDatosEmpresa(objetoEmpresa: any) {
    return this.http.put(
      this.URL_API + 'companyInfo',
      objetoEmpresa,
      this.httpOptions
    );
  }

  getTipoComprobante(): Observable<any> {
    return this.http.get<any[]>(this.URL_API + 'proofTypes', this.httpOptions);
  }

  getRoles(): Observable<any> {
    return this.http.get<IRoles>(this.URL_API + 'roles', this.httpOptions);
  }

  getTipoDocumento(): Observable<any> {
    return this.http.get<ITipoDocumento[]>(
      this.URL_API + 'idTypes',
      this.httpOptions
    );
  }

  pathComprobantes() {
    return this.http.patch<any[]>(this.URL_API + 's', this.httpOptions);
  }
}
