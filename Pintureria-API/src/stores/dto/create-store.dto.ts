import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsNotEmpty,
  IsNotEmptyObject,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Matches,
  ValidateNested,
} from 'class-validator';
import { City } from 'src/shared/location/cities/entities/city.entity';

export class CreateStoreDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsString()
  readonly phoneNumber: string;

  @IsString()
  readonly address: string;

  @ValidateNested()
  @Type(() => City)
  @IsNotEmptyObject()
  readonly city: City;

  @IsBoolean()
  @IsOptional()
  readonly isPOS: boolean;

  @IsString()
  @Length(5, 5)
  @Matches(/[0-9]{5}/, { message: 'Ingrese un número de punto de venta válido' })
  @IsOptional()
  posFiscalNumber: string;
}
