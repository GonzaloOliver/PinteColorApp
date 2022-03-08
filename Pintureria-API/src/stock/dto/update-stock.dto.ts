import { Type } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Supplier } from 'src/suppliers/entities/supplier.entity';
import { StockDto } from './update.stock.dto';

export class UpdateStockDto {
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => StockDto)
  stocks: StockDto[];

  @IsOptional()
  @Type(() => Supplier)
  supplier: Supplier;

  @IsOptional()
  @IsString()
  description: string;
}
