import { Exclude, Expose, serialize } from 'class-transformer';
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, UpdateDateColumn } from 'typeorm';
import { Good } from 'src/goods/entities/good.entity';
import { Store } from 'src/stores/entities/store.entity';
import { BadRequestException } from '@nestjs/common';

@Exclude()
@Entity('stock')
export class Stock {
  @Expose()
  @Column({ default: 0 })
  private quantity: number;

  @ManyToOne(() => Good, (good) => good.stocks, {
    eager: true,
    onDelete: 'CASCADE',
    primary: true,
  })
  @JoinColumn({ name: 'good_id' })
  @Expose()
  readonly good: Good;

  @Expose()
  @ManyToOne(() => Store, (store) => store.stocks, {
    eager: true,
    onDelete: 'CASCADE',
    primary: true,
  })
  @JoinColumn({ name: 'store_id' })
  readonly store: Store;

  @CreateDateColumn({ name: 'created_at' })
  readonly createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  readonly updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  readonly deletedAt: Date;

  constructor(partial?: Partial<Stock>) {
    Object.assign(this, partial);
  }

  getQuantity(): number {
    return this.quantity;
  }

  setQuantity(quantity: number) {
    this.quantity = quantity;
  }

  addQuantity(quantity: number) {
    this.quantity += quantity;
  }

  decreaseQuantity(quantity: number) {
    if (this.quantity < quantity)
      throw new BadRequestException([
        {
          message: 'La cantidad a decrementar es mayor a la cantidad disponible',
          stock: JSON.parse(serialize(this)),
        },
      ]);

    this.quantity -= quantity;
  }
}
