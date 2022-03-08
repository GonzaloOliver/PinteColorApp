import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { IProveedor } from '../interfaces/proveedor.interface';
import { Iresponse } from '../../app/interfaces/response.interface';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProveedorService {
  private URL_API: string = environment.url + 'suppliers';
  private token = 'BEARER' + ' ' + localStorage.getItem('userToken');

  private proveedor: IProveedor[] = [];

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    }),
  };

  constructor(private http: HttpClient) {}

  modificarProveedor(objetoProveedor: any): Observable<any> {
    return this.http.put(
      this.URL_API + '/' + objetoProveedor.id,
      JSON.stringify(objetoProveedor),
      this.httpOptions
    );
  }

  guardarProveedor(objetoProveedor: any): Observable<Iresponse> {
    return this.http.post<Iresponse>(
      this.URL_API,
      objetoProveedor,
      this.httpOptions
    );
  }

  eliminarProveedor(id: number): Observable<any> {
    return this.http.delete(this.URL_API + '/' + id, this.httpOptions);
  }

  getProveedores(): Observable<any> {
    return this.http.get<IProveedor[]>(this.URL_API + '/all', this.httpOptions);
  }

  getProveedoresPaginado(
    itemsPage: number,
    page: number,
    razonsocial: string,
    direccion: string,
    telefono: string
  ): Observable<any> {
    let url =
      this.URL_API +
      '?perPage=' +
      itemsPage +
      '&page=' +
      page +
      '&order=businessName:ASC';

    if (razonsocial != null && razonsocial != '') {
      url = url + '&where=businessName:' + razonsocial;
    }
    if (direccion != null && direccion != '') {
      url = url + '&where=address:' + direccion;
    }
    if (telefono != null && telefono != '') {
      url = url + '&where=phoneNumber:' + telefono;
    }

    return this.http.get<IProveedor[]>(url, this.httpOptions);
  }

  getProveedorById(filtroProveedor: any): Observable<any> {
    return this.http.get<IProveedor[]>(this.URL_API + '/' + filtroProveedor);
  }
  getProveedorByBusinessName(businessName: any): Observable<any> {
    return this.http.get<IProveedor[]>(
      this.URL_API + '?where=businessName:' + businessName
    );
  }
}
