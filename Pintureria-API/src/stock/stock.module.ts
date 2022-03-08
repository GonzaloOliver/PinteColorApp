import { forwardRef, Module } from '@nestjs/common';
import { StockService } from './stock.service';
import { StockController } from './stock.controller';
import { AuthModule } from 'src/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StockRepository } from './stock.repository';
import { GoodsModule } from 'src/goods/goods.module';
import { StoresModule } from 'src/stores/stores.module';
import { StockHistoryModule } from './stock-history/stock-history.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([StockRepository]),
    AuthModule,
    forwardRef(() => GoodsModule),
    forwardRef(() => StoresModule),
    StockHistoryModule,
  ],
  controllers: [StockController],
  providers: [StockService],
  exports: [StockService],
})
export class StockModule {}
