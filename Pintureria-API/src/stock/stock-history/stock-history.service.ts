import { Injectable } from '@nestjs/common';
import { IPaginationOptions, Page } from 'src/pagination';
import { Store } from 'src/stores/entities/store.entity';
import { Supplier } from 'src/suppliers/entities/supplier.entity';
import { User } from 'src/users/entities/user.entity';
import { Stock } from '../entities/stock.entity';
import { StockHistory } from './entities/stock-history.entity';
import { StockAction } from './stock-action.enum';
import { StockHistoryRepository } from './stock-history.repository';

@Injectable()
export class StockHistoryService {
  constructor(private readonly stockHistoryRepository: StockHistoryRepository) {}

  async addStockHistory(user: User, quantity: number, applyTo: Stock, source: Supplier, description?: string) {
    const stockHistory = new StockHistory(
      StockAction.ADD,
      user,
      quantity,
      applyTo,
      description ? description : null,
      source,
    );

    this.stockHistoryRepository.save(stockHistory);
  }

  async decreaseStockHistory(user: User, quantity: number, applyTo: Stock, description?: string) {
    const stockHistory = new StockHistory(StockAction.ADD, user, quantity, applyTo, description ? description : null);

    this.stockHistoryRepository.save(stockHistory);
  }

  async transferStockHistory(user: User, quantity: number, applyTo: Stock, source: Store, description?: string) {
    const stockHistory = new StockHistory(
      StockAction.TRANSFER,
      user,
      quantity,
      applyTo,
      description ? description : null,
      source,
    );

    this.stockHistoryRepository.save(stockHistory);
  }

  async changeStockHistory(user: User, oldQuantity: number, applyTo: Stock, description?: string) {
    const stockHistory = new StockHistory(
      StockAction.CHANGE,
      user,
      oldQuantity,
      applyTo,
      description ? description : null,
    );

    this.stockHistoryRepository.save(stockHistory);
  }

  async findAndPaginate(params: IPaginationOptions): Promise<Page<StockHistory>> {
    return this.stockHistoryRepository.findAndPaginate(params);
  }
}
