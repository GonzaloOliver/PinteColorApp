import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { GoodsModule } from './goods/goods.module';
import { AccessControlModule } from 'nest-access-control';
import { roles } from './app.roles';
import { BrandsModule } from './brands/brands.module';
import { StoresModule } from './stores/stores.module';
import { StockModule } from './stock/stock.module';
import { SettingsModule } from './settings/settings.module';
import { LinesModule } from './lines/lines.module';
import { SectorsModule } from './sectors/sectors.module';
import { SuppliersModule } from './suppliers/suppliers.module';
import { CustomersModule } from './customers/customers.module';
import { SharedModule } from './shared/shared.module';
import { SalesModule } from './sales/sales.module';
import { PricelistModule } from './pricelist/pricelist.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot(),
    UsersModule,
    AuthModule,
    GoodsModule,
    AccessControlModule.forRoles(roles),
    BrandsModule,
    StoresModule,
    StockModule,
    SettingsModule,
    LinesModule,
    SectorsModule,
    SuppliersModule,
    CustomersModule,
    SharedModule,
    SalesModule,
    PricelistModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
