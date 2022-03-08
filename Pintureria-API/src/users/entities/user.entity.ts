import { BadRequestException } from '@nestjs/common';
import { compare, hash } from 'bcryptjs';
import { Exclude, Expose } from 'class-transformer';
import { IsEnum } from 'class-validator';
import { AppRoles } from 'src/app.roles';
import { Sale } from 'src/sales/entities/sale.entity';
import { Store } from 'src/stores/entities/store.entity';
import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  BeforeInsert,
  BeforeUpdate,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Exclude()
@Entity('users')
export class User extends BaseEntity {
  @Expose()
  @PrimaryGeneratedColumn()
  id: number;

  @Expose()
  @Column({ type: 'varchar', unique: true, nullable: false })
  username: string;

  @Column({ type: 'varchar', nullable: false })
  password: string;

  @Expose()
  @Column({ type: 'varchar', nullable: true, name: 'first_name' })
  firstName: string;

  @Expose()
  @Column({ type: 'varchar', nullable: true, name: 'last_name' })
  lastName: string;

  @Expose()
  @ManyToOne(() => Store, {
    eager: true,
  })
  @JoinColumn({ name: 'store_id' })
  store: Store;

  @Expose()
  @IsEnum(AppRoles)
  @Column({ type: 'simple-array' })
  roles: string[];

  sales: Sale[];

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (!this.password) return;
    this.password = await hash(this.password, 10);
  }

  async setPassword(newPassword: string, oldPassword?: string) {
    if (oldPassword) {
      const isMatchPassword = await compare(oldPassword, this.password);

      if (!isMatchPassword) throw new BadRequestException('La contraseña actual es incorrecta');
    }

    this.password = newPassword;

    this.save();

    return { status: 200, message: 'Contraseña cambiada' };
  }

  constructor(partial?: Partial<User>) {
    super();
    Object.assign(this, partial);
  }

  setRole(role: string) {
    this.roles = [role];
  }

  getFullname(): string {
    return this.firstName + ' ' + this.lastName;
  }
}
