import { Controller, Get, Post, Body, Put, Param, Delete,Query } from '@nestjs/common';
import { PricelistService } from './pricelist.service';
import { CreatePricelistDto } from './dto/create-pricelist.dto';
import { UpdatePricelistDto } from './dto/update-pricelist.dto';
import { PriceList } from './entities/pricelist.entity';

@Controller('pricelist')
export class PricelistController {
  constructor(private readonly pricelistService: PricelistService) {}

  @Post()
  create(@Body() createPricelistDto: CreatePricelistDto) {
    return this.pricelistService.create(createPricelistDto);
  }

  @Get()
  findAndPaginate(@Query() params) {
    return this.pricelistService.findAndPaginate(params);
  }

  @Get('all')
  findAll(@Query() params?): Promise<PriceList[]> {
    return this.pricelistService.findAll(params);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pricelistService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updatePricelistDto: UpdatePricelistDto) {
    return this.pricelistService.update(+id, updatePricelistDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.pricelistService.remove(+id);
  }
}
