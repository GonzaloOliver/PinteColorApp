import { Controller, Get, Post, Body, Put, Param, Delete, Query } from '@nestjs/common';
import { BrandsService } from './brands.service';
import { CreateBrandDto, UpdateBrandDto } from './dto';
import { Brand } from './entities/brand.entity';
import { ResponseDto } from 'src/shared/dto/response.dto';

@Controller('brands')
export class BrandsController {
  constructor(private readonly brandsService: BrandsService) {}

  @Post()
  create(@Body() createBrandDto: CreateBrandDto): Promise<Brand> {
    return this.brandsService.create(createBrandDto);
  }

  @Get()
  findAndPaginate(@Query() params) {
    return this.brandsService.findAndPaginate(params);
  }

  @Get('all')
  findAll(@Query() params?): Promise<Brand[]> {
    return this.brandsService.findAll(params);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Brand> {
    return this.brandsService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateBrandDto: UpdateBrandDto): Promise<Brand> {
    return this.brandsService.update(+id, updateBrandDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<ResponseDto> {
    return this.brandsService.remove(+id);
  }
}
