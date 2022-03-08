import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { ICliente } from '../interfaces/cliente.interface';
import { Iresponse } from '../../app/interfaces/response.interface';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ClienteService {
  private URL_API: string = environment.url + 'customers';
  private token = 'BEARER' + ' ' + localStorage.getItem('userToken');

  private cliente: ICliente[] = [];

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    }),
  };

  constructor(private http: HttpClient) {}

  modificarCliente(objetoCliente: any): Observable<any> {
    return this.http.put(
      this.URL_API + '/' + objetoCliente.id,
      JSON.stringify(objetoCliente),
      this.httpOptions
    );
  }

  guardarCliente(objetoCliente: any): Observable<Iresponse> {
    return this.http.post<Iresponse>(
      this.URL_API,
      objetoCliente,
      this.httpOptions
    );
  }

  eliminarCliente(id: number): Observable<any> {
    return this.http.delete(this.URL_API + '/' + id, this.httpOptions);
  }

  getClientesPaginado(
    itemsPage: number,
    page: number,
    nombre: string,
    apellido: string,
    telefono: string,
    correo: string
  ): Observable<any> {
    let url =
      this.URL_API +
      '?perPage=' +
      itemsPage +
      '&page=' +
      page +
      '&order=businessName:ASC';
    if (nombre != null && nombre != '') {
      url = url + '&where=firstName:' + nombre;
    }
    if (apellido != null && apellido != '') {
      url = url + '&where=lastName:' + apellido;
    }
    if (telefono != null && telefono != '') {
      url = url + '&where=phoneNumber:' + telefono;
    }
    if (correo != null && correo != '') {
      url = url + '&where=email:' + correo;
    }
    return this.http.get<ICliente[]>(url, this.httpOptions);
  }

  getClientesAll(): Observable<any> {
    return this.http.get<ICliente[]>(this.URL_API + '/all', this.httpOptions);
  }

  getClientes(): Observable<any> {
    return this.http.get<ICliente[]>(this.URL_API, this.httpOptions);
  }

  getClienteById(filtroCliente: any): Observable<any> {
    return this.http.get<ICliente[]>(this.URL_API + '/' + filtroCliente);
  }

  getSaldoClienteById(filtroCliente: any): Observable<any> {
    return this.http.get<any>(
      this.URL_API + '/' + filtroCliente + '/' + 'debt',
      this.httpOptions
    );
  }
}
