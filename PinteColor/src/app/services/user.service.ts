import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { IUser } from '../interfaces/usuarios/user.interface';
import { Iresponse } from '../../app/interfaces/response.interface';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UsuarioComponent } from '../components/usuario/usuario.component';
import { ICambioPasswordAbm } from '../interfaces/usuarios/cambiopasswordperfil.interface';
import { ICambioPasswordPerfil } from '../interfaces/usuarios/cambiopasswordabm.interface';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private URL_API: string = environment.url + 'users';
  private token = 'BEARER' + ' ' + localStorage.getItem('userToken');

  private user: IUser[] = [];

  httpOptions = {
    headers: new HttpHeaders({ Authorization: this.token }),
  };

  constructor(private http: HttpClient) {}

  modificarUsuario(usuario: IUser): Observable<any> {
    return this.http.put(
      this.URL_API + '/' + usuario.id,
      usuario,
      this.httpOptions
    );
  }

  setRoleUsuario(usuario: IUser): Observable<any> {
    return this.http.put(
      this.URL_API + '/' + usuario.id + '/setRole',
      usuario,
      this.httpOptions
    );
  }

  changePasswordAbm(
    usuario: IUser,
    cambiospass: ICambioPasswordAbm
  ): Observable<any> {
    return this.http.put(
      this.URL_API + '/' + usuario.id + '/changePassword',
      cambiospass,
      this.httpOptions
    );
  }

  changePasswordPerfil(
    usuario: IUser,
    cambiospass: ICambioPasswordAbm
  ): Observable<any> {
    return this.http.put(
      this.URL_API + '/changePassword',
      cambiospass,
      this.httpOptions
    );
  }

  guardarUsuario(objetoUsuario: any): Observable<Iresponse> {
    return this.http.post<Iresponse>(
      this.URL_API,
      objetoUsuario,
      this.httpOptions
    );
  }

  getPerfilUsuario(): Observable<Iresponse> {
    return this.http.get<Iresponse>(
      this.URL_API + '/profile',
      this.httpOptions
    );
  }

  eliminarUser(id: number): Observable<any> {
    return this.http.delete(this.URL_API + '/' + id, this.httpOptions);
  }

  getUsersPaginado(
    itemsPage: number,
    page: number,
    nombre: String,
    apellido: String,
    usuario: String
  ): Observable<any> {
    let url =
      this.URL_API +
      '?perPage=' +
      itemsPage +
      '&page=' +
      page +
      '&order=username:ASC';

    if (nombre != null && nombre != '') {
      url = url + '&where=firstName:' + nombre;
    }
    if (apellido != null && apellido != '') {
      url = url + '&where=lastName:' + apellido;
    }
    if (usuario != null && usuario != '') {
      url = url + '&where=username:' + usuario;
    }
    return this.http.get<IUser[]>(url, this.httpOptions);
  }

  getUsuarioById(filtroUsuario: any): Observable<any> {
    return this.http.get<IUser[]>(
      this.URL_API + '/' + filtroUsuario,
      this.httpOptions
    );
  }
}
