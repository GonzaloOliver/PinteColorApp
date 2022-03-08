import { Controller, Get, Body, Put, Param, Query } from '@nestjs/common';
import { StockService } from './stock.service';
import { UpdateStockDto } from './dto/update-stock.dto';
import { Stock } from './entities/stock.entity';
import { StockDto } from './dto/update.stock.dto';
import { TransferStockDto } from './dto';
import { ReqUser } from 'src/shared/decorators/user.decorator';
import { AppResources, RoleActions, RolePossessions } from 'src/app.roles';
import { Auth } from 'src/shared/decorators/auth.decorator';
import { User } from 'src/users/entities/user.entity';

@Controller('stock')
export class StockController {
  constructor(private readonly stockService: StockService) {}

  @Get('good/:goodId')
  findByGood(@Param('goodId') goodId: string): Promise<Stock[]> {
    return this.stockService.findByGood(+goodId);
  }

  @Get('store/:storeId')
  findByStore(@Param('storeId') storeId: string): Promise<Stock[]> {
    return this.stockService.findByStore(+storeId);
  }

  @Get('')
  findAllAndPaginate(@Query() params) {
    return this.stockService.findAndPaginate(params);
  }

  @Get('/all')
  findAll(@Query() params) {
    return this.stockService.findAllWithFilters(params);
  }

  @Get(':goodId/:storeId')
  findOneByGoodAndStore(@Param('goodId') goodId: string, @Param('storeId') storeId: string): Promise<Stock> {
    return this.stockService.findOneByGoodAndStore(+goodId, +storeId);
  }

  //ACTUALIZO UN ARTICULO ESPECIFICO EN UN DEPOSITO ESPECIFICO
  /*
  {
    "quantity": 1,
    "goodId": 1,
    "storeId": 1
  }
  */

  @Auth(AppResources.STOCK, RoleActions.UPDATE, RolePossessions.ANY)
  @Put(':goodId/:storeId')
  updateOne(
    @Param('goodId') goodId: string,
    @Param('storeId') storeId: string,
    @Body() stockDto: StockDto,
    @ReqUser() reqUser: User,
  ): Promise<Stock> {
    return this.stockService.updateOne(+goodId, +storeId, stockDto, reqUser);
  }

  //ACTUALIZO MUCHOS STOCKS JUNTOS, ESPECIFICO PROVEEDOR Y DESCRIPCION SI QUIERO
  /*
  {
    "supplier":{
        "id":1
    },
    "description":"",
    "stocks": [
        {
            "quantity": 1,
            "goodId": 1,
            "storeId": 1
        }
    ]

  }*/
  @Auth(AppResources.STOCK, RoleActions.UPDATE, RolePossessions.ANY)
  @Put('change')
  change(@Body() updateStockDto: UpdateStockDto, @ReqUser() reqUser: User) {
    return this.stockService.change(updateStockDto, reqUser);
  }

  //AGREGO O RESTO STOCK ESPECIFICO
  /*
  {
    "supplier":{
        "id":1
    },
    "description":"",
    "stocks": [
        {
            "quantity": -69,
            "goodId": 1,
            "storeId": 1
        }
    ]

}
*/
  @Auth(AppResources.STOCK, RoleActions.UPDATE, RolePossessions.ANY)
  @Put('add')
  add(@Body() updateStockDto: UpdateStockDto, @ReqUser() reqUser: User) {
    return this.stockService.add(updateStockDto, reqUser);
  }

  //TRANSFIERO STOCK ENTRE SUCURSALES
  /*{
    "originStoreId":2,
    "destinationStoreId":1,
    "description":"SDs",
    "stocks": [
        {
            "quantity": 100,
            "goodId": 1
        }
    ]

}*/
  @Auth(AppResources.STOCK, RoleActions.UPDATE, RolePossessions.ANY)
  @Put('transfer')
  transfer(@Body() transferStockDto: TransferStockDto, @ReqUser() reqUser: User) {
    return this.stockService.transfer(transferStockDto, reqUser);
  }
}
