import { Exclude, Expose } from 'class-transformer';
import { IsNumber } from 'class-validator';
import { Good } from 'src/goods/entities/good.entity';
import { IVA } from 'src/shared/enums';
import { City } from 'src/shared/location/cities/entities/city.entity';
import {
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

@Exclude()
@Entity('suppliers')
export class Supplier {
  @Expose()
  @PrimaryGeneratedColumn()
  @IsNumber()
  id: number;

  @Expose()
  @Column({ type: 'varchar', nullable: false })
  businessName: string;

  @Expose()
  @Column({ type: 'varchar', unique: true })
  cuit: string;

  @Expose()
  @Column({ type: 'varchar' })
  contactFullName: string;

  @Expose()
  @Column({ type: 'varchar', nullable: true })
  email: string;

  @Expose()
  @Column({ type: 'varchar', nullable: true })
  phoneNumber: string;

  @Expose()
  @Column({ type: 'varchar' })
  ivaCondition: IVA;

  @Expose()
  @Column({ type: 'varchar', length: '3', unique: true })
  code: string;

  @Expose()
  @Column({ type: 'varchar', nullable: true })
  address: string;

  @Expose()
  @ManyToOne(() => City, {
    eager: true,
  })
  @JoinColumn({ name: 'city_id' })
  city: City;

  @OneToMany(() => Good, (good) => good.supplier)
  goods: Promise<Good[]>;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;

  async hasGoods() {
    if ((await this.goods).length > 0) return true;
    return false;
  }
}
