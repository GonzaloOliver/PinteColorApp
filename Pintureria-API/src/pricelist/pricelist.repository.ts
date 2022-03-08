import { IPaginationOptions, Page, paginate } from 'src/pagination';
import { Repository, EntityRepository } from 'typeorm';
import { PriceList } from './entities/pricelist.entity';

@EntityRepository(PriceList)
export class PriceListRepository extends Repository<PriceList> {
  findByName(name: string): Promise<PriceList> {
    return this.findOne({ name: name });
  }

  findAndPaginate(params: IPaginationOptions): Promise<Page<PriceList>> {
    return paginate<PriceList>(this, params);
  }
}
