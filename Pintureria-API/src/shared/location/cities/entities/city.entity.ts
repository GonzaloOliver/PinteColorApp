import { Exclude, Expose } from 'class-transformer';
import { IsNumber } from 'class-validator';
import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Province } from '../../provinces/entities/province.entity';

@Exclude()
@Entity('cities')
export class City extends BaseEntity {
  @Expose()
  @IsNumber()
  @PrimaryGeneratedColumn({ type: 'smallint' })
  id: number;

  @Expose()
  @Column({ nullable: false, unique: false })
  name: string;

  @Expose()
  @Column({ nullable: false, unique: false, name: 'zip_code', type: 'smallint' })
  zipCode: number;

  @Expose()
  @ManyToOne(() => Province, (province) => province.cities, {
    eager: true,
  })
  @JoinColumn({ name: 'province_id' })
  province: Province;

  constructor(partial?: Partial<City>) {
    super();
    Object.assign(this, partial);
  }
}
