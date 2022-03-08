import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { Iresponse } from '../../app/interfaces/response.interface';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IMarca } from '../interfaces/marca.interface';

@Injectable({
  providedIn: 'root',
})
export class MarcaService {
  private URL_API: string = environment.url + 'brands';
  private token = 'BEARER' + ' ' + localStorage.getItem('userToken');

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    }),
  };

  constructor(private http: HttpClient) {}

  eliminarMarca(id: number): Observable<any> {
    return this.http.delete(this.URL_API + '/' + id, this.httpOptions);
  }

  guardarMarca(objetoMarca: any) {
    return this.http.post(
      this.URL_API,
      JSON.stringify(objetoMarca),
      this.httpOptions
    );
  }

  modificarMarca(objetoMarca: any) {
    return this.http.put(
      this.URL_API + '/' + objetoMarca.id,
      JSON.stringify(objetoMarca),
      this.httpOptions
    );
  }

  getMarcasPaginado(
    itemsPage: number,
    page: number,
    nombremarca: string
  ): Observable<any> {
    let url =
      this.URL_API +
      '?perPage=' +
      itemsPage +
      '&page=' +
      page +
      '&order=name:ASC';

    if (nombremarca != null && nombremarca != '') {
      url = url + '&where=name:' + nombremarca;
    }

    return this.http.get<IMarca[]>(url, this.httpOptions);
  }

  getMarcas(): Observable<any> {
    return this.http.get<IMarca[]>(this.URL_API + '/all', this.httpOptions);
  }

  getMarcaById(filtroMarca: any): Observable<any> {
    return this.http.get<IMarca[]>(this.URL_API + '/' + filtroMarca);
  }
}
