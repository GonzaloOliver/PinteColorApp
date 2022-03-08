import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { Iresponse } from '../interfaces/response.interface';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IListaPrecio } from '../interfaces/listaprecio.interface';

@Injectable({
  providedIn: 'root',
})
export class ListaPrecioService {
  private URL_API: string = environment.url + 'pricelist';
  private token = 'BEARER' + ' ' + localStorage.getItem('userToken');

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    }),
  };

  constructor(private http: HttpClient) {}

  eliminarListaPrecio(id: number): Observable<any> {
    return this.http.delete(this.URL_API + '/' + id, this.httpOptions);
  }

  guardarListaPrecio(objetolistaprecio: any) {
    return this.http.post(
      this.URL_API,
      JSON.stringify(objetolistaprecio),
      this.httpOptions
    );
  }

  modificarListaPrecio(objetolistaprecio: any) {
    return this.http.put(
      this.URL_API + '/' + objetolistaprecio.id,
      JSON.stringify(objetolistaprecio),
      this.httpOptions
    );
  }

  getListaPrecioPaginado(
    itemsPage: number,
    page: number,
    nombre: string
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

    return this.http.get<IListaPrecio[]>(url, this.httpOptions);
  }

  getListaPrecio(): Observable<any> {
    return this.http.get<IListaPrecio[]>(
      this.URL_API + '/all',
      this.httpOptions
    );
  }

  getListaPrecioById(filtroListaPrecio: any): Observable<any> {
    return this.http.get<IListaPrecio[]>(
      this.URL_API + '/' + filtroListaPrecio
    );
  }
}
