import { ISucursal } from 'src/app/interfaces/sucursal.interface';
import { IUser } from '../../interfaces/usuarios/user.interface';
import { Sucursal } from '../sucursal.model';
import { Rol } from './rol.model';

export class Usuario implements IUser {
  id: number;
  firstName: string;
  lastName: string;
  username: string;
  password: string;
  repeatPassword: string;
  roles: string[];
  store: ISucursal;

  constructor(result?: any) {
    if (result) {
      (this.id = result.id),
        (this.firstName = result.firstName),
        (this.lastName = result.lastName),
        (this.username = result.username),
        (this.password = result.password),
        (this.repeatPassword = result.repeatPassword),
        (this.roles = result.roles);
        (this.store = new Sucursal(result.store));
    } else {
      (this.id = 0),
        (this.firstName = ''),
        (this.lastName = ''),
        (this.username = ''),
        (this.password = ''),
        (this.repeatPassword = ''),
        (this.roles = ['']),
        (this.store = new Sucursal());
    }
  }

  borrarCampos(): void {
    (this.id = 0),
      (this.firstName = ''),
      (this.lastName = ''),
      (this.username = ''),
      (this.password = ''),
      (this.repeatPassword = ''),
      (this.roles = ['']),
      (this.store = new Sucursal());
  }
}
