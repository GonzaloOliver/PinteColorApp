import { Type } from 'class-transformer';
import {
  IsDate,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNotEmptyObject,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Matches,
  ValidateNested,
} from 'class-validator';
import { IdType, IVA } from 'src/shared/enums';
import { City } from 'src/shared/location/cities/entities/city.entity';

export class CreateCustomerDto {
  @IsNotEmpty()
  @IsString()
  readonly firstName: string;

  @IsNotEmpty()
  @IsString()
  readonly lastName: string;

  @IsOptional()
  @IsString()
  readonly businessName: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  readonly birthdayDate: Date;

  @IsNotEmpty()
  @IsEnum(IdType)
  readonly idType: IdType;

  @IsNotEmpty()
  @IsString()
  @Matches(/(^(20|23|24|27|30|33|34)(-)[0-9]{8}(-)[0-9]\b)|(^[0-9]{8}\b)/, {
    message: 'Ingrese un identificador válido',
  })
  readonly idNumber: string;

  @IsOptional()
  @IsEmail()
  readonly email: string;

  @IsOptional()
  @IsString()
  @IsPhoneNumber('AR')
  readonly phoneNumber: string;

  @IsOptional()
  @IsString()
  readonly address: string;

  @ValidateNested()
  @Type(() => City)
  @IsNotEmptyObject()
  readonly city: City;

  @IsString()
  @IsEnum(IVA, {
    each: true,
    message: 'Ingrese una condición de IVA válida',
  })
  readonly ivaCondition: IVA;
}
