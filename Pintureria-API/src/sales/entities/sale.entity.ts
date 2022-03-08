import { Exclude, Expose, Transform } from 'class-transformer';
import { IsNumber } from 'class-validator';
import { Customer } from 'src/customers/entities/customer.entity';
import { PriceList } from 'src/pricelist/entities/pricelist.entity';
import { ProofType } from 'src/shared/enums';
import { Store } from 'src/stores/entities/store.entity';
import { User } from 'src/users/entities/user.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { SaleDetail } from './details.sale.entity';

@Exclude()
@Entity('sales')
export class Sale extends BaseEntity {
  @Expose()
  @IsNumber()
  @PrimaryGeneratedColumn()
  id: number;

  @Expose()
  @Column({ type: 'int', nullable: false, name: 'sale_number' })
  saleNumber: number;

  @Expose()
  @Column({ type: 'varchar', name: 'type' })
  proofType: ProofType;

  @Expose()
  @ManyToOne(() => Customer, (customer) => customer.purchases, {
    eager: true,
  })
  @JoinColumn({ name: 'customer_id' })
  customer: Customer;

  @Expose()
  @ManyToOne(() => User, (user) => user.sales)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Expose()
  @ManyToOne(() => Store, (store) => store.sales, { eager: true })
  @JoinColumn({ name: 'pos_id' })
  pos: Store;

  @Expose()
  @OneToMany(() => SaleDetail, (saleDetail) => saleDetail.sale, {
    eager: true,
    cascade: true,
  })
  details: SaleDetail[];

  @Expose()
  @OneToOne(() => Sale, { lazy: true })
  @JoinColumn({ name: 'remito_id' })
  remito: Sale;

  @Expose()
  @Column({ type: 'boolean', nullable: true, name: 'is_remito_used' })
  isRemitoUsed: Boolean;

  @Expose()
  @CreateDateColumn({ type: 'timestamp with time zone', name: 'date' })
  @Transform((value) => {
    if (value.value)
      return new Date(value.value.getTime() - 10800000);
  })
  date: Date;

  @Expose()
  @Column({ type: 'boolean', name: 'is_debt' })
  isDebt: boolean;

  @Expose()
  @Column({ type: 'varchar', name: 'commentary', nullable: true })
  commentary: string;

  @Expose()
  @Column({ type: 'float', name: 'amount' })
  amount: number;

  @Expose()
  @ManyToOne(() => PriceList, { eager: true })
  pricelist: PriceList;

  @Expose()
  @Column({ type: 'float', name: 'pricelist_discount', default: 0 })
  pricelistDiscount: number;

  @Expose()
  @Column({ type: 'varchar', name: 'afip_number', nullable: true })
  afipNumber: string;

  @DeleteDateColumn({ type: 'timestamp', name: 'deleted_at' })
  deletedAt: Date;
}
