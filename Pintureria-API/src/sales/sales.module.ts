import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomersModule } from 'src/customers/customers.module';
import { GoodsModule } from 'src/goods/goods.module';
import { PricelistModule } from 'src/pricelist/pricelist.module';
import { SettingsModule } from 'src/settings/settings.module';
import { StockModule } from 'src/stock/stock.module';
import { StockService } from 'src/stock/stock.service';
import { StoresModule } from 'src/stores/stores.module';
import { UsersModule } from 'src/users/users.module';
import { SalesController } from './sales.controller';
import { SalesRepository } from './sales.repository';
import { SalesService } from './sales.service';

@Module({
  imports: [TypeOrmModule.forFeature([SalesRepository]), GoodsModule, CustomersModule, StoresModule, UsersModule, StockModule, SettingsModule, PricelistModule],
  controllers: [SalesController],
  providers: [SalesService],
})
export class SalesModule { }
