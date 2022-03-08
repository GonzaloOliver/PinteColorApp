import { Type } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNotEmptyObject,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Length,
  Matches,
  ValidateNested,
} from 'class-validator';
import { IVA } from 'src/shared/enums';
import { City } from 'src/shared/location/cities/entities/city.entity';

export class CreateSupplierDto {
  @IsNotEmpty()
  @IsString()
  readonly businessName: string;

  @IsString()
  @Matches(/(20|23|24|27|30|33|34)(-)[0-9]{8}(-)[0-9]/, { message: 'Ingrese un CUIT válido' })
  readonly cuit: string;

  @IsString()
  @IsOptional()
  readonly contactFullName: string;

  @IsEmail()
  @IsOptional()
  readonly email: string;

  @IsString()
  @IsPhoneNumber('AR')
  @IsOptional()
  readonly phoneNumber: string;

  @IsString()
  @Length(3, 3)
  code: string;

  @IsString()
  @IsEnum(IVA, {
    each: true,
    message: 'Ingrese una condición de IVA válida',
  })
  readonly ivaCondition: IVA;

  @IsString()
  @IsOptional()
  readonly address: string;

  @ValidateNested()
  @Type(() => City)
  @IsNotEmptyObject()
  readonly city: City;
}
