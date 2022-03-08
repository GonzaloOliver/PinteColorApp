import { Exclude, Expose, Transform } from 'class-transformer';
import { IsEnum } from 'class-validator';
import { Good } from 'src/goods/entities/good.entity';
import { Stock } from 'src/stock/entities/stock.entity';
import { Store } from 'src/stores/entities/store.entity';
import { Supplier } from 'src/suppliers/entities/supplier.entity';
import { User } from 'src/users/entities/user.entity';
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { StockAction } from '../stock-action.enum';

@Exclude()
@Entity('stock_history')
export class StockHistory {
  @Expose()
  @PrimaryGeneratedColumn()
  id: number;

  @Expose()
  @IsEnum(StockAction)
  @Column({ type: 'varchar' })
  action: StockAction;

  @Expose()
  @ManyToOne(() => Good, {
    eager: true,
    onDelete: 'CASCADE',
  })
  good: Good;

  @Expose()
  @ManyToOne(() => Supplier, {
    eager: true,
    onDelete: 'CASCADE',
  })
  supplier: Supplier;

  @Expose()
  @ManyToOne(() => Store, {
    eager: true,
    onDelete: 'CASCADE',
  })
  source: Store;

  @Expose()
  @ManyToOne(() => Store, {
    eager: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'apply_to' })
  applyTo: Store;

  @Expose()
  @ManyToOne(() => User, {
    eager: true,
    onDelete: 'CASCADE',
  })
  user: User;

  @Expose()
  @Column({ type: 'int', name: 'new_quantity' })
  newQuantity: number;

  @Expose()
  @Column({ type: 'int' })
  change: number;

  @Expose()
  @CreateDateColumn({ type: 'timestamp' })
  @Transform((value) => new Date(value.value.getTime() - 10800000))
  date: Date;

  @Expose()
  @Column({ nullable: true })
  description: string;

  constructor(
    action: StockAction,
    user: User,
    change: number,
    applyTo: Stock,
    description: string,
    source?: Store | Supplier,
  ) {
    this.action = action;
    this.user = user;
    this.change = change;
    this.newQuantity = applyTo?.getQuantity();
    this.good = applyTo?.good;
    this.applyTo = applyTo?.store;
    this.description = description;

    if (source instanceof Store) {
      this.source = source;
    } else {
      this.supplier = source;
    }
  }
}
