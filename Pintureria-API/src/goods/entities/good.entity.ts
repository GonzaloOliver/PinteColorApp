import { Exclude, Expose } from 'class-transformer';
import { IsNumber } from 'class-validator';
import { Brand } from 'src/brands/entities/brand.entity';
import { Line } from 'src/lines/entities/line.entity';
import { Stock } from 'src/stock/entities/stock.entity';
import { Supplier } from 'src/suppliers/entities/supplier.entity';
import {
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';

@Exclude()
@Entity('goods')
export class Good {
  @Expose()
  @PrimaryGeneratedColumn()
  @IsNumber()
  readonly id: number;

  @Expose()
  @Column({ type: 'varchar', length: '15', unique: true })
  code: string;

  @Expose()
  @Column({ type: 'varchar' })
  readonly name: string;

  @Expose()
  @Column({ type: 'varchar', nullable: true })
  readonly description: string;

  @Expose()
  @Column({ type: 'float' })
  readonly costPrice: number;

  @Expose()
  @Column({ type: 'float' })
  readonly salePrice: number;

  @Expose()
  @Column({ type: 'float' })
  readonly salePriceWithAliquot: number;

  @Expose()
  @Column({ type: 'float' })
  readonly profitMargin: number;

  @Expose()
  @Column({ type: 'int', default: 0 })
  readonly minimumStock: number;

  @Expose()
  @Column()
  readonly measure: string;

  @Expose()
  @Column()
  readonly aliquot: string;

  @Expose()
  @ManyToOne(() => Supplier, (supplier) => supplier.goods, {
    eager: true,
  })
  @JoinColumn({ name: 'supplier_id' })
  supplier: Supplier;

  @Expose()
  @ManyToOne(() => Brand, (brand) => brand.goods, {
    eager: true,
  })
  @JoinColumn({ name: 'brand_id' })
  brand: Brand;

  @Expose()
  @ManyToOne(() => Line, (line) => line.goods, {
    eager: true,
  })
  @JoinColumn({ name: 'line_id' })
  line: Line;

  @OneToMany(() => Stock, (stock) => stock.good, {
    cascade: true,
  })
  stocks: Stock[];

  @CreateDateColumn({ name: 'created_at' })
  readonly createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  readonly updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  readonly deletedAt: Date;

  constructor(partial?: Partial<Good>, brand?: Brand, line?: Line, supplier?: Supplier) {
    Object.assign(this, partial);
    if (brand) this.brand = brand;
    if (line) this.line = line;
    if (supplier) this.supplier = supplier;
  }
}
