import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { IAuth } from '../../app/interfaces/auth.interface';
import { Iresponse } from '../../app/interfaces/response.interface';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  url: string = environment.url + 'auth/login';

  constructor(private http: HttpClient) {}

  loginByUsuario(login: IAuth): Observable<any> {
    return this.http.post<any>(this.url, login);
  }
}
