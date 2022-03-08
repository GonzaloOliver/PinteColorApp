import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { Iresponse } from '../../app/interfaces/response.interface';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IRubro } from '../interfaces/rubro.interface';

@Injectable({
  providedIn: 'root',
})
export class RubroService {
  private URL_API: string = environment.url + 'sectors';

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  constructor(private http: HttpClient) {}

  guardarRubro(objetoRubro: any) {
    return this.http.post(
      this.URL_API,
      JSON.stringify(objetoRubro),
      this.httpOptions
    );
  }

  modificarRubro(objetoRubro: any) {
    return this.http.put(
      this.URL_API + '/' + objetoRubro.id,
      JSON.stringify(objetoRubro),
      this.httpOptions
    );
  }

  eliminarRubro(id: number): Observable<any> {
    return this.http.delete(this.URL_API + '/' + id, this.httpOptions);
  }

  getRubros(): Observable<any> {
    return this.http.get<IRubro[]>(this.URL_API + '/all', this.httpOptions);
  }

  getRubrosPaginado(
    itemsPage: number,
    page: number,
    nombreRubro: String
  ): Observable<any> {
    let url =
      this.URL_API +
      '?perPage=' +
      itemsPage +
      '&page=' +
      page +
      '&order=name:ASC';

    if (nombreRubro != null && nombreRubro != '') {
      url = url + '&where=name:' + nombreRubro;
    }

    return this.http.get<IRubro[]>(url, this.httpOptions);
  }

  getRubroById(filtroRubro: any): Observable<any> {
    return this.http.get<IRubro[]>(this.URL_API + '/' + filtroRubro);
  }
}
