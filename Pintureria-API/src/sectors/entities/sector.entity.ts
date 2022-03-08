import { Exclude, Expose } from 'class-transformer';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { Line } from 'src/lines/entities/line.entity';
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
@Entity('sectors')
export class Sector {
  @Expose()
  @PrimaryGeneratedColumn()
  @IsNumber()
  id: number;

  @Expose()
  @Column({ nullable: false, unique: true })
  name: string;

  @OneToMany(() => Line, (line) => line.sector)
  lines: Promise<Line[]>;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp', name: 'deleted_at' })
  deletedAt: Date;

  constructor(partial?: Partial<Sector>) {
    Object.assign(this, partial);
  }

  async hasLines() {
    if (await (await this.lines).length > 0) return true;
    return false;
  }
}
