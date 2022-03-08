import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class StockDto {
  @IsNumber()
  @IsNotEmpty()
  readonly quantity: number;

  @IsNumber()
  @IsNotEmpty()
  readonly goodId: number;

  @IsNumber()
  @IsNotEmpty()
  readonly storeId: number;

  @IsOptional()
  @IsString()
  description: string;
}
