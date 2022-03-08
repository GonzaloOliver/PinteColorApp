import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { StockDto } from './transfer.stock.dto';

export class TransferStockDto {
  @IsNotEmpty()
  @IsNumber()
  originStoreId: number;

  @IsNotEmpty()
  @IsNumber()
  destinationStoreId: number;

  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => StockDto)
  stocks: StockDto[];

  @IsOptional()
  @IsString()
  description: string;
}
