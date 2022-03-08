import { Exclude, Expose } from 'class-transformer';
import { IsNumber } from 'class-validator';

import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Exclude()
@Entity('pricelist')
export class PriceList {
  @Expose()
  @PrimaryGeneratedColumn()
  @IsNumber()
  id: number;

  @Expose()
  @Column({ nullable: false, unique: true })
  name: string;

  @Expose()
  @Column({ nullable: false, unique: true })
  value: number;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp', name: 'deleted_at' })
  deletedAt: Date;

  constructor(partial?: Partial<PriceList>) {
    Object.assign(this, partial);
  }
}
