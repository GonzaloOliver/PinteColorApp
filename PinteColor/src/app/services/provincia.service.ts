import { Injectable } from '@angular/core';
import { Iresponse } from '../../app/interfaces/response.interface';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ICiudad } from '../interfaces/ciudad.interface';
import { IProvincia } from '../interfaces/provincia.interface';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProvinciaService {
  private URL_API: string = environment.url + 'provinces';
  private token = 'BEARER' + ' ' + localStorage.getItem('userToken');

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    }),
  };

  constructor(private http: HttpClient) {}

  getProvincias(): Observable<any> {
    return this.http.get<IProvincia[]>(this.URL_API, this.httpOptions);
  }

  getProvinciaById(filtroProvincia: any): Observable<any> {
    return this.http.get<IProvincia[]>(this.URL_API + '/' + filtroProvincia);
  }

  getCiudadByProvincia(id: number): Observable<any> {
    return this.http.get<ICiudad[]>(
      this.URL_API + '/' + id + '/cities',
      this.httpOptions
    );
  }
}
