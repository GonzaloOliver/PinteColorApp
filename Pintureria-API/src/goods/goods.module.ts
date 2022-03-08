import { forwardRef, Module } from '@nestjs/common';
import { GoodsService } from './goods.service';
import { GoodsController } from './goods.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GoodsRepository } from './goods.repository';
import { AuthModule } from 'src/auth/auth.module';
import { StockModule } from 'src/stock/stock.module';
import { SuppliersModule } from 'src/suppliers/suppliers.module';
import { BrandsModule } from 'src/brands/brands.module';
import { LinesModule } from 'src/lines/lines.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([GoodsRepository]),
    AuthModule,
    forwardRef(() => StockModule),
    SuppliersModule,
    BrandsModule,
    LinesModule,
  ],
  controllers: [GoodsController],
  providers: [GoodsService],
  exports: [GoodsService],
})
export class GoodsModule {}
