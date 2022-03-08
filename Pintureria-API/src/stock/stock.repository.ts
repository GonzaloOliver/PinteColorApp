import { IPaginationOptions, Page, paginate } from 'src/pagination';
import { Repository, EntityRepository } from 'typeorm';
import { Stock } from './entities/stock.entity';
@EntityRepository(Stock)
export class StockRepository extends Repository<Stock> {
  async findOneByGoodAndStore(goodId: number, storeId: number): Promise<Stock> {
    return this.createQueryBuilder('stock')
      .where('stock.good_id = :goodId', { goodId })
      .andWhere('stock.store_id = :storeId', { storeId })
      .leftJoinAndSelect('stock.good', 'good')
      .leftJoinAndSelect('stock.store', 'store')
      .getOne();
  }
  async findAndPaginate(params: IPaginationOptions): Promise<Page<Stock>> {
    return await paginate<Stock>(this, params);
  }
  async findByGood(goodId: number): Promise<Stock[]> {
    return this.createQueryBuilder('stock')
      .leftJoinAndSelect('stock.store', '*')
      .where('stock.good_id = :goodId', { goodId })
      .getMany();
  }

  async findByStore(storeId: number): Promise<Stock[]> {
    return this.createQueryBuilder('stock')
      .leftJoinAndSelect('stock.good', '*')
      .where('stock.store_id = :storeId', { storeId })
      .getMany();
  }
}
