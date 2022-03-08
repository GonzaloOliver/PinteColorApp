import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Iresponse } from '../interfaces/response.interface';
import { IVenta } from '../interfaces/venta.interface';

@Injectable({
  providedIn: 'root',
})
export class VentaService {
  private URL_API: string = environment.url + 'sales';
  private urlCliente: string = environment.url + 'customer';
  private token = 'BEARER' + ' ' + localStorage.getItem('userToken');

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    }),
  };

  constructor(private http: HttpClient) {}

  getVentasPaginado(
    itemsPage: number,
    page: number,
    tipocomprobante?: String,
    cliente?: any,
    fechadesde?: String,
    fechahasta?: String
  ): Observable<any> {
    let url =
      this.URL_API +
      '?perPage=' +
      itemsPage +
      '&page=' +
      page +
      '&order=date:DESC';
    if (tipocomprobante != null && tipocomprobante != '') {
      url = url + '&where=proofType:' + tipocomprobante;
    }
    if (cliente != null && cliente != 0) {
      url = url + '&where=customer.id:' + cliente;
    }

    if (
      fechadesde != null &&
      fechadesde != '' &&
      fechahasta != null &&
      fechahasta != ''
    ) {
      url = url + '&where=dateBetween:' + fechadesde + '.' + fechahasta;
    } else {
      if (fechadesde != null && fechadesde != '') {
        url = url + '&where=dateFrom:' + fechadesde;
      }
      if (fechahasta != null && fechahasta != '') {
        url = url + '&where=dateTo:' + fechahasta;
      }
    }

    return this.http.get<IVenta[]>(url, this.httpOptions);
  }

  getVentas(): Observable<any> {
    return this.http.get<IVenta[]>(this.URL_API, this.httpOptions);
  }

  getVentaById(filtroVenta: any): Observable<any> {
    return this.http.get<IVenta[]>(this.URL_API + '/' + filtroVenta);
  }

  getNextNumber(posId: number, proofType: String): Observable<any> {
    let url =
      this.URL_API +
      '/' +
      'nextNumber?proofType=' +
      proofType +
      '&posId=' +
      posId;
    return this.http.get<IVenta[]>(url);
  }

  getSalesByCustomer(
    itemsPage: number,
    page: number,
    id: string
  ): Observable<any> {
    let url =
      this.URL_API +
      '/customer/' +
      id +
      '?perPage=' +
      itemsPage +
      '&page=' +
      page +
      '&order=date:DESC';
    return this.http.get<IVenta[]>(url, this.httpOptions);
  }

  //OBTIENE VENTAS DEL CLIENTE SIN PRESUPUESTOS NI REMITOS
  getSalesByCustomerSPR(
    itemsPage: number,
    page: number,
    id: string
  ): Observable<any> {
    let url =
      this.URL_API +
      '/customer/' +
      id +
      '?perPage=' +
      itemsPage +
      '&page=' +
      page +
      '&order=date:DESC' +
      '&where=isDebt:true';
    return this.http.get<IVenta[]>(url, this.httpOptions);
  }

  getRemitosByCustomer(id: any): Observable<any> {
    let url =
      this.URL_API +
      '/customer/' +
      id +
      '?perPage=1000&page=1&order=date:DESC' +
      '&where=proofType:Remito';
    return this.http.get<IVenta[]>(url, this.httpOptions);
  }

  getRemitosNotUsed(id: any): Observable<any> {
    let url =
      this.URL_API +
      '/customer/' +
      id +
      '?where=isRemitoUsed:false';
    return this.http.get<IVenta[]>(url, this.httpOptions);
  }

  guardarVenta(objetoVenta: any): Observable<Iresponse> {
    return this.http.post<Iresponse>(
      this.URL_API,
      objetoVenta,
      this.httpOptions
    );
  }

  guardarRecibo(objetoRecibo: any): Observable<Iresponse> {
    return this.http.post<Iresponse>(
      this.URL_API + '/receipt',
      objetoRecibo,
      this.httpOptions
    );
  }

  eliminarVenta(id: number): Observable<any> {
    return this.http.delete(this.URL_API + '/' + id, this.httpOptions);
  }

  eliminarForceVenta(id: number): Observable<any> {
    return this.http.delete(this.URL_API + '/' + id + "?force=true", this.httpOptions);
  }

  modificarVenta(objetoVenta: any) {
    return this.http.patch(
      this.URL_API + '/' + objetoVenta.id,
      JSON.stringify(objetoVenta),
      this.httpOptions
    );
  }
}
