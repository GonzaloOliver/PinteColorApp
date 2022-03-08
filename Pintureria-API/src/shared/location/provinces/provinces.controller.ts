import { Controller, Get, Param } from '@nestjs/common';
import { City } from '../cities/entities/city.entity';
import { Province } from './entities/province.entity';
import { ProvincesService } from './provinces.service';

@Controller('provinces')
export class ProvincesController {
  constructor(private readonly provincesService: ProvincesService) {}

  @Get()
  findAll(): Promise<Province[]> {
    return this.provincesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Province> {
    return this.provincesService.findOne(+id);
  }

  @Get(':id/cities')
  findCities(@Param('id') id: string): Promise<City[]> {
    return this.provincesService.findCities(+id);
  }
}
