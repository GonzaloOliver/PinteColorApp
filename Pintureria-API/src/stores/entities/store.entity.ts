import { Stock } from 'src/stock/entities/stock.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Exclude, Expose } from 'class-transformer';
import { City } from 'src/shared/location/cities/entities/city.entity';
import { Sale } from 'src/sales/entities/sale.entity';
import { IsNumber } from 'class-validator';
import { BadRequestException } from '@nestjs/common';

@Exclude()
@Entity('stores')
export class Store extends BaseEntity {
  @Expose()
  @IsNumber()
  @PrimaryGeneratedColumn()
  id: number;

  @Expose()
  @Column()
  name: string;

  @Expose()
  @Column()
  phoneNumber: string;

  @Expose()
  @Column()
  address: string;

  @Expose()
  @ManyToOne(() => City, {
    eager: true,
  })
  @JoinColumn({ name: 'city_id' })
  city: City;

  @Expose()
  @Column({ default: false })
  isPOS: boolean;

  @Expose()
  @Column({ name: 'pos_fiscal_number', nullable: true, length: 5, unique: true })
  posFiscalNumber: string;

  sales: Sale[];

  @OneToMany(() => Stock, (stock) => stock.store, {
    cascade: true,
  })
  stocks: Stock[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;

  constructor(partial?: Partial<Store>) {
    super();
    Object.assign(this, partial);
    this.isPOS ? (this.posFiscalNumber = partial.posFiscalNumber) : (this.posFiscalNumber = null);
  }

  isPos() {
    if (!this.isPOS) throw new BadRequestException('La sucursal no está habilitada para vender');
  }
}
