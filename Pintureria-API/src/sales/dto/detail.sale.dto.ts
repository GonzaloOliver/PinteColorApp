import { Type } from 'class-transformer';
import { IsNumber, ValidateNested } from 'class-validator';
import { Good } from 'src/goods/entities/good.entity';

export class SaleDetailDto {
  @Type(() => Good)
  @ValidateNested()
  readonly good: Good;

  @IsNumber()
  readonly quantity: number;

  @IsNumber()
  readonly price: number;
}
