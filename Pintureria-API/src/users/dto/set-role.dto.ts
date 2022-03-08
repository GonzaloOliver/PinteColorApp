import { IsArray, IsEnum } from 'class-validator';
import { AppRoles } from 'src/app.roles';

export class SetRoleDto {
  @IsArray()
  @IsEnum(AppRoles, {
    each: true,
    message: 'El rol elegido es incorrecto',
  })
  roles: string[];
}
