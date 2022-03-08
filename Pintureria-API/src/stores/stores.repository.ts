import { IPaginationOptions, Page, paginate } from 'src/pagination';
import { Repository, EntityRepository } from 'typeorm';
import { Store } from './entities/store.entity';

@EntityRepository(Store)
export class StoresRepository extends Repository<Store> {
  async findOneByPosFiscalNumber(posFiscalNumber: string) {
    return await this.findOne({ posFiscalNumber: posFiscalNumber }, { withDeleted: true });
  }

  findAndPaginate(params: IPaginationOptions): Promise<Page<Store>> {
    return paginate<Store>(this, params);
  }
}
