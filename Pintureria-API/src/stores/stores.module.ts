import { forwardRef, Module } from '@nestjs/common';
import { StoresService } from './stores.service';
import { StoresController } from './stores.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StoresRepository } from './stores.repository';
import { AuthModule } from 'src/auth/auth.module';
import { StockModule } from 'src/stock/stock.module';
import { CitiesModule } from 'src/shared/location/cities/cities.module';

@Module({
  imports: [TypeOrmModule.forFeature([StoresRepository]), AuthModule, forwardRef(() => StockModule), CitiesModule],
  controllers: [StoresController],
  providers: [StoresService],
  exports: [StoresService],
})
export class StoresModule {}
