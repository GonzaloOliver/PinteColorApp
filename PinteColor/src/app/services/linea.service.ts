import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { Iresponse } from '../../app/interfaces/response.interface';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ILinea } from '../interfaces/linea.interface';
import { IArticulo } from '../interfaces/articulo.interface';

@Injectable({
  providedIn: 'root',
})
export class LineaService {
  private URL_API: string = environment.url + 'lines';
  private urlLinea: string = environment.url + 'sectors';
  private token = 'BEARER' + ' ' + localStorage.getItem('userToken');

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    }),
  };

  constructor(private http: HttpClient) {}

  guardarLinea(objetoLinea: any): Observable<Iresponse> {
    return this.http.post<Iresponse>(
      this.URL_API,
      objetoLinea,
      this.httpOptions
    );
  }
  eliminarLinea(id: number): Observable<any> {
    return this.http.delete(this.URL_API + '/' + id, this.httpOptions);
  }

  modificarLinea(objetoLinea: any) {
    return this.http.put(
      this.URL_API + '/' + objetoLinea.id,
      JSON.stringify(objetoLinea),
      this.httpOptions
    );
  }

  getLineasPaginado(
    itemsPage: number,
    page: number,
    filtroLineaNombre: String,
    filtroLineaRubroId: String
  ): Observable<any> {
    let url =
      this.URL_API +
      '?perPage=' +
      itemsPage +
      '&page=' +
      page +
      '&order=name:ASC';

    if (filtroLineaNombre != null && filtroLineaNombre != '') {
      url = url + '&where=name:' + filtroLineaNombre;
    }

    if (filtroLineaRubroId != null && filtroLineaRubroId != '') {
      url = url + '&where=sector.id:' + filtroLineaRubroId;
    }

    return this.http.get<ILinea[]>(url, this.httpOptions);
  }

  getLineas(): Observable<any> {
    return this.http.get<ILinea[]>(this.URL_API + '/all', this.httpOptions);
  }

  getLineaById(filtroLinea: any): Observable<any> {
    return this.http.get<ILinea[]>(this.URL_API + '/' + filtroLinea);
  }

  getLineBySector(id: number): Observable<any> {
    return this.http.get<IArticulo[]>(
      this.urlLinea + '/' + id + '/lines',
      this.httpOptions
    );
  }
}
