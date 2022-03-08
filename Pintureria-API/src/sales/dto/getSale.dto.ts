import { Exclude, Expose, Transform } from 'class-transformer';
import { Customer } from 'src/customers/entities/customer.entity';
import { PriceList } from 'src/pricelist/entities/pricelist.entity';
import { ProofType } from 'src/shared/enums';
import { Store } from 'src/stores/entities/store.entity';
import { User } from 'src/users/entities/user.entity';
import {
  BaseEntity,
} from 'typeorm';
import { SaleDetail } from '../entities/details.sale.entity';
import { Sale } from '../entities/sale.entity';

@Exclude()
export class GetSaleDto {
  @Expose()
  id: number;

  @Expose()
  saleNumber: number;

  @Expose()
  proofType: ProofType;

  @Expose()
  customer: Customer;

  @Expose()
  user: User;

  @Expose()
  pos: Store;

  @Expose()
  details: SaleDetail[];

  @Expose()
  remito: Sale;

  @Expose()
  isRemitoUsed: Boolean;

  @Expose()
  @Transform((value) => {
    if (value.value)
      return new Date(value.value.getTime() - 10800000);
  })
  date: Date;

  @Expose()
  isDebt: boolean;

  @Expose()
  commentary: string;

  @Expose()
  amount: number;

  @Expose()
  pricelist: PriceList;

  @Expose()
  pricelistDiscount: number;

  @Expose()
  afipNumber: string;
}
