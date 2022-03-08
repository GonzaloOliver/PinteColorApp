import { Good } from 'src/goods/entities/good.entity';
import { Column, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Sale } from './sale.entity';

@Entity('sales_details')
export class SaleDetail {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Sale, (sale) => sale.details)
  @JoinColumn({ name: 'sale_id' })
  sale: Sale;

  @ManyToOne(() => Good, { eager: true })
  @JoinColumn({ name: 'good_id' })
  good: Good;

  @Column({ type: 'int' })
  quantity: number;

  @Column({ type: 'float' })
  cost: number;

  @Column({ type: 'float' })
  price: number;

  @DeleteDateColumn({ type: 'timestamp', name: 'deleted_at' })
  deletedAt: Date;
}
