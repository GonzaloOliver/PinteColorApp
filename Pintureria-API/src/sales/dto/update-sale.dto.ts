import { PartialType } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { SaleDto } from './sale.dto';

export class UpdateSaleDto {
  @IsOptional()
  @IsBoolean()
  isDebt: boolean = false;

  @IsOptional()
  @IsString()
  commentary: string;

  @IsOptional()
  @IsString()
  afipNumber: string;
}
