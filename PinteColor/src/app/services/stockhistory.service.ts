import { environment } from './../../environments/environment';
import { IStockHistory } from './../interfaces/stock/stockhistory.interface';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StockHistoryService {
  private URL_API: string = environment.url + 'stock-history';
  private token = 'BEARER' + ' ' + localStorage.getItem('userToken');

  httpOptions = {
    headers: new HttpHeaders({ Authorization: this.token }),
  };

  constructor(private http: HttpClient) {}

  getStockHistory(
    itemsPage: number,
    page: number,
    idarticulo?: number,
    idsucursal?: number,
    idproveedor?: number,
    observacion?: String
  ): Observable<any> {
    let url = this.URL_API + '?perPage=' + itemsPage + '&page=' + page + '&order=date:DESC';;

    if (idarticulo != null && idarticulo != 0) {
      url = url + '&where=good.id:' + idarticulo;
    }
    if (idsucursal != null && idsucursal != 0) {
      url = url + '&where=applyTo.id:' + idsucursal;
    }
    if (idproveedor != null && idproveedor != 0) {
      url = url + '&where=supplier.id:' + idproveedor;
    }
    if (observacion != null && observacion != '') {
      url = url + '&where=description:' + observacion;
    }

    return this.http.get<IStockHistory[]>(url, this.httpOptions);
  }
}
