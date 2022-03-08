import { Controller, Get, Post, Body, Put, Param, Delete, Query } from '@nestjs/common';
import { GoodsService } from './goods.service';
import { CreateGoodDto } from './dto/create-good.dto';
import { UpdateGoodDto } from './dto/update-good.dto';
import { Good } from './entities/good.entity';
import { ResponseDto } from 'src/shared/dto/response.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('goods')
@Controller('goods')
export class GoodsController {
  constructor(private readonly goodsService: GoodsService) {}

  @Post()
  create(@Body() createGoodDto: CreateGoodDto): Promise<Good> {
    return this.goodsService.create(createGoodDto);
  }

  @Get()
  findAndPaginate(@Query() params) {
    return this.goodsService.findAndPaginate(params);
  }

  @Get('all')
  all(@Query() params): Promise<Good[]> {
    return this.goodsService.findAllWithFilters(params);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Good> {
    return this.goodsService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateGoodDto: UpdateGoodDto): Promise<Good> {
    return this.goodsService.update(+id, updateGoodDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<ResponseDto> {
    return this.goodsService.remove(+id);
  }
}
