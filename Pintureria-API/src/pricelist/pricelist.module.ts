import { Module } from '@nestjs/common';
import { PricelistService } from './pricelist.service';
import { PricelistController } from './pricelist.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PriceListRepository } from './pricelist.repository';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([PriceListRepository]), AuthModule],
  controllers: [PricelistController],
  providers: [PricelistService],
  exports: [PricelistService],
})
export class PricelistModule {}
