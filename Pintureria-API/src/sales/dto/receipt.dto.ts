import { Type } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsNotEmptyObject, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Customer } from 'src/customers/entities/customer.entity';
import { ProofType } from 'src/shared/enums';
import { Store } from 'src/stores/entities/store.entity';

export class ReceiptDto {
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => Customer)
  customer: Customer;

  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => Store)
  pos: Store;

  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @IsEnum(ProofType)
  proofType: ProofType;

  @IsOptional()
  @IsString()
  commentary: string;
}
