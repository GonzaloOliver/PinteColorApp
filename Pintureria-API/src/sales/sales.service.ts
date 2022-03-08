import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CustomersService } from 'src/customers/customers.service';
import { GoodsService } from 'src/goods/goods.service';
import { IPaginationOptions, Page } from 'src/pagination';
import { PricelistService } from 'src/pricelist/pricelist.service';
import { SettingsService } from 'src/settings/settings.service';
import { ProofType } from 'src/shared/enums';
import { StockAction } from 'src/stock/stock-history/stock-action.enum';
import { StockService } from 'src/stock/stock.service';
import { StoresService } from 'src/stores/stores.service';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { SaleDto } from './dto';
import { GetSaleDto } from './dto/getSale.dto';
import { ReceiptDto } from './dto/receipt.dto';
import { UpdateSaleDto } from './dto/update-sale.dto';
import { SaleDetail } from './entities/details.sale.entity';
import { Sale } from './entities/sale.entity';
import { ProofReturn } from './ProofReturn';
import { SalesRepository } from './sales.repository';

@Injectable()
export class SalesService {
  constructor(
    private readonly salesRepository: SalesRepository,
    private readonly goodsService: GoodsService,
    private readonly customersService: CustomersService,
    private readonly storesService: StoresService,
    private readonly usersService: UsersService,
    private readonly stockService: StockService,
    private readonly settingsService: SettingsService,
    private readonly pricelistService: PricelistService,
  ) { }

  getProofTypeConfig(proofType: ProofType): ProofReturn {
    const res: ProofReturn = {
      stock: 'NONE',
      always: false,
      debtAction: 'NONE',
      afipNumber: false,
    };
    switch (proofType) {
      default:
        res.stock = 'NONE';
        res.always = true;
        res.debtAction = 'NONE';
        res.afipNumber = false;
        break;
      case ProofType.FacturaX:
        res.stock = 'DISCOUNT';
        res.always = false;
        res.debtAction = 'ADD';
        res.afipNumber = false;
        break;
      case (ProofType.NotaCreditoX):
        res.stock = 'ADD';
        res.always = false;
        res.debtAction = 'DEDUCT';
        res.afipNumber = false;
        break;
      case (ProofType.ReciboX):
        res.stock = 'NONE';
        res.always = false;
        res.debtAction = 'DEDUCT';
        res.afipNumber = false;
        break;
      case (ProofType.Presupuesto):
        res.stock = 'NONE';
        res.always = true;
        res.debtAction = 'NONE';
        res.afipNumber = false;
        break;
      case (ProofType.Recibo):
        res.stock = 'NONE';
        res.always = true;
        res.debtAction = 'DEDUCT';
        res.afipNumber = false;
        break;
      case (ProofType.FacturaA):
        res.stock = 'DISCOUNT';
        res.always = true;
        res.debtAction = 'ADD';
        res.afipNumber = true;
        break;
      case (ProofType.FacturaB):
        res.stock = 'DISCOUNT';
        res.always = true;
        res.debtAction = 'ADD';
        res.afipNumber = true;
        break;
      case (ProofType.NotaCreditoA):
        res.stock = 'ADD';
        res.always = true;
        res.debtAction = 'DEDUCT';
        res.afipNumber = true;
        break;
      case ProofType.NotaCreditoB:
        res.stock = 'ADD';
        res.always = true;
        res.debtAction = 'DEDUCT';
        res.afipNumber = true;
        break;
      case ProofType.NotaDebitoA:
        res.stock = 'DISCOUNT';
        res.always = true;
        res.debtAction = 'ADD';
        res.afipNumber = true;
        break;
      case ProofType.NotaDebitoB:
        res.stock = 'DISCOUNT';
        res.always = true;
        res.debtAction = 'ADD';
        res.afipNumber = true;
        break;
      case ProofType.NotaDebitoX:
        res.stock = 'DISCOUNT';
        res.always = false;
        res.debtAction = 'ADD';
        res.afipNumber = false;
        break;
      case ProofType.Remito:
        res.stock = 'DISCOUNT';
        res.always = true;
        res.debtAction = 'NONE';
        res.afipNumber = false;
        break;
    }
    return res;
  }

  async exists(id: number): Promise<Sale> {
    const pricelistExists = await this.salesRepository.findOne(id);

    if (!pricelistExists) throw new NotFoundException('La venta no existe');

    return pricelistExists;
  }

  async create(saleDto: SaleDto, user: User) {
    const sale = new Sale();

    if (saleDto.proofType == ProofType.Recibo || saleDto.proofType == ProofType.ReciboX)
      throw new BadRequestException('Tipo invalido');

    sale.customer = await this.customersService.exists(saleDto.customer.id);
    sale.pos = await this.storesService.exists(saleDto.pos.id);
    sale.pricelist = await this.pricelistService.exists(saleDto.pricelist.id);
    sale.isDebt = false;

    sale.pos.isPos();

    const proofConfig = this.getProofTypeConfig(saleDto.proofType);

    if (proofConfig.afipNumber && !saleDto.afipNumber) throw new BadRequestException('Es necesario el id de AFIP');
    if (saleDto.afipNumber) sale.afipNumber = saleDto.afipNumber;

    if (await this.salesRepository.findOne({ afipNumber: saleDto.afipNumber })) throw new BadRequestException('El id de AFIP ya se encuentra registrado');

    if (saleDto.isDebt && proofConfig.debtAction != 'NONE') {
      sale.isDebt = true;
    }

    sale.user = await this.usersService.exists(1);

    sale.details = [];

    sale.pricelistDiscount = sale.pricelist.value;

    var mult = 1;

    if (saleDto.discount) {
      mult = 1 - saleDto.discount * 0.01;
    }

    if (saleDto.remito) {
      proofConfig.stock = 'NONE';
      const remito = await this.salesRepository.findOne(saleDto.remito.id);
      if (!remito) throw new BadRequestException('El remito ingresado no existe');
      if (![ProofType.Remito].includes(remito.proofType))
        throw new BadRequestException('El remito seleccionado no es un remito');
      if (await this.salesRepository.findOne({ remito: remito }, { withDeleted: true }))
        throw new BadRequestException('Ya hay una venta asociada al remito')
      sale.remito = remito;
      remito.isRemitoUsed = true;
      await remito.save().catch(() => {
        throw new InternalServerErrorException('Error al actualizar el remito')
      })
    }

    var saleTotal = 0;

    for (const detail of saleDto.details) {
      const newDetail = new SaleDetail();
      const good = await this.goodsService.exists(detail.good.id);
      newDetail.good = good;
      newDetail.quantity = detail.quantity;
      newDetail.price = detail.price * mult;
      newDetail.cost = good.costPrice;
      saleTotal = saleTotal + newDetail.price * newDetail.quantity;

      if (proofConfig.stock === 'DISCOUNT') this.stockService.sell(detail.quantity, good, sale.pos, user);
      if (proofConfig.stock === 'ADD') this.stockService.return(detail.quantity, good, sale.pos, user);

      sale.details.push(newDetail);
    }

    if (proofConfig.debtAction != 'NONE' && sale.isDebt) {
      await sale.customer.editDebt(proofConfig.debtAction, !proofConfig.always, saleTotal);
    }

    sale.amount = saleTotal;

    sale.proofType = saleDto.proofType;

    if (sale.proofType == ProofType.Remito) sale.isRemitoUsed = false;

    sale.saleNumber = await this.getLastNumber(saleDto.proofType, saleDto.pos.id) + 1;

    sale.commentary = saleDto.commentary;

    return await this.salesRepository.save(sale);
  }

  async getLastNumber(type: ProofType, posId: number): Promise<number> {
    const lastSale = await this.salesRepository.getLastNumber(type, posId)
    return lastSale;
  }

  async findOne(id: number): Promise<GetSaleDto> {
    const response = await this.salesRepository.getSale(id);

    const sale = new GetSaleDto();

    sale.id = response.sale.id;
    sale.saleNumber = response.sale.saleNumber;
    sale.remito = response.remito;
    sale.proofType = response.sale.proofType;
    sale.customer = response.sale.customer;
    sale.user = response.sale.user;
    sale.pos = response.sale.pos;
    sale.details = response.sale.details;
    sale.remito = response.remito;
    sale.isRemitoUsed = response.sale.isRemitoUsed;
    sale.date = response.sale.date;
    sale.isDebt = response.sale.isDebt;
    sale.commentary = response.sale.commentary;
    sale.amount = response.sale.amount;
    sale.pricelist = response.sale.pricelist;
    sale.pricelistDiscount = response.sale.pricelistDiscount;
    sale.afipNumber = response.sale.afipNumber;

    const dbKey = await this.settingsService.getS();

    if (!dbKey) {
      const config = this.getProofTypeConfig(sale.proofType);

      if (config.always == false) throw new NotFoundException('La venta no existe')
    }

    return sale;
  }

  async update(saleId: number, saleDto: UpdateSaleDto) {
    const sale = await this.exists(saleId);

    if (saleDto.afipNumber) {
      const oldSale = await this.salesRepository.findOne({ afipNumber: saleDto.afipNumber });
      if (oldSale) {
        if (oldSale.id != saleId)
          throw new BadRequestException('El id de AFIP ya se encuentra registrado');
      }

      sale.afipNumber = saleDto.afipNumber;
    }

    if (saleDto.commentary) {
      sale.commentary = saleDto.commentary;
    }

    if (saleDto.isDebt != sale.isDebt) {
      const proofConfig = this.getProofTypeConfig(sale.proofType);

      if (proofConfig.debtAction != 'NONE') {
        sale.isDebt = saleDto.isDebt;
        if (saleDto.isDebt) {
          await sale.customer.editDebt(proofConfig.debtAction, !proofConfig.always, sale.amount);
        } else {
          if (proofConfig.debtAction == 'ADD') {
            await sale.customer.editDebt('DEDUCT', !proofConfig.always, sale.amount);
          }
          else {
            await sale.customer.editDebt('ADD', !proofConfig.always, sale.amount);
          }
        }
      }
    }

    await sale.save().catch((e) => {
      throw new InternalServerErrorException('Error');
    });

    return await this.exists(saleId);
  }

  async delete(saleId: number, force: string) {
    const user = await this.usersService.exists(1);
    const sale = await this.exists(saleId);
    const remito = await Promise.resolve(sale.remito);

    const proofConfig = this.getProofTypeConfig(sale.proofType);

    if (sale.proofType == ProofType.Remito) {
      if (sale.isRemitoUsed) {
        const facturaAsociada = await this.salesRepository.findOne({ remito: { id: sale.id } });
        //Si tiene factura asociada se intenta borrar, si no tiene hubo un error al guardar isRemitoUsed
        if (facturaAsociada) {
          //Si no se fuerza, no se puede borrar el remito, tiene que borrar si o si la factura
          if (!force || force == 'false') {
            if (sale.isRemitoUsed) throw new BadRequestException('El remito no puede ser borrado porque tiene una factura asociada. Factura Tipo: ' + facturaAsociada.proofType + ' - N°: ' + facturaAsociada.saleNumber);
          }
          else {
            //Si tambien quiere borrar la factura, la borramos, el remito se borra fuera del if
            facturaAsociada.remito = null;
            facturaAsociada.save().catch((e) => {
              throw new InternalServerErrorException('Error: ' + e);
            });
            facturaAsociada.softRemove().catch((e) => {
              throw new InternalServerErrorException('Error: ' + e);
            });
          }
        }
      }
    } else if ([ProofType.FacturaA, ProofType.FacturaB, ProofType.FacturaX].includes(sale.proofType)) {
      //Si la factura tiene remito, desasociarla y no agregar el stock (ya que el remito resto el stock, no la factura)
      if (remito) {
        proofConfig.stock = 'NONE';
        remito.isRemitoUsed = false;
        remito.save().catch((e) => {
          throw new InternalServerErrorException('Error: ' + e);
        });
      }
    }

    if (proofConfig.debtAction != 'NONE') {
      if (sale.isDebt) {
        if (proofConfig.debtAction == 'ADD') {
          await sale.customer.editDebt('DEDUCT', !proofConfig.always, sale.amount);
        }
        else {
          await sale.customer.editDebt('ADD', !proofConfig.always, sale.amount);
        }
      }
    }

    if (proofConfig.stock != 'NONE') {
      for (const detail of sale.details) {
        const good = await this.goodsService.exists(detail.good.id);

        if (proofConfig.stock === 'DISCOUNT') this.stockService.return(detail.quantity, good, sale.pos, user);
        if (proofConfig.stock === 'ADD') this.stockService.sell(detail.quantity, good, sale.pos, user);
      }
    }

    sale.saleNumber = -1;

    await sale.save().catch((e) => {
      throw new InternalServerErrorException('Error: ' + e);
    });

    await sale.softRemove().catch((e) => {
      throw new InternalServerErrorException('Error: ' + e);
    });

    return { statusCode: 202, message: 'Comprobante borrado' };
  }

  async findByCustomer(customerId: number, params: IPaginationOptions) {
    const customer = await this.customersService.findOne(customerId);

    if (!params.where) {
      params.where = ['customer.id:' + customer.id]
    } else if (typeof (params.where) === 'string') {
      params.where = [params.where, 'customer.id:' + customer.id]
    } else if (typeof (params.where) === 'object') {
      params.where = [...params.where, 'customer.id:' + customer.id]
    }

    const hide = await this.settingsService.getS();

    return await this.salesRepository.findAndPaginate(params, hide);
  }

  async findAndPaginate(params: IPaginationOptions): Promise<Page<Sale>> {
    const hide = await this.settingsService.getS();

    return await this.salesRepository.findAndPaginate(params, hide);
  }

  async createReceipt(receiptDto: ReceiptDto, user: User) {
    const sale = new Sale();

    if (![ProofType.ReciboX, ProofType.Recibo].includes(receiptDto.proofType))
      throw new BadRequestException('El tipo es invalido');

    sale.customer = await this.customersService.exists(receiptDto.customer.id);
    sale.pos = await this.storesService.exists(receiptDto.pos.id);

    sale.pos.isPos();

    const proofConfig = this.getProofTypeConfig(receiptDto.proofType);

    sale.isDebt = true;

    sale.user = await this.usersService.exists(1);

    sale.customer.editDebt(proofConfig.debtAction, !proofConfig.always, receiptDto.amount);

    sale.amount = receiptDto.amount;

    sale.proofType = receiptDto.proofType;

    sale.saleNumber = await this.getLastNumber(receiptDto.proofType, receiptDto.pos.id) + 1;

    sale.commentary = receiptDto.commentary;

    return this.salesRepository.save(sale);
  }
}
