import { InternalServerErrorException } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Exclude, Expose } from 'class-transformer';
import { IsEnum, IsNumber } from 'class-validator';
import { AppModule } from 'src/app.module';
import { Sale } from 'src/sales/entities/sale.entity';
import { SettingsService } from 'src/settings/settings.service';
import { IdType, IVA } from 'src/shared/enums';
import { City } from 'src/shared/location/cities/entities/city.entity';
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
import { CreateCustomerDto } from '../dto/create-customer.dto';
import { UpdateCustomerDto } from '../dto/update-customer.dto';

@Exclude()
@Entity('customers')
export class Customer extends BaseEntity {
  @Expose()
  @PrimaryGeneratedColumn()
  @IsNumber()
  id: number;

  @Expose()
  @Column({ type: 'varchar', nullable: true })
  private firstName: string;

  @Expose()
  @Column({ type: 'varchar', nullable: true })
  private lastName: string;

  @Expose()
  @Column({ type: 'varchar', nullable: true })
  private businessName: string;

  @Expose()
  @Column({ type: 'date', nullable: true })
  private birthdayDate: Date;

  @Expose()
  @Column({ type: 'varchar' })
  readonly idType: string;

  @Expose()
  @Column({ type: 'varchar', unique: true })
  readonly idNumber: string;

  @Expose()
  @Column({ type: 'varchar', nullable: true })
  private email: string;

  @Expose()
  @Column({ type: 'varchar', nullable: true })
  private phoneNumber: string;

  @Expose()
  @Column({ type: 'varchar', nullable: true })
  private address: string;

  @Expose()
  @ManyToOne(() => City, {
    eager: true,
  })
  @JoinColumn({ name: 'city_id' })
  city: City;

  @Expose()
  @Column({ type: 'varchar' })
  private ivaCondition: IVA;

  @Expose()
  @OneToMany(() => Sale, sale => sale.customer)
  purchases: Sale[];

  @Column({ type: 'float', default: 0 })
  debt: number;

  @Column({ type: 'float', default: 0, name: 'debt_x' })
  debtX: number;

  @Expose({ name: 'debt' })
  debtReturn: any;

  @Expose()
  @Column({ type: 'boolean', default: true })
  private active: boolean;

  @CreateDateColumn({ name: 'created_at' })
  private createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  private updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  private deletedAt: Date;

  constructor(partial?: CreateCustomerDto | UpdateCustomerDto) {
    super();
    Object.assign(this, partial);
  }

  getId(): number {
    return this.id;
  }

  getSome() {
    return true;
  }

  setCity(city: City) {
    this.city = city;
  }

  async editDebt(action: 'ADD' | 'DEDUCT' | 'NONE', isX: boolean, amount: number) {
    if (action == 'ADD' && isX) {
      this.debtX = this.debtX + amount;
    }
    else if (action == 'ADD' && !isX) {
      this.debt = this.debt + amount;
    }
    else if (action == 'DEDUCT' && isX) {
      this.debtX = this.debtX - amount;
    }
    else if (action == 'DEDUCT' && !isX) {
      this.debt = this.debt - amount;
    }
    else {
      throw new InternalServerErrorException();
    }
    this.save();
  }
}
