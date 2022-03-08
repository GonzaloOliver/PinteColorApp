import { IPaginationOptions, Page, paginate } from 'src/pagination';
import { Repository, EntityRepository } from 'typeorm';
import { Good } from './entities/good.entity';

@EntityRepository(Good)
export class GoodsRepository extends Repository<Good> {
  async findAndPaginate(params: IPaginationOptions): Promise<Page<Good>> {
    return await paginate<Good>(this, params);
  }

  async findOneByCode(code: string): Promise<Good> {
    return await this.findOne({ code: code });
  }
}
