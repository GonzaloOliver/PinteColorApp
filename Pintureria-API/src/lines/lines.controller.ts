import { Controller, Get, Post, Body, Put, Param, Delete, Query } from '@nestjs/common';
import { LinesService } from './lines.service';
import { CreateLineDto, UpdateLineDto } from './dto';
import { Line } from './entities/line.entity';
import { ResponseDto } from 'src/shared/dto/response.dto';

@Controller('lines')
export class LinesController {
  constructor(private readonly linesService: LinesService) { }

  @Post()
  create(@Body() createLineDto: CreateLineDto): Promise<Line> {
    return this.linesService.create(createLineDto);
  }

  @Get()
  findAndPaginate(@Query() params) {
    return this.linesService.findAndPaginate(params);
  }

  @Get('all')
  findAll() {
    return this.linesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Line> {
    return this.linesService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateLineDto: UpdateLineDto): Promise<Line> {
    return this.linesService.update(+id, updateLineDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<ResponseDto> {
    return this.linesService.remove(+id);
  }
}
