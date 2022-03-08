import { OmitType } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { CreateUserDto } from './';

export class UpdateUserDto extends OmitType(CreateUserDto, ['password', 'repeatPassword', 'roles']) {
  @IsOptional()
  @IsString()
  readonly username: string;

  @IsOptional()
  @IsString()
  readonly firstName: string;

  @IsOptional()
  @IsString()
  readonly lastName: string;
}
