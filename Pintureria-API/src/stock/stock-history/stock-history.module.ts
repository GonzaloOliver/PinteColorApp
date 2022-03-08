import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StockHistoryController } from './stock-history.controller';
import { StockHistoryRepository } from './stock-history.repository';
import { StockHistoryService } from './stock-history.service';

@Module({
  imports: [TypeOrmModule.forFeature([StockHistoryRepository])],
  controllers: [StockHistoryController],
  providers: [StockHistoryService],
  exports: [StockHistoryService],
})
export class StockHistoryModule {}
