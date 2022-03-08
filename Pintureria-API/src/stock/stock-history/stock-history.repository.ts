import { IPaginationOptions, Page, paginate } from 'src/pagination';
import { Repository, EntityRepository } from 'typeorm';
import { StockHistory } from './entities/stock-history.entity';
@EntityRepository(StockHistory)
export class StockHistoryRepository extends Repository<StockHistory> {
  findAndPaginate(params: IPaginationOptions): Promise<Page<StockHistory>> {
    return paginate<StockHistory>(this, params);
  }

  async findOneByGoodAndStore(goodId: number, storeId: number): Promise<StockHistory> {
    return this.createQueryBuilder('stock')
      .where('stock.good_id = :goodId', { goodId })
      .andWhere('stock.store_id = :storeId', { storeId })
      .leftJoinAndSelect('stock.good', 'good')
      .leftJoinAndSelect('stock.store', 'store')
      .getOne();
  }

  async findByGood(goodId: number): Promise<StockHistory[]> {
    return this.createQueryBuilder('stock')
      .leftJoinAndSelect('stock.store', '*')
      .where('stock.good_id = :goodId', { goodId })
      .getMany();
  }

  async findByStore(storeId: number): Promise<StockHistory[]> {
    return this.createQueryBuilder('stock')
      .leftJoinAndSelect('stock.good', '*')
      .where('stock.store_id = :storeId', { storeId })
      .getMany();
  }
}
