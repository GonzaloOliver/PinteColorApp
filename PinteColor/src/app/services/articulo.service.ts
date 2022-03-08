import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IArticulo } from '../interfaces/articulo.interface';
import { Iresponse } from '../interfaces/response.interface';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ArticuloService {
  private URL_API: string = environment.url + 'goods';
  private token = 'BEARER' + ' ' + localStorage.getItem('userToken');

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    }),
  };

  constructor(private http: HttpClient) {}

  modificarArticulo(objetoArticulo: any): Observable<any> {
    return this.http.put(
      this.URL_API + '/' + objetoArticulo.id,
      objetoArticulo,
      this.httpOptions
    );
  }

  guardarArticulo(objetoArticulo: any): Observable<Iresponse> {
    return this.http.post<Iresponse>(
      this.URL_API,
      objetoArticulo,
      this.httpOptions
    );
  }

  eliminarArticulo(id: number): Observable<any> {
    return this.http.delete(this.URL_API + '/' + id, this.httpOptions);
  }

  getArticulos(): Observable<any> {
    return this.http.get<IArticulo[]>(
      this.URL_API + '/all?order=name:ASC',
      this.httpOptions
    );
  }

  getArticulosWhere(
    nombreArticulo?: String,
    proveedor?: String,
    marca?: String,
    linea?: String,
    code?: String
  ): Observable<any> {
    let url = this.URL_API + '/all?order=name:ASC';

    if (nombreArticulo != null && nombreArticulo != '') {
      url = url + '&where=name:' + nombreArticulo;
    }
    if (proveedor != null && proveedor != '') {
      url = url + '&where=supplier.id:' + proveedor;
    }
    if (marca != null && marca != '') {
      url = url + '&where=brand.id:' + marca;
    }
    if (linea != null && linea != '') {
      url = url + '&where=line.id:' + linea;
    }
    if (code != null && code != '') {
      url = url + '&where=code:' + code;
    }

    return this.http.get<IArticulo[]>(url, this.httpOptions);
  }

  getArticulosPaginado(
    itemsPage: number,
    page: number,
    nombreArticulo?: String,
    proveedor?: String,
    marca?: String,
    linea?: String,
    code?: String
  ): Observable<any> {
    let url =
      this.URL_API +
      '?perPage=' +
      itemsPage +
      '&page=' +
      page +
      '&order=name:ASC';

    if (nombreArticulo != null && nombreArticulo != '') {
      url = url + '&where=name:' + nombreArticulo;
    }
    if (proveedor != null && proveedor != '') {
      url = url + '&where=supplier.id:' + proveedor;
    }
    if (marca != null && marca != '') {
      url = url + '&where=brand.id:' + marca;
    }
    if (linea != null && linea != '') {
      url = url + '&where=line.id:' + linea;
    }
    if (code != null && code != '') {
      url = url + '&where=code:' + code;
    }

    return this.http.get<IArticulo[]>(url, this.httpOptions);
  }

  getArticuloById(filtroArticulo: any): Observable<any> {
    return this.http.get<IArticulo[]>(this.URL_API + '/' + filtroArticulo);
  }
}
