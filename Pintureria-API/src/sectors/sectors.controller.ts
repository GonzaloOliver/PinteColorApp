import { Controller, Get, Post, Body, Put, Param, Delete, Query } from '@nestjs/common';
import { SectorsService } from './sectors.service';
import { CreateSectorDto } from './dto/create-sector.dto';
import { UpdateSectorDto } from './dto/update-sector.dto';
import { Sector } from './entities/sector.entity';
import { ResponseDto } from 'src/shared/dto/response.dto';
import { Line } from 'src/lines/entities/line.entity';

@Controller('sectors')
export class SectorsController {
  constructor(private readonly sectorsService: SectorsService) {}

  @Post()
  create(@Body() createSectorDto: CreateSectorDto): Promise<Sector> {
    return this.sectorsService.create(createSectorDto);
  }

  @Get()
  findAndPaginate(@Query() params) {
    return this.sectorsService.findAndPaginate(params);
  }

  @Get('all')
  findAll() {
    return this.sectorsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Sector> {
    return this.sectorsService.findOne(+id);
  }

  @Get(':id/lines')
  findLines(@Param('id') id: string): Promise<Line[]> {
    return this.sectorsService.findLines(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateSectorDto: UpdateSectorDto): Promise<Sector> {
    return this.sectorsService.update(+id, updateSectorDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<ResponseDto> {
    return this.sectorsService.remove(+id);
  }
}
