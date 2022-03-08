import { Exclude, Expose } from 'class-transformer';
import { IsNumber } from 'class-validator';
import { Good } from 'src/goods/entities/good.entity';
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
@Entity('brands')
export class Brand {
  @Expose()
  @PrimaryGeneratedColumn()
  @IsNumber()
  id: number;

  @Expose()
  @Column({ nullable: false, unique: true })
  name: string;

  @OneToMany(() => Good, (good) => good.brand)
  goods: Good[];

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp', name: 'deleted_at' })
  deletedAt: Date;

  constructor(partial?: Partial<Brand>) {
    Object.assign(this, partial);
  }

  async hasGoods() {
    if (await this.goods) return true;
    return false;
  }
}
