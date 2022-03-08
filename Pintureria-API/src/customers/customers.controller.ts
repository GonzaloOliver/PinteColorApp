import { Controller, Get, Post, Body, Put, Param, Delete, Query } from '@nestjs/common';
import { Page } from 'src/pagination';
import { ResponseDto } from 'src/shared/dto/response.dto';
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { Customer } from './entities/customer.entity';

@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) { }

  @Post()
  create(@Body() createCustomerDto: CreateCustomerDto): Promise<Customer> {
    return this.customersService.create(createCustomerDto);
  }

  @Get('all')
  findAll(@Query() params?): Promise<Customer[]> {
    return this.customersService.findAll(params);
  }

  @Get()
  findAndPaginate(@Query() params): Promise<Page<Customer>> {
    return this.customersService.findAndPaginate(params);
  }

  @Get(':id/debt')
  findDebt(@Param('id') id: string) {
    return this.customersService.getDebt(+id);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Customer> {
    return this.customersService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateCustomerDto: UpdateCustomerDto): Promise<Customer> {
    return this.customersService.update(+id, updateCustomerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<ResponseDto> {
    return this.customersService.remove(+id);
  }
}
