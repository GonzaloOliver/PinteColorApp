import { Exclude, Expose } from 'class-transformer';
import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { City } from '../../cities/entities/city.entity';

@Exclude()
@Entity('provinces')
export class Province extends BaseEntity {
  @Expose()
  @PrimaryGeneratedColumn({ type: 'smallint' })
  id: number;

  @Expose()
  @Column({ nullable: false, unique: true })
  name: string;

  @OneToMany(() => City, (city) => city.province)
  cities: Promise<City[]>;

  constructor(partial?: Partial<Province>) {
    super();
    Object.assign(this, partial);
  }
}
