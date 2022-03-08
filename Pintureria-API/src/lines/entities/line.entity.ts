import { Exclude, Expose } from 'class-transformer';
import { IsNumber } from 'class-validator';
import { Good } from 'src/goods/entities/good.entity';
import { Sector } from 'src/sectors/entities/sector.entity';
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
@Entity('lines')
export class Line {
  @Expose()
  @PrimaryGeneratedColumn()
  @IsNumber()
  id: number;

  @Expose()
  @Column({ nullable: false, unique: true })
  name: string;

  @OneToMany(() => Good, (good) => good.line)
  goods: Good[];

  @Expose()
  @ManyToOne(() => Sector, (sector) => sector.lines, {
    eager: true,
  })
  @JoinColumn({ name: 'sector_id' })
  sector: Sector;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp', name: 'deleted_at' })
  deletedAt: Date;

  constructor(partial?: Partial<Line>, sector?: Sector) {
    this.name = partial?.name;
    this.sector = sector;
  }

  async hasGoods() {
    if (await this.goods) return true;
    return false;
  }
}
