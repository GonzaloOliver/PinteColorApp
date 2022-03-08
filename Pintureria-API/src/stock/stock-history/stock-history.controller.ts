import { Controller, Get, Body, Put, Param, Query } from '@nestjs/common';
import { StockHistoryService } from './stock-history.service';

@Controller('stock-history')
export class StockHistoryController {
  constructor(private readonly stockHistoryService: StockHistoryService) {}

  @Get()
  findAndPaginate(@Query() params) {
    return this.stockHistoryService.findAndPaginate(params);
  }
}
