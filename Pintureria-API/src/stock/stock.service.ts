import {
  BadRequestException,
  ConflictException,
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { GoodsService } from 'src/goods/goods.service';
import { StoresService } from 'src/stores/stores.service';
import { Good } from 'src/goods/entities/good.entity';
import { Store } from 'src/stores/entities/store.entity';
import { TransferStockDto, UpdateStockDto } from './dto';
import { Stock } from './entities/stock.entity';
import { StockRepository } from './stock.repository';
import { StockDto } from './dto/update.stock.dto';
import { StockHistoryService } from './stock-history/stock-history.service';
import { User } from 'src/users/entities/user.entity';
import { StockAction } from './stock-history/stock-action.enum';
import { Supplier } from 'src/suppliers/entities/supplier.entity';
import { IPaginationOptions, Page } from 'src/pagination';
import { getFilters } from 'src/pagination/getFilters';

@Injectable()
export class StockService {
  constructor(
    private readonly stockRepository: StockRepository,
    @Inject(forwardRef(() => GoodsService))
    private readonly goodsService: GoodsService,
    @Inject(forwardRef(() => StoresService))
    private readonly storesServices: StoresService,
    private readonly stockHistoryService: StockHistoryService,
  ) { }

  async initFromGood(good: Good) {
    const stores = await this.storesServices.findAll();
    const stocks: Stock[] = [];

    stores.forEach((store) => {
      const stock = new Stock({ store, good });
      stocks.push(stock);
    });

    return stocks;
  }

  async initFromStore(store: Store) {
    const goods = await this.goodsService.findAll();
    const stocks: Stock[] = [];

    goods.forEach((good) => {
      const stock = new Stock({ store, good });
      stocks.push(stock);
    });

    return stocks;
  }

  //Finds

  async findOneByGoodAndStore(goodId: number, storeId: number) {
    const stock = await this.stockRepository.findOneByGoodAndStore(goodId, storeId);

    if (!stock) throw new NotFoundException('Ocurrió un error al recuperar el stock');

    return stock;
  }

  async findByGood(goodId: number): Promise<Stock[]> {
    const goodStock = await this.stockRepository.findByGood(goodId);

    if (goodStock.length == 0) throw new NotFoundException('El articulo no existe');

    return goodStock;
  }

  async findByStore(storeId: number): Promise<Stock[]> {
    const storeStock = await this.stockRepository.findByStore(storeId);

    if (storeStock.length == 0) throw new NotFoundException('El depósito no existe');

    return storeStock;
  }

  async findAll(): Promise<Stock[]> {
    return this.stockRepository.find();
  }

  async findAllWithFilters(params: IPaginationOptions): Promise<Stock[]> {
    //If we receive just one order option, convert into string[] for correct foreach work
    if (typeof params.where === 'string') {
      params.where = [params.where];
    }

    //BUSQUEDA POR NOMBRE ARTICULO
    const goodName = params.where?.find((element) => element.includes('good.name'));
    let goods = [];

    if (goodName) {
      goods = await this.goodsService.findByName(goodName.split(':')[1]);
    }

    goods.forEach((element) => {
      params.where.push(`good.id:${element.id}`);
    });

    //BUSQUEDA POR CODE ARTICULO
    const goodCode = params.where?.find((element) => element.includes('good.code'));

    if (goodCode) {
      goods = await this.goodsService.findByCode(goodCode.split(':')[1]);
    }

    goods.forEach((element) => {
      params.where.push(`good.id:${element.id}`);
    });

    const searchOptions = await getFilters<Stock>(params);
    return await this.stockRepository.find({ ...searchOptions });
  }

  async findAndPaginate(params: IPaginationOptions): Promise<Page<Stock>> {
    return await this.stockRepository.findAndPaginate(params);
  }

  //Updates

  //Update one stock entity
  async updateOne(goodId: number, storeId: number, stockDto: StockDto, user: User): Promise<Stock> {
    const stock = new Stock();
    stock.setQuantity(stockDto.quantity);
    await this.stockRepository
      .update(
        {
          good: { id: goodId },
          store: { id: storeId },
        },
        stock,
      )
      .then(async () => {
        const updatedStock = await this.stockRepository.findOneByGoodAndStore(goodId, storeId);
        await this.saveToHistory(user, StockAction.ADD, stockDto.quantity, updatedStock, stockDto.description);
      })
      .catch((error) => {
        throw new NotFoundException(`Ocurrió un error al encontrar el stock: ${error}`);
      });

    return await this.stockRepository.findOneByGoodAndStore(goodId, storeId);
  }

  //Change
  async change(updateStockDto: UpdateStockDto, user: User) {
    for (const item of updateStockDto.stocks) {
      const oldStock = await this.stockRepository.findOneByGoodAndStore(item.goodId, item.storeId);
      const stock = new Stock();
      stock.setQuantity(item.quantity);

      await this.stockRepository
        .update(
          {
            good: { id: item.goodId },
            store: { id: item.storeId },
          },
          stock,
        )
        .then(async () => {
          const updatedStock = await this.stockRepository.findOneByGoodAndStore(item.goodId, item.storeId);
          await this.saveToHistory(
            user,
            StockAction.ADD,
            oldStock.getQuantity(),
            updatedStock,
            updateStockDto.description ? 'ACTUALIZACIÓN - ' + updateStockDto.description : 'ACTUALIZACIÓN',
          );
        })
        .catch((error) => {
          throw new NotFoundException([
            {
              message: `Ocurrió un error al encontrar el stock: ${error}`,
              stock: item,
            },
          ]);
        });
    }

    return { statusCode: 200, message: 'Stocks cambiados' };
  }

  //Add
  async add(updateStockDto: UpdateStockDto, user: User) {
    for (const item of updateStockDto.stocks) {
      const stockExists = await this.stockRepository.findOneByGoodAndStore(item.goodId, item.storeId);

      if (!stockExists)
        throw new NotFoundException([
          {
            message: 'Ocurrió un error al encontrar el stock',
            stock: item,
          },
        ]);

      stockExists.addQuantity(item.quantity);

      await this.stockRepository
        .update(
          {
            good: { id: item.goodId },
            store: { id: item.storeId },
          },
          stockExists,
        )
        .then(async () => {
          if (item.quantity < 0) {
            await this.saveToHistory(
              user,
              StockAction.DECREASE,
              item.quantity,
              stockExists,
              updateStockDto.description ? 'DISMINUIR - ' + updateStockDto.description : 'DISMINUIR',
              updateStockDto.supplier,
            );
          }
          else {
            await this.saveToHistory(
              user,
              StockAction.ADD,
              item.quantity,
              stockExists,
              updateStockDto.description ? 'AGREGAR - ' + updateStockDto.description : 'AGREGAR',
              updateStockDto.supplier,
            );
          }
        })
        .catch((error) => {
          throw new NotFoundException([
            {
              message: `Ocurrió un error al cambiar el stock: ${error}`,
              stock: item,
            },
          ]);
        });
    }

    return { statusCode: 200, message: 'Stocks agregados' };
  }

  //Transfer
  async transfer(transferStockDto: TransferStockDto, user: User) {
    const originStoreId = (await this.storesServices.exists(transferStockDto.originStoreId)).id;
    const destinationStoreId = (await this.storesServices.exists(transferStockDto.destinationStoreId)).id;

    if (originStoreId === destinationStoreId)
      throw new BadRequestException('La sucursal de origen y destino no puede ser la misma');

    for (const item of transferStockDto.stocks) {
      const originStockExists = await this.stockRepository.findOneByGoodAndStore(item.goodId, originStoreId);
      const destinationStockExists = await this.stockRepository.findOneByGoodAndStore(item.goodId, destinationStoreId);

      if (!originStockExists)
        throw new NotFoundException([
          {
            message: 'Ocurrió un error al encontrar el stock de origen',
            stock: item,
          },
        ]);

      if (!destinationStockExists)
        throw new NotFoundException([
          {
            message: 'Ocurrió un error al encontrar el stock de destino',
            stock: item,
          },
        ]);

      originStockExists.decreaseQuantity(item.quantity);
      destinationStockExists.addQuantity(item.quantity);

      await this.stockRepository
        .update(
          {
            good: { id: item.goodId },
            store: { id: originStoreId },
          },
          originStockExists,
        )
        .catch((error) => {
          throw new NotFoundException([
            {
              message: `Ocurrió un error al quitar el stock de origen: ${error}`,
              stock: item,
            },
          ]);
        });

      await this.stockRepository
        .update(
          {
            good: { id: item.goodId },
            store: { id: destinationStoreId },
          },
          destinationStockExists,
        )
        .then(async () => {
          await this.saveToHistory(
            user,
            StockAction.TRANSFER,
            item.quantity,
            destinationStockExists,
            transferStockDto.description ? 'TRANSFERENCIA - ' + transferStockDto.description : 'TRANSFERENCIA',
            originStockExists.store,
          );
        })
        .catch((error) => {
          throw new NotFoundException([
            {
              message: `Ocurrió un error al agregar el stock de destino: ${error}`,
              stock: item,
            },
          ]);
        });
    }

    return { statusCode: 200, message: 'Stocks transferidos' };
  }

  //SELL
  async sell(quantity: number, good: Good, store: Store, user: User) {
    const stockExists = await this.stockRepository.findOneByGoodAndStore(good.id, store.id);

    if (!stockExists)
      throw new NotFoundException([
        {
          message: 'Ocurrió un error al encontrar el stock',
          stock: {
            good: good,
            store: store,
          },
        },
      ]);

    stockExists.addQuantity(quantity * -1);

    await this.stockRepository
      .update(
        {
          good: { id: good.id },
          store: { id: store.id },
        },
        stockExists,
      )
      .then(async () => {
        const stockAction = StockAction.DECREASE;
        await this.saveToHistory(
          user,
          stockAction,
          quantity,
          stockExists,
          'VENTA',
          store,
        );
      })
      .catch((error) => {
        throw new NotFoundException([
          {
            message: `Ocurrió un error al cambiar el stock: ${error}`,
            stock: {
              good: good,
              store: store,
            },
          },
        ]);
      });
  }

  //SELL
  async return(quantity: number, good: Good, store: Store, user: User) {
    const stockExists = await this.stockRepository.findOneByGoodAndStore(good.id, store.id);

    if (!stockExists)
      throw new NotFoundException([
        {
          message: 'Ocurrió un error al encontrar el stock',
          stock: {
            good: good,
            store: store,
          },
        },
      ]);

    stockExists.addQuantity(quantity);

    await this.stockRepository
      .update(
        {
          good: { id: good.id },
          store: { id: store.id },
        },
        stockExists,
      )
      .then(async () => {
        const stockAction = StockAction.DECREASE;
        await this.saveToHistory(
          user,
          stockAction,
          quantity,
          stockExists,
          'DEVOLUCIÓN',
          store,
        );
      })
      .catch((error) => {
        throw new NotFoundException([
          {
            message: `Ocurrió un error al cambiar el stock: ${error}`,
            stock: {
              good: good,
              store: store,
            },
          },
        ]);
      });
  }

  //Save history
  async saveToHistory(
    user: User,
    action: StockAction,
    quantity: number,
    applyTo: Stock,
    description: string,
    source?: Store | Supplier,
  ) {
    switch (action) {
      case StockAction.ADD:
        if (source instanceof Store) throw new ConflictException('Al agregar stock el origen debe ser un proveedor');

        this.stockHistoryService.addStockHistory(user, quantity, applyTo, source, description);

        break;

      case StockAction.DECREASE:
        this.stockHistoryService.decreaseStockHistory(user, quantity, applyTo, description);

        break;

      case StockAction.TRANSFER:
        if (source instanceof Supplier)
          throw new ConflictException('Al transferir stock el origen no puede ser un proveedor');

        this.stockHistoryService.transferStockHistory(user, quantity, applyTo, source, description);

        break;

      case StockAction.CHANGE:
        if (source instanceof Supplier)
          throw new ConflictException('Al transferir stock el origen no puede ser un proveedor');

        this.stockHistoryService.changeStockHistory(user, quantity, applyTo);

        break;

      default:
        throw new InternalServerErrorException('Error al agregar el historial de stock');
        break;
    }
  }
}
