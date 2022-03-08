import { Controller, Get, Post, Body, Put, Param, Delete, Query } from '@nestjs/common';
import { StoresService } from './stores.service';
import { Store } from './entities/store.entity';
import { CreateStoreDto, UpdateStoreDto } from './dto';
import { ResponseDto } from 'src/shared/dto/response.dto';

@Controller('stores')
export class StoresController {
  constructor(private readonly storesService: StoresService) {}

  @Post()
  create(@Body() createStoreDto: CreateStoreDto): Promise<Store> {
    return this.storesService.create(createStoreDto);
  }

  @Get()
  findAndPaginate(@Query() params) {
    return this.storesService.findAndPaginate(params);
  }

  @Get('all')
  findAll() {
    return this.storesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Store> {
    return this.storesService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateStoreDto: UpdateStoreDto): Promise<Store> {
    return this.storesService.update(+id, updateStoreDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<ResponseDto> {
    return this.storesService.remove(+id);
  }
}
