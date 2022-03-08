import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { ISucursal } from '../interfaces/sucursal.interface';
import { Iresponse } from '../../app/interfaces/response.interface';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SucursalService {
  private URL_API: string = environment.url + 'stores';
  private token = 'BEARER' + ' ' + localStorage.getItem('userToken');

  private proveedor: ISucursal[] = [];

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    }),
  };

  constructor(private http: HttpClient) {}

  modificarSucursal(objetoSucursal: any): Observable<any> {
    return this.http.put(
      this.URL_API + '/' + objetoSucursal.id,
      JSON.stringify(objetoSucursal),
      this.httpOptions
    );
  }

  guardarSucursal(objetoSucursal: any): Observable<Iresponse> {
    return this.http.post<Iresponse>(
      this.URL_API,
      objetoSucursal,
      this.httpOptions
    );
  }

  eliminarSucursal(id: number): Observable<any> {
    return this.http.delete(this.URL_API + '/' + id, this.httpOptions);
  }

  getSucursales(): Observable<any> {
    return this.http.get<ISucursal[]>(this.URL_API + '/all', this.httpOptions);
  }

  getSucursalesPaginado(
    itemsPage: number,
    page: number,
    nombre: string,
    direccion: string
  ): Observable<any> {
    let url =
      this.URL_API +
      '?perPage=' +
      itemsPage +
      '&page=' +
      page +
      '&order=name:ASC';

    if (nombre != null && nombre != '') {
      url = url + '&where=name:' + nombre;
    }
    if (direccion != null && direccion != '') {
      url = url + '&where=address:' + direccion;
    }
    return this.http.get<ISucursal[]>(url, this.httpOptions);
  }

  getSucursalById(filtroSucursal: any): Observable<any> {
    return this.http.get<ISucursal[]>(this.URL_API + '/' + filtroSucursal);
  }
}
