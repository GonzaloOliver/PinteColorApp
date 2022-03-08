import { Type } from 'class-transformer';
import { IsArray, IsBoolean, IsBooleanString, IsEnum, IsNotEmptyObject, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Customer } from 'src/customers/entities/customer.entity';
import { PriceList } from 'src/pricelist/entities/pricelist.entity';
import { ProofType } from 'src/shared/enums';
import { Store } from 'src/stores/entities/store.entity';
import { Sale } from '../entities/sale.entity';
import { SaleDetailDto } from './detail.sale.dto';

export class SaleDto {
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => Customer)
  customer: Customer;

  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => Store)
  pos: Store;

  @IsArray()
  @ValidateNested()
  @Type(() => SaleDetailDto)
  details: SaleDetailDto[];

  @IsNumber()
  @IsOptional()
  discount: number;

  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => PriceList)
  pricelist: PriceList;

  @IsOptional()
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => Sale)
  remito: Sale;

  @IsEnum(ProofType)
  proofType: ProofType;

  @IsOptional()
  @IsBoolean()
  isDebt: boolean = false;

  @IsOptional()
  @IsString()
  commentary: string;

  @IsString()
  afipNumber: string;
}
