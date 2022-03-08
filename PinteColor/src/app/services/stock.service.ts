import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { Iresponse } from '../../app/interfaces/response.interface';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IArticulo } from '../interfaces/articulo.interface';
import { ISucursal } from '../interfaces/sucursal.interface';
import { IStockPutTransfer } from '../interfaces/stock/stockPutTransfer.interface';
import { IStockItemLista } from '../interfaces/stock/stockItemLista.interface';
import { IStockMasivo } from '../interfaces/stock/stockMasivo.interface';

@Injectable({
  providedIn: 'root',
})
export class StockService {
  private URL_API: string = environment.url + 'stock';
  private token = 'BEARER' + ' ' + localStorage.getItem('userToken');

  httpOptions = {
    headers: new HttpHeaders({ Authorization: this.token }),
  };

  constructor(private http: HttpClient) {}

  //Obtener Stock por Artículo
  getStockArticulo(goodId: number, storeId: number): Observable<any> {
    return this.http.get<IStockItemLista[]>(
      this.URL_API + '/' + goodId + '/' + storeId,
      this.httpOptions
    );
  }

  //Obtener Stock por Depósito
  getStockDeposito(objetoStockGet: any): Observable<any> {
    return this.http.get<IStockItemLista[]>(
      this.URL_API + '/store' + objetoStockGet.store.id,
      this.httpOptions
    );
  }

  getStockAll(
    idstore: number,
    nombrearticulo: String,
    codigoarticulo: String
  ): Observable<any> {
    let url = this.URL_API + '/all?';

    if (idstore != null && idstore != 0) {
      url = url + '&where=store.id:' + idstore;
    }
    if (nombrearticulo != null && nombrearticulo != '') {
      url = url + '&where=good.name:' + nombrearticulo;
    }
    if (codigoarticulo != null && codigoarticulo != '') {
      url = url + '&where=good.code:' + codigoarticulo;
    }
    return this.http.get<IStockItemLista[]>(url, this.httpOptions);
  }

  getStockDepositoByIdDeposito(id: number): Observable<any> {
    return this.http.get<IStockItemLista[]>(
      this.URL_API + '/store/' + id,
      this.httpOptions
    );
  }

  //Obtener Stcok de artículo en Sucursal
  getStockArticuloEnDeposito(objetoStockGet: any): Observable<any> {
    return this.http.get<IStockItemLista[]>(
      this.URL_API + objetoStockGet.store.id + objetoStockGet.good.id,
      this.httpOptions
    );
  }

  //Agregar o Restar Stock a muchos objetos
  agregarStock(StockMasivo: any): Observable<any> {
    return this.http.put<IStockMasivo>(
      this.URL_API + '/add',
      StockMasivo,
      this.httpOptions
    );
  }

  //Actualizar Stock
  cambiarStock(StockPutMasivo: any): Observable<any> {
    return this.http.put<IStockMasivo>(
      this.URL_API + '/change',
      StockPutMasivo,
      this.httpOptions
    );
  }

  //Enviar entre sucursales
  transferirStock(StockPutTransfer: any): Observable<any> {
    return this.http.put<IStockPutTransfer>(
      this.URL_API + '/transfer',
      StockPutTransfer,
      this.httpOptions
    );
  }
}
