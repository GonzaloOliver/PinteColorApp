import { Type } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsNotEmptyObject,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Matches,
  ValidateNested,
} from 'class-validator';
import { Brand } from 'src/brands/entities/brand.entity';
import { Line } from 'src/lines/entities/line.entity';
import { Aliquot } from 'src/shared/enums';
import { Supplier } from 'src/suppliers/entities/supplier.entity';
import { GoodMeasure } from '../measure.enum';

export class CreateGoodDto {
  @IsNotEmpty()
  @IsString()
  @Length(1, 15)
  @Matches(/[A-Z0-9]{3}(-)[A-Z0-9]{1,11}\b/, {
    message: 'Ingrese un código válido',
  })
  code: string;

  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @IsOptional()
  @IsString()
  readonly description: string;

  @IsNumber()
  readonly costPrice: number;

  @IsNumber()
  readonly salePrice: number;

  @IsNumber()
  readonly salePriceWithAliquot: number;

  @IsNumber()
  readonly profitMargin: number;

  @IsString()
  @IsEnum(Aliquot, {
    each: true,
    message: 'Ingrese una alicuota de IVA válida',
  })
  aliquot: string;

  @IsString()
  @IsEnum(GoodMeasure, {
    each: true,
    message: 'La unidad de medida no existe',
  })
  readonly measure: string;

  @IsNumber()
  @IsOptional()
  readonly minimumStock: number;

  @Type(() => Supplier)
  @ValidateNested()
  @IsNotEmptyObject()
  readonly supplier: Supplier;

  @Type(() => Brand)
  @ValidateNested()
  @IsNotEmptyObject()
  readonly brand: Brand;

  @Type(() => Line)
  @ValidateNested()
  @IsNotEmptyObject()
  readonly line: Line;
}
