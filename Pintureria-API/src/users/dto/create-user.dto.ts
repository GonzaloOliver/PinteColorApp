import { Type } from 'class-transformer';
import { IsString, IsNotEmpty, IsEnum, IsArray, IsOptional, IsNotEmptyObject } from 'class-validator';
import { AppRoles } from 'src/app.roles';
import { Store } from 'src/stores/entities/store.entity';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  readonly username: string;

  @IsNotEmpty()
  @IsString()
  readonly password: string;

  @IsNotEmpty()
  @IsString()
  readonly repeatPassword: string;

  @IsOptional()
  @IsString()
  readonly firstName: string;

  @IsOptional()
  @IsString()
  readonly lastName: string;

  @IsOptional()
  @Type(() => Store)
  @IsNotEmptyObject()
  readonly store: Store;

  @IsArray()
  @IsEnum(AppRoles, {
    each: true,
    message: 'El rol elegido es incorrecto',
  })
  roles: string[];
}
