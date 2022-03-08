import { Exclude, Expose } from 'class-transformer';
import { BaseEntity, Column, Entity, PrimaryColumn, UpdateDateColumn } from 'typeorm';

@Exclude()
@Entity('settings')
export class Setting extends BaseEntity {
  @Expose()
  @PrimaryColumn({ unique: true, nullable: false })
  key: string;

  @Expose()
  @Column()
  value: string;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updateAt: Date;
}
