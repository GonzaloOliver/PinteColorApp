import { IsNotEmpty, IsNumber } from 'class-validator';

export class StockDto {
  @IsNumber()
  @IsNotEmpty()
  readonly quantity: number;

  @IsNumber()
  @IsNotEmpty()
  readonly goodId: number;
}
