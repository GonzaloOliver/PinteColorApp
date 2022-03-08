import { BadRequestException, Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ReqUser } from 'src/shared/decorators/user.decorator';
import { ProofType } from 'src/shared/enums';
import { User } from 'src/users/entities/user.entity';
import { SaleDto } from './dto';
import { NextNumberDto } from './dto/nextNumber.dto';
import { ReceiptDto } from './dto/receipt.dto';
import { UpdateSaleDto } from './dto/update-sale.dto';
import { SalesService } from './sales.service';

@Controller('sales')
export class SalesController {
  constructor(private readonly salesService: SalesService) { }

  @Post('receipt')
  createReceipt(@Body() receiptDto: ReceiptDto, @ReqUser() reqUser: User) {
    return this.salesService.createReceipt(receiptDto, reqUser);
  }

  @Post()
  create(@Body() saleDto: SaleDto, @ReqUser() reqUser: User) {
    return this.salesService.create(saleDto, reqUser);
  }

  @Delete(':id')
  delete(@Param('id') id: string, @Query('force') force: string) {
    return this.salesService.delete(+id, force);
  }

  @Patch(':id')
  update(@Body() saleDto: UpdateSaleDto, @Param('id') id: string) {
    return this.salesService.update(+id, saleDto);
  }

  @Get('nextNumber')
  async getNextNumber(@Query() nextNumberDto: NextNumberDto) {
    const next = await this.salesService.getLastNumber(nextNumberDto.proofType, nextNumberDto.posId);
    return next + 1;
  }

  @Get()
  findAndPaginate(@Query() params) {
    return this.salesService.findAndPaginate(params);
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.salesService.findOne(+id);
  }

  @Get('customer/:id')
  findByCustomer(@Param('id') id: string, @Query() params) {
    return this.salesService.findByCustomer(+id, params);
  }
}
